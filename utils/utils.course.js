
const CustomError = require('./CustomError');

class CourseRegistrationUtils {

    validateCourseInfo = (data, userType) => {
        const { course_name, description } = data;
        try {
            if (!course_name || !description) {
                throw new CustomError(
                    ' course_name  , description are required',
                    400
                );
            }

        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new Error('Registration for course failed');
        }
    };

    prepareData = async (data) => {
        // Sanitize and normalize inputs
        const { course_name } = data;
        const sanitizedCourseName = course_name.trim().toUpperCase();

        return {
            course_name: sanitizedCourseName,
        };
    };
}

module.exports = CourseRegistrationUtils;