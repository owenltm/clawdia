import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./entities/user.entity";

export const hashPassword = async (raw: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(raw, saltRounds);
}

export const comparePassword = async (raw: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(raw, hash);
}

export const getUserAuthToken = (user: User): string => {
  var token = jwt.sign(
    {
      sub: user.id,
      name: user.getFullName(),
      role: user.role
    },
    'shhhhh'
  );

  return token;
}

export const verifyAuthToken = (token: string): any => {
  try {
    const decoded = jwt.verify(token, 'shhhhh');
    return decoded;
  } catch (err) {
    return null;
  }
}
