const Result = require('../models/result');

const checkResultExistence = async (exam_id, student_id) => {
  const resultExist = await Result.findOne({ exam: exam_id, student: student_id });
  return resultExist;
};

const groupedStudentsResults = (results) => {
  const uniqueResults = [];
  const uniqueIds = new Set();
  results.forEach((result) => {
    if (!uniqueIds.has(result.student._id.toString())) {
      uniqueIds.add(result.student._id.toString());
      uniqueResults.push(result);
    }
  });

  return uniqueResults;
};

const findResultMarks = (results) => {
  const hash = {};
  results.forEach((result) => {
    if (hash[result.course._id]) {
      hash[result.course._id].score += Number(result.score);
      hash[result.course._id].total += Number(result.total);
      const percentage = (hash[result.course._id].score / hash[result.course._id].total) * 100;
      hash[result.course._id].percentage = parseFloat(percentage.toFixed(1));
    } else {
      hash[result.course._id] = {
        course: result.course.name,
        score: result.score,
        total: result.total,
        percentage: parseFloat(((result.score / result.total) * 100).toFixed(1)),
      };
    }
  });
  return Object.values(hash);
};

const uniqueResultsCourses = (results) => {
  let classCount = 0;
  const hash = {};

  results.forEach((result) => {
    const course = result.course;
    if (!hash[course._id]) {
      classCount += 1;
      hash[course._id] = 1;
    }
  });
  return classCount;
};

module.exports = {
  checkResultExistence,
  groupedStudentsResults,
  findResultMarks,
  uniqueResultsCourses,
};
