import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { CreateCategoryInput } from "../validations/category.validator";
import { prisma } from "../utils/db";
import { ApiResponse } from "../utils/ApiResponse";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(401, "unauthorized");
    }

    const { name, color } = req.body as CreateCategoryInput;

    const existingCategory = await prisma.category.findFirst({
      where: {
        userId,
        name,
      },
    });

    if (existingCategory) {
      throw new ApiError(409, "Category already exists");
    }

    // Create the category
    const category = await prisma.category.create({
      data: {
        name,
        color,
        userId,
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, category, "category created successfully"));
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
