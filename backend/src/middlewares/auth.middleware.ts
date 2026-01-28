import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import { JwtUserPayload } from "../types";
import { prisma } from "../utils/db";

export const verifyJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "unauthorized request");
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as JwtUserPayload;

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        country: true,
        age: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new ApiError(401, "invalid access token");
    }
    console.log(user);
    req.user = user;
    next();
  } catch (error: unknown) {
    console.error("Error: ", error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errors: [],
    });
  }
};
