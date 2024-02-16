const userRoles = {
  admin: [
    'searchStudent',
    'createStudent',
    'createStaff',
    'createAdmin',
    'readStudent',
    'updateStudent',
    'deleteStudent',
    'readStudents',
    'readStaff',
    'deleteStaff',
    'updateStaff',
    'createCourse',
    'readCourse',
    'deletecourse',
    'updateCourse',
    'createClass',
    'readClass',
    'deleteClass',
    'updateClass',
    'createCourseData',
    'getCoursesScheme',
    'updateScheme',
    'getExams',
    'createRole',
    'readRoles',
    'createUserRole',
    'createAdmin',
    'getExamSummary',
    'teacherCourse',
    'courseClass',
    'searchGrade',
    'updateGrade',
    'createAttendance',
    'updateAttendance',
    'createTimetable',
  ],
  staff: [
    'searchStudent',
    'readStudent',
    'readStudents',
    'updateCourse',
    'createClass',
    'teacherCourse',

    'readClass',
    'updateScheme',
    'getCoursesScheme',
    'createExam',
    'updateExam',
    'deleteExam',
    'createQuestion',
    'updateQuestion',
    'deleteQuestion',
    'createOption',
    'updateOption',
    'deleteOption',
    'createAttendance',
    'createUserRole',
    'getExamSummary',
    'searchGrade',
    'updateGrade',
    'updateAttendance',
    'createTimetable',
  ],
  pupil: ['readStudent', 'createAnswer', 'updateAnswer'],
};

module.exports = userRoles;
