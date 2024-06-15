import jwt from "jsonwebtoken";

export function generateToken(user: any) {
  const secret = process.env.JWT_SECRET as string;
  const expiration = process.env.JWT_EXPIRATION as string;

  const token = jwt.sign(user, secret, {
    expiresIn: expiration,
  });
  return token;
}
