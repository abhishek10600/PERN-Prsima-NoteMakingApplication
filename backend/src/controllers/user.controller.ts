import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { prisma } from "../utils/db";

import {
  encryptPassword,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/auth/helpers";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, country, age, role } = req.body;

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
