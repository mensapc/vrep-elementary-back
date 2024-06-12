    // tests/roles.test.ts
    import { UserRole } from '../interface/roles.interface';
    import { userRoles } from '../utils/utils.roles';

    describe('Testing UserRole Interface and userRoles object to pass specific roles', () => {
    test('userRoles should match UserRole interface structure', () => {
        const roles: UserRole = userRoles;
        expect(roles).toBeDefined();
    });

    test('admin role should have specific permissions', () => {
        const adminPermissions = userRoles.admin;
        const expectedPermissions = [
        "searchStudent",
        "createHeadTeacher",
        "studentCourse",
        "createStudent",
        "createStaff",
        "createAdmin",
        "readStudent",
        "updateStudent",
        "deleteStudent",
        "readStudents",
        "readStaff",
        "deleteStaff",
        "updateStaff",
        "createCourse",
        "staffToCourse",
        "readCourse",
        "deletecourse",
        "updateCourse",
        "createClass",
        "readClass",
        "deleteClass",
        "updateClass",
        "createCourseData",
        "getCoursesScheme",
        "updateScheme",
        "getExams",
        "createRole",
        "readRoles",
        "createUserRole",
        "createAdmin",
        "getExamSummary",
        "teacherCourse",
        "courseClass",
        "searchGrade",
        "updateGrade",
        "createAttendance",
        "readAttendance",
        "updateAttendance",
        "createTimetable",
        "getAllTimetables",
        "updateTimetable",
        "deleteTimetable",
        "createEvent",
        "getAllEvents",
        "updateEvent",
        "deleteEvent",
        "examResult",
        "activities",
        "teacherData",
        "getTimetable",
        "studentData",
        "getTeachersExam",
        "sendlink",
        "staffToClass",
        "getAllOptions",
        "readOptionsPerQuestion",
        ];
        expect(adminPermissions).toEqual(expect.arrayContaining(expectedPermissions));
    });

    test('headTeacher role should have specific permissions', () => {
        const headTeacherPermissions = userRoles.headTeacher;
        const expectedPermissions = [
        "getCoursesScheme",
        "updateScheme",
        "getExams",
        "createRole",
        "readRoles",
        "createUserRole",
        "getExamSummary",
        "teacherCourse",
        "courseClass",
        "searchGrade",
        "updateGrade",
        "createAttendance",
        "readAttendance",
        "updateAttendance",
        "createTimetable",
        "getAllTimetables",
        "updateTimetable",
        "deleteTimetable",
        "createEvent",
        "getAllEvents",
        "updateEvent",
        "deleteEvent",
        "examResult",
        "activities",
        "teacherData",
        "getTimetable",
        "studentData",
        "getTeachersExam",
        "sendlink",
        "staffToClass",
        "getAllOptions",
        "readOptionsPerQuestion",
        ];
        expect(headTeacherPermissions).toEqual(expect.arrayContaining(expectedPermissions));
    });

    test('staff role should have specific permissions', () => {
        const staffPermissions = userRoles.staff;
        const expectedPermissions = [
        "searchStudent",
        "readStudent",
        "readStudents",
        "updateCourse",
        "createClass",
        "deleteClass",
        "staffToCourse",
        "updateClass",
        "teacherCourse",
        "createCourse",
        "readClass",
        "updateScheme",
        "getCoursesScheme",
        "createExam",
        "updateExam",
        "deleteExam",
        "createQuestion",
        "updateQuestion",
        "deleteQuestion",
        "createOption",
        "updateOption",
        "deleteOption",
        "createAttendance",
        "readAttendance",
        "createUserRole",
        "getExamSummary",
        "searchGrade",
        "updateGrade",
        "updateAttendance",
        "createTimetable",
        "getAllTimetables",
        "updateTimetable",
        "deleteTimetable",
        "examResult",
        "teacherData",
        "getTimetable",
        "deletecourse",
        "getTeachersExam",
        "studentCourse",
        "getAllOptions",
        "readOptionsPerQuestion",
        ];
        expect(staffPermissions).toEqual(expect.arrayContaining(expectedPermissions));
    });

    test('pupil role should have specific permissions', () => {
        const pupilPermissions = userRoles.pupil;
        const expectedPermissions = [
        "readStudent",
        "createAnswer",
        "updateAnswer",
        "studentData",
        "readOptionsPerQuestion",
        ];
        expect(pupilPermissions).toEqual(expect.arrayContaining(expectedPermissions));
    });
    });
