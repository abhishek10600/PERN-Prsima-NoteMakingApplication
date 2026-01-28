import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "../utils/db";
import jwt from "jsonwebtoken";

import {
  encryptPassword,
  generateAccessToken,
  generateRefreshToken,
  isPasswordCorrect,
} from "../utils/auth/helpers";
import { JwtUserPayload } from "../types";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, country, age } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError(409, "user with this email already exists");
    }

    const hashedPassword = await encryptPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        country,
        age,
      },
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken,
      },
    });

    return res.status(201).json(
      new ApiResponse(
        200,
        {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            country: user.country,
            age: user.age,
          },
          accessToken,
          refreshToken,
        },
        "user created successfully"
      )
    );
  } catch (error: unknown) {
    console.error("Regsiter User Error: ", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (!user) {
      throw new ApiError(401, "invalid credentials");
    }

    const checkPassword = isPasswordCorrect(password, user.password);

    if (!checkPassword) {
      throw new ApiError(401, "invalid credentials");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken,
      },
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            country: user.country,
            age: user.age,
          },
          accessToken,
          refreshToken,
        },
        "user logged in successfully"
      )
    );
  } catch (error: unknown) {
    console.error("Regsiter User Error: ", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: null,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "user logged out successfully"));
  } catch (error: unknown) {
    console.error("Regsiter User Error: ", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    return res
      .status(200)
      .json(new ApiResponse(200, user, "current user fetched successfully"));
  } catch (error: unknown) {
    console.error("Regsiter User Error: ", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const incomingRefreshToken = req
      .header("Authorization")
      ?.replace("Bearer ", "");

    if (!incomingRefreshToken) {
      throw new ApiError(401, "unauthorized request");
    }

    console.log({ incomingRefreshToken });

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as JwtUserPayload;

    const userId = decodedToken.id;
    console.log(userId);
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new ApiError(401, "invalid refresh token");
    }

    const newRefreshToken = generateRefreshToken(user);
    const newAccessToken = generateAccessToken(user);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: newRefreshToken,
      },
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
        "token updated successfully"
      )
    );
  } catch (error: unknown) {
    console.error("Regsiter User Error: ", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }
  }
};
