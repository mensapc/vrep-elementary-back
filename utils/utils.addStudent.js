
const CustomError = require('./CustomError');

class RegistrationUtils {

    validateStudentInfo = (data, userType) => {
        const { email, dob, first_name, last_name, address, phone_number, role, } = data;
        try {
            if (!email || !dob || !first_name || !last_name || !phone_number || !role || !address) {
                throw new CustomError(
                    ' email, dob, first_name, last_name, address, age, phone_number, role are required',
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

        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new Error('Registration failed***');
        }
    };

    prepareData = async (data) => {
        // Sanitize and normalize inputs
        const { email, role, } = data;
        const sanitizedEmail = email.trim().toLowerCase();
        const sanitizedRole = role.trim().toLowerCase();

        return {
            email: sanitizedEmail,
            role: sanitizedRole,
        };
    };
}

module.exports = RegistrationUtils;