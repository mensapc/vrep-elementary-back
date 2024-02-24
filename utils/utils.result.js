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

module.exports = { checkResultExistence, groupedStudentsResults };
