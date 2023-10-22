const BcryptPassword = require("../utils/utils.bcrypt.password");
const CustomError = require("./CustomError");

class RegistrationUtils {
  constructor() {
    this.bcryptPassword = new BcryptPassword();
  }
  validateData = (data, userType) => {
    const {
      email,
      role,
      first_name,
      last_name,
      age,
      dob,
      address,
      health_condition,
      parent_name,
      parent_phone,
      parent_occupation,
    } = data;

    try {
      // Validate data presence

      // Email format validation
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        throw new CustomError("Invalid email format", 400);
      }

      if (first_name.length < 3 || last_name.length < 3) {
        throw new CustomError("firt name or last name should be at least 3 characters");
      }

      // Password length validation
      if ((userType === "staff" || userType === "admin") && password.length < 8) {
        throw new CustomError("Password must be at least 8 characters", 400);
      }
      if ((userType === "staff" || userType === "admin") && age < 18) {
        throw new CustomError("User must be older than 18");
      }
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new Error("Registration failed");
    }
  };

  sanitizeData = async (data) => {
    // Sanitize and normalize inputs
    const { email, role } = data;
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedRole = role.trim().toLowerCase();

    return {
      email: sanitizedEmail,
      role: sanitizedRole,
    };
  };
}

module.exports = RegistrationUtils;
