import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../utils/db";
import { ApiResponse } from "../utils/ApiResponse";
import { CreateTodoInput } from "../validations/todo.validator";

export const createTodo = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "unauthorized request");
    }

    const { title, description, dueDate, categoryId } =
      req.body as CreateTodoInput;

    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: categoryId,
          userId,
        },
      });

      if (!category) {
        throw new ApiError(400, "invalid category id");
      }
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        ...(description && { description }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        userId,
        ...(categoryId && { categoryId }),
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, todo, "todo created successfully"));
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
