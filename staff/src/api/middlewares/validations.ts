import jwt from "jsonwebtoken";
import CustomError from "../../utils/CustomError";
import { Response, NextFunction, Request } from "express";
import { IUserRequest } from "../../interfaces/common";
// Middleware to validate a JWT token

export const validateToken = (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) throw new CustomError("Unauthorized", 401);
  const token = req.headers.authorization.split(" ")[1];
  try {
    if (!token) throw new CustomError("Unauthorized", 401);
    // Verify the token and decode its payload
    if (process.env.JWT_SECRET) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;
      next();
    } else {
      res.status(500).json({ error: "Error validating token" });
    }
  } catch (error) {
    if (error instanceof CustomError) throw error;
    throw new Error("Invalid credentials");
  }
};
