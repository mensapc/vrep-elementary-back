const Grade = require('../models/grade');

const checkGradeExistence = async (exam_id, student_id) => {
  const gradeExist = await Grade.findOne({ exam: exam_id, student: student_id });
  return gradeExist;
};

module.exports = { checkGradeExistence };
