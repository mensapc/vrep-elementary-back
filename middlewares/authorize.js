const userRoles = require('../utils/utils.roles');
const CustomError = require('../utils/CustomError.js');

const authorize = (permissions) => {
  return (req, res, next) => {
    const userRole = req && req.user && req.user.role;
    if (!userRole || !userRoles[userRole]) throw new CustomError('Unauthorized', 401);
    const userPermissions = userRoles[userRole];
    const hasPermission = permissions.some((permission) => userPermissions.includes(permission));
    if (hasPermission) next();
    else throw new CustomError('Unauthorized', 401);
  };
};

module.exports = { authorize};
