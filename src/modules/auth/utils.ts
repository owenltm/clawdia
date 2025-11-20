import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./entities/user.entity";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

export const hashPassword = async (raw: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(raw, saltRounds);
}

export const comparePassword = async (raw: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(raw, hash);
}

export const getUserAuthToken = (user: User, tokenId: string): string => {
  if(!JWT_SECRET_KEY) {
    throw new Error("JWT secret key is not defined");
  }
  
  var token = jwt.sign(
    {
      sub: user.id,
      type: 'access' // Add token type
    },
    JWT_SECRET_KEY,
    {
      expiresIn: '3h',
      jwtid: tokenId
    }
  );

  return token;
}

export const getUserRefreshToken = (user: User, tokenId: string): string => {
  if(!JWT_SECRET_KEY) {
    throw new Error("JWT secret key is not defined");
  }
  
  var token = jwt.sign(
    {
      sub: user.id,
      type: 'refresh' // Add token type
    },
    JWT_SECRET_KEY,
    {
      expiresIn: '3d',
      jwtid: tokenId
    }
  );

  return token;
}

export const verifyAuthToken = (token: string, expectedType: 'access' | 'refresh' = 'access'): any => {
  if(!JWT_SECRET_KEY) {
    throw new Error("JWT secret key is not defined");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY) as any;

    // Check if token type matches expected type
    if (decoded.type !== expectedType) {
      return null;
    }
    
    return decoded;
  } catch (err) {
    return null;
  }
}

export const getRandomTokenId = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}