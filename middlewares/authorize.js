const userRoles = require("../utils/utils.roles");
const CustomError = require("../utils/CustomError.js");
const UserRoleController = require("../controllers/user_role.controller");
const RoleController = require("../controllers/role.controller");

const userRoleController = new UserRoleController();
const roleController = new RoleController();

const authorize = (permissions) => {
  return async (req, res, next) => {
    try {
      const userRole = await userRoleController.getByUserId(req.user.user_id);
      if (!userRole) throw new CustomError("Unauthorized", 401);

      const role = await roleController.findById(userRole.role_id);
      if (!role || !role.name || !userRoles[role.name]) throw new CustomError("Unauthorized", 401);
      const userPermissions = userRoles[role.name];
      const hasPermission = permissions.some((permission) => userPermissions.includes(permission));
      if (hasPermission) next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { authorize };
