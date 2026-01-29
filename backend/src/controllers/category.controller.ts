import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../validations/category.validator";
import { prisma } from "../utils/db";
import { ApiResponse } from "../utils/ApiResponse";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(401, "unauthorized request");
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

export const getCategoryByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "unauthorized request");
    }
    const category = await prisma.category.findMany({
      where: {
        userId: userId,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, category, "category fetched successfully"));
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

export const getCategoryByIdByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const categoryId = Number(req.params.categoryId);

    if (!userId) {
      throw new ApiError(401, "unauthorized request");
    }

    if (!categoryId || isNaN(categoryId)) {
      throw new ApiError(404, "invalid category id");
    }

    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: userId,
      },
    });

    if (!category) {
      throw new ApiError(404, "category not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, category, "category fetched successfully"));
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

export const updateCategoryIdByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const categoryId = Number(req.params.categoryId);

    if (!userId) {
      throw new ApiError(401, "unauthorized request");
    }

    if (!categoryId || isNaN(categoryId)) {
      throw new ApiError(400, "invald category id");
    }

    const { name, color } = req.body as UpdateCategoryInput;

    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: userId,
      },
    });

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    if (name) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          userId,
          name,
          NOT: { id: categoryId },
        },
      });
      if (existingCategory) {
        throw new ApiError(409, "category name already exists");
      }
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        ...(name && { name }),
        ...(color && { color }),
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedCategory, "category updated successfully")
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

export const deleteCategoryByIdByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const categoryId = Number(req.params.categoryId);

    if (!userId) {
      throw new ApiError(401, "unauthorized request");
    }

    if (!categoryId || isNaN(categoryId)) {
      throw new ApiError(400, "invalid category id");
    }

    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId: userId,
      },
    });

    if (!category) {
      throw new ApiError(400, "category not found");
    }

    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "category deleted successfully"));
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
