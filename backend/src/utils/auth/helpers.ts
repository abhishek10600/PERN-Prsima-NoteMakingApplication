import jwt, { Secret, SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JwtUserPayload } from "../../types";

export const generateAccessToken = (user: JwtUserPayload) => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as Secret;
  const options: SignOptions = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"],
  };
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
      username: user.username,
    },
    accessTokenSecret,
    options
  );
};

export const generateRefreshToken = (user: JwtUserPayload) => {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as Secret;
  const options: SignOptions = {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"],
  };
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
      username: user.username,
    },
    refreshTokenSecret,
    options
  );
};

export const encryptPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const isPasswordCorrect = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};
