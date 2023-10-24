const { Query } = require("firefose");
const Admin = require("../models/admin");
const UserRoleController = require("./user_role.controller");
const CustomError = require("../utils/CustomError");
const generateToken = require("../utils/utils.token");
const BcryptPassword = require("../utils/utils.bcrypt.password");
const registrationUtils = require("../utils/utils.registration");

class AdminController {
  constructor() {
    this.userRoleController = new UserRoleController();
    this.bcryptPassword = new BcryptPassword();
    this.registrationUtils = new registrationUtils();
  }

  register = async (req, res, next) => {
    const userData = req.body;

    try {
      this.registrationUtils.validateData(userData, "admin");
      const admin = await this.findByEmail(userData.email);
      if (admin) throw new CustomError("Admin already exists", 400);
      const hashedPassword = await this.bcryptPassword.HashPassword(userData.password);

      const newAdmin = await Admin.create({ ...userData, password: hashedPassword });
      await this.userRoleController.create({ role_id: userData.role_id, user_id: newAdmin.id });
      const token = generateToken({ user_id: newAdmin.id, email: newAdmin.email });
      res.status(200).json({ admin: newAdmin, token });
    } catch (error) {
      console.error(`Error registering admin: ${error}`);
      next(error);
    }
  };

  login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const admin = await this.findByEmail(email);
      if (!admin) throw new CustomError("Admin not found", 404);
      const comparedPassword = await this.bcryptPassword.PasswordCompare(password, admin.password);
      if (!comparedPassword) throw new CustomError("Invalid credentials", 400);

      const { token, refreshToken } = generateToken({ user_id: admin.id, email: admin.email });
      res.status(200).json({ admin, token, refreshToken });
    } catch (error) {
      console.error("Error logging in admin:", error);
      next(error);
    }
  };

  findByEmail = async (email) => {
    try {
      const query = new Query().where("email", "==", email);
      let admin = await Admin.find(query);
      admin = admin[0];
      return admin;
    } catch (error) {
      console.error("Error finding admin:", error);
      throw new Error(error);
    }
  };

  refreshToken = async (req, res, next) => {
    const refreshToken = req.body.refreshToken;

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      const accessToken = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
      });

      res.json({ accessToken });
    });
  };

}

module.exports = AdminController;
