const userRoles = {
  admin: [
    "createStudent",
    "createStaff",
    "createAdmin",
    "readStudent",
    "updateStudent",
    "deleteStudent",
    "readStudents",
    "getExams",
  ],
  staff: [
    "readStudent",
    "readStudents",
    "createExam",
    "updateExam",
    "deleteExam",
    "createQuestion",
    "deleteQuestion",
    "createOption",
    "updateOption",
    "deleteOption",
  ],
  pupil: ["readStudent", "createAnswer"],
};

module.exports = userRoles;
