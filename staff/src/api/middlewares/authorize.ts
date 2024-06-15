import userRoles from "../../utils/utils.roles";
import CustomError from "../../utils/CustomError";

export const authorize = (permissions: any) => {
  return (req: any, res: any, next: any) => {
    const userRole = req && req.user && req.user.role;
    //@ts-ignore
    if (!userRole || !userRoles[userRole])
      throw new CustomError("Unauthorizedjjjjjjjj", 401);
    //@ts-ignore
    const userPermissions = userRoles[userRole];
    const hasPermission = permissions.some((permission: any) =>
      userPermissions.includes(permission)
    );
    if (hasPermission) next();
    else throw new CustomError("Unauthorized", 401);
  };
};
