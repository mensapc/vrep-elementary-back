const userRoles = {
  admin: [
    "createStudent",
    "createStaff",
    "createAdmin",
    "readStudent",
    "updateStudent",
    "deleteStudent",
    "readStudents",
  ],
  staff: ["readStudent", "readStudents", "createExam"],
  pupil: ["readStudent"],
};

module.exports = userRoles;
