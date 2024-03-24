const Answer = require('../models/answer');
const Exam = require('../models/exam');
const CustomError = require('./CustomError');

const CalculateResults = (exam, answers) => {
  const questionMap = new Map();
  const { questions, ...examData } = exam._doc;
  const result = {
    ...examData,
    totalMarks: 0,
    scoredMarks: 0,
    percentage: 0,
    overview: [],
  };

  for (const question of exam.questions) {
    questionMap.set(question._id.toString(), {
      content: question.content,
      correctOption: question.options.find((opt) => opt.is_correct),
    });
    result.totalMarks += exam.marks_per_question;
  }

  for (const answer of answers) {
    const questionInfo = questionMap.get(answer.question._id.toString());
    if (!questionInfo) continue;

    const isCorrect = answer.chosen_option.is_correct;
    const scoredMarks = isCorrect ? exam.marks_per_question : 0;

    result.scoredMarks += scoredMarks;
    result.overview.push({
      question: {
        _id: answer.question._id,
        content: questionInfo.content,
      },
      correctAnswer: questionInfo.correctOption,
      studentAnswer: answer.chosen_option,
      isCorrect: isCorrect,
    });
  }

  result.percentage = (result.scoredMarks / result.totalMarks) * 100;

  return result;
};

const ExamDetailsAndAnswers = async (examId, studentId) => {
  const exam = await Exam.findById(examId).populate({
    path: 'questions',
    populate: { path: 'options' },
  });

  if (!exam) {
    throw new CustomError('Exam not found', 404);
  }

  const answers = await Answer.find({ student: studentId, exam: examId })
    .populate({ path: 'question', select: '_id points' })
    .populate('chosen_option');
  if (!answers.length) {
    throw new CustomError('No answers found for this exam', 404);
  }
  return { exam, answers };
};

const ExamTimeInMilliseconds = (exam) => {
  const currentTime = new Date();
  const examStartTime = new Date(exam.start_date);
  const examEndTime = new Date(exam.end_date);
  return { currentTime, examStartTime, examEndTime };
};

const timeConverter = (time) => {
  const days = Math.floor(time / 86400000);
  const hours = Math.floor((time % 86400000) / 3600000);
  const minutes = Math.floor((time % 3600000) / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  return { days, hours, minutes, seconds };
};

const validateExamDuration = (exam) => {
  const { start_date, end_date } = exam;
  if (!start_date || !end_date) {
    return { is_valid: false, message: 'Exam start time and exam end time must be provided.' };
  }

  const { examStartTime, examEndTime, currentTime } = ExamTimeInMilliseconds(exam);

  if (examStartTime < currentTime || examEndTime < currentTime) {
    return { is_valid: false, message: 'Exam start time and exam end time must be in the future.' };
  }

  if (examStartTime >= examEndTime) {
    return { is_valid: false, message: 'Exam start time must be before exam end time.' };
  }
  return { is_valid: true };
};

const examDuration = (exam) => {
  const { examStartTime, examEndTime } = ExamTimeInMilliseconds(exam);

  const { hours, minutes, seconds } = timeConverter(examEndTime - examStartTime);
  let duration = '';
  if (hours > 0) duration += `${hours} hr `;
  if (minutes > 0) duration += `${minutes} min `;
  if (seconds > 0) duration += `${seconds} sec`;

  return { is_valid: true, duration: duration.trim() };
};

const checkExamAvailability = (exam) => {
  const { currentTime, examStartTime, examEndTime } = ExamTimeInMilliseconds(exam);
  if (currentTime < examStartTime) {
    const { days, hours, minutes, seconds } = timeConverter(examStartTime - currentTime);

    let message = '';

    if (days > 1) message += `${days} days `;
    if (hours > 0 && hours < 24) message += `${hours} hours `;
    if (minutes > 0) message += `${minutes} minutes `;
    if (seconds > 0) message += `${seconds} seconds `;

    return { is_available: false, message: `The exam will be available in ${message.trim()}.` };
  } else if (currentTime > examEndTime) {
    return { is_available: false, message: 'The exam is no longer available.' };
  } else {
    return { is_available: true };
  }
};

const getTimeRangePupilTookExam = (exam) => {
  const { currentTime } = ExamTimeInMilliseconds(exam);
  const examStartTime = new Date(exam.start_date);
  const examEndTime = new Date(exam.end_date);

  let startTime = '';
  let endTime = '';

  // If the current time is before the exam start time, set start time as exam start time
  if (currentTime < examStartTime) {
    startTime = examStartTime;
  } else {
    startTime = currentTime;
  }

  // If the current time is after the exam end time, set end time as exam end time
  if (currentTime > examEndTime) {
    endTime = examEndTime;
  } else {
    endTime = currentTime;
  }

  // Calculate the duration
  const { hours: startHours, minutes: startMinutes, seconds: startSeconds } = timeConverter(startTime - examStartTime);
  const { hours: endHours, minutes: endMinutes, seconds: endSeconds } = timeConverter(examEndTime - endTime);

  const startDuration = `${startHours} hr ${startMinutes} min ${startSeconds} sec`;
  const endDuration = `${endHours} hr ${endMinutes} min ${endSeconds} sec`;

  return { startDuration, endDuration };
};


module.exports = {
  getTimeRangePupilTookExam,
  CalculateResults,
  checkExamAvailability,
  examDuration,
  validateExamDuration,
  ExamDetailsAndAnswers,
};
