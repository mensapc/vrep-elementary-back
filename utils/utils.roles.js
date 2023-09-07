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
    "createQuestion",
    "createOption",
    "updateExam",
    "updateOption",
  ],
  pupil: ["readStudent", "createAnswer"],
};

module.exports = userRoles;
