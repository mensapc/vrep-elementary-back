
const CustomError = require('./CustomError');

class RegistrationUtils {

    validateStudentInfo = (data, userType) => {
        const { email, health_condition, dob, first_name, last_name, address, age, parents_name, parents_occupation, parents_phone, role, } = data;
        console.log(data);
        try {
            if (!email || !health_condition || !dob || !first_name || !last_name || !address || !age || !parents_name || !parents_occupation || !parents_phone || !role) {
                throw new CustomError(
                    ' email, health_condition, dob, first_name, last_name, address, age, parents_name, parents_occupation, parents_phone, role are required',
                    400
                );
            }
            // Email format validation
            const emailRegex = /^\S+@\S+\.\S+$/;
            if (!emailRegex.test(email)) {
                throw new CustomError('Invalid email format', 400);
            }

            if (first_name.length < 3 || last_name.length < 3) {
                throw new CustomError('firt name or last name should be at least 3 characters', 400);
            }

            if ((userType === 'student' || userType === 'pupil') && age < 0) {
                throw new CustomError('User must be older than 18');
            }
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new Error('Registration failed');
        }
    };

    prepareData = async (data) => {
        // Sanitize and normalize inputs
        const { email, role, parents_name, parents_occupation } = data;
        const sanitizedEmail = email.trim().toLowerCase();
        const sanitizedRole = role.trim().toLowerCase();
        const sanitizedOccupation = parents_occupation.trim().toLowerCase();
        const sanitizedParentsName = parents_name.trim().toLowerCase()

        return {
            email: sanitizedEmail,
            role: sanitizedRole,
            parents_name: sanitizedParentsName,
            parents_occupation: sanitizedOccupation
        };
    };
}

module.exports = RegistrationUtils;