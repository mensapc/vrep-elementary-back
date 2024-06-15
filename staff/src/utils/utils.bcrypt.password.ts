import bcrypt from "bcrypt";
import CustomError from "./CustomError";

class BcryptPassword {
  PasswordCompare = async (
    requestPassword: string,
    savedPassword: string
  ): Promise<boolean> => {
    if (!savedPassword || !requestPassword) {
      throw new CustomError("Invalid credentials", 401);
    }
    const passwordMatch = await bcrypt.compare(requestPassword, savedPassword);
    if (!passwordMatch) {
      throw new CustomError("Invalid credentials", 401);
    }
    return passwordMatch;
  };

  HashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  };
}

export default BcryptPassword;
