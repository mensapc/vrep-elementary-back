const { Query } = require("firefose");
const UserRole = require("../models/user_role");
const CustomError = require("../utils/CustomError");

class UserRoleController {
  create = async ({ role_id, user_id }) => {
    try {
      const query = new Query().where("user_id", "==", user_id);
      const userRoleExists = await UserRole.find(query);
      if (userRoleExists.length > 0) throw new CustomError("User exist with another role", 400);
      const newUserRole = await UserRole.create({ role_id, user_id });
      return { user_role: newUserRole };
    } catch (error) {
      console.error(`Error creating user role: ${error}`);
      throw new Error(error);
    }
  };

  getByUserId = async (id) => {
    try {
      const query = new Query().where("user_id", "==", id);
      let userRole = await UserRole.find(query);
      userRole = userRole[0];
      return userRole;
    } catch (error) {
      console.error(`Error getting user roles: ${error}`);
      throw new Error(error);
    }
  };
}

module.exports = UserRoleController;
