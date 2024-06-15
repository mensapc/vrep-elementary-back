import BcryptPassword from "./utils.bcrypt.password";
import CustomError from "./CustomError";

class RegistrationUtils {
  private bcryptPassword: BcryptPassword;

  constructor() {
    this.bcryptPassword = new BcryptPassword();
  }

  validateData = (data: any, userType: any) => {
    const { email, password, first_name, last_name } = data;
    try {
      if (!first_name || !last_name) {
        throw new CustomError("First name and last name are required", 400);
      }

      if (userType === "staff" || userType === "admin") {
        if (!password || !email) {
          throw new CustomError("Email and Password are required", 400);
        }

        if (password.length < 8) {
          throw new CustomError("Password must be at least 8 characters", 400);
        }

        // Email format validation
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
          throw new CustomError("Invalid email format", 400);
        }
      }

      if (first_name.length < 3 || last_name.length < 3) {
        throw new CustomError(
          "First name or last name should be at least 3 characters",
          400
        );
      }
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new Error(`Registration failed: ${error}`);
    }
  };

  prepareData = async (data: any) => {
    // Sanitize and normalize inputs
    const { email, password, role } = data;
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedRole = role.trim().toLowerCase();

    // Hash password
    const hashedPassword = await this.bcryptPassword.HashPassword(password);

    return {
      email: sanitizedEmail,
      password: hashedPassword,
      role: sanitizedRole,
    };
  };
}

export default RegistrationUtils;
