import userRoles from "../../utils/utils.roles";
import CustomError from "../../utils/CustomError";
import { UserRoles } from "../../interfaces/authorization";
import { Request, Response, NextFunction } from "express";
import { IUserRequest } from "../../interfaces/common";

export const authorize = (permissions: string[]) => {
  return (req: IUserRequest, res: Response, next: NextFunction) => {
    const userRole: keyof UserRoles = req && req.user && req.user.role;

    if (!userRole || !userRoles[userRole])
      throw new CustomError("Unauthorizedjjjjjjjj", 401);

    const userPermissions = userRoles[userRole];
    const hasPermission = permissions.some((permission) =>
      userPermissions.includes(permission)
    );
    if (hasPermission) next();
    else throw new CustomError("Unauthorized", 401);
  };
};
