CalculateResults = (exam, answers) => {
  const questionMap = new Map();
  const result = {
    _id: exam._id,
    name: exam.name,
    description: exam.description,
    max_score: exam.max_score,
    time_limit: exam.time_limit,
    start_date: exam.start_date,
    end_date: exam.end_date,
    totalMarks: 0,
    scoredMarks: 0,
    overview: [],
  };

  for (const question of exam.questions) {
    questionMap.set(question._id.toString(), {
      content: question.content,
      points: question.points,
      correctOption: question.options.find((opt) => opt.is_correct),
    });

    result.totalMarks += question.points;
  }

  for (const answer of answers) {
    const questionInfo = questionMap.get(answer.question._id.toString());
    if (!questionInfo) continue;

    const isCorrect = answer.chosen_option.is_correct;
    const scoredMarks = isCorrect ? questionInfo.points : 0;

    result.scoredMarks += scoredMarks;
    result.overview.push({
      question: {
        _id: answer.question._id,
        content: questionInfo.content,
        points: questionInfo.points,
      },
      correctAnswer: questionInfo.correctOption,
      studentAnswer: answer.chosen_option,
      isCorrect: isCorrect,
    });
  }

  return result;
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

module.exports = { CalculateResults, checkExamAvailability, examDuration, validateExamDuration };
