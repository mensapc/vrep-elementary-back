import jwt from "jsonwebtoken";
import CustomError from "../../utils/CustomError";
import { Request, Response, NextFunction } from "express";
// Middleware to validate a JWT token

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) throw new CustomError("Unauthorized", 401);
  const token = req.headers.authorization.split(" ")[1];
  try {
    if (!token) throw new CustomError("Unauthorized", 401);
    // Verify the token and decode its payload
    //@ts-ignore
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //@ts-ignore
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof CustomError) throw error;
    //@ts-ignore
    throw new Error("Invalid credentials", 401);
  }
};
