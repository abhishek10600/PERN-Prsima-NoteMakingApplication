import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../utils/db";
import { ApiResponse } from "../utils/ApiResponse";
import {
  CreateTodoInput,
  UpdateTodoInput,
} from "../validations/todo.validator";
import { Prisma } from "@prisma/client";

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

export const getUserTodos = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "unauthorized request");
    }

    // query params NOTE: req.params will always give string

    const completed =
      typeof req.query.completed === "string"
        ? req.query.completed === "true"
        : undefined;

    const categoryId =
      typeof req.query.categoryId === "string"
        ? Number(req.query.categoryId)
        : undefined;

    const dueBefore =
      typeof req.query.dueBefore === "string"
        ? new Date(req.query.dueBefore)
        : undefined;

    const dueAfter =
      typeof req.query.dueAfter === "string"
        ? new Date(req.query.dueAfter)
        : undefined;

    if (dueBefore && isNaN(dueBefore.getTime())) {
      throw new ApiError(400, "invalid dueBefore date");
    }

    if (dueAfter && isNaN(dueAfter.getTime())) {
      throw new ApiError(400, "invalid dueAfter date");
    }

    const page =
      typeof req.query.page === "string" ? Number(req.query.page) : 1;

    const limit =
      typeof req.query.limit === "string" ? Number(req.query.limit) : 10;

    if (page < 1 || limit < 1) {
      throw new ApiError(400, "invalid pagination values");
    }

    const skip = (page - 1) * limit;

    // filters
    const where: Prisma.TodoWhereInput = {
      userId,
      ...(typeof completed === "boolean" && { completed }),
      ...(categoryId && { categoryId }),
      ...(dueBefore || dueAfter
        ? {
            dueDate: {
              ...(dueBefore && { lte: dueBefore }),
              ...(dueAfter && { gte: dueAfter }),
            },
          }
        : {}),
    };

    // db calls
    const [todos, total] = await prisma.$transaction([
      prisma.todo.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      }),
      prisma.todo.count({ where }),
    ]);

    // return response
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          todos,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
        "todos fetched successfully"
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

export const getUserTodoById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(401, "unauthorized request");
    }

    const todoId = Number(req.params.todoId);

    if (!todoId || isNaN(todoId)) {
      throw new ApiError(401, "invalid todo id");
    }

    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    if (!todo) {
      throw new ApiError(404, "todo not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, todo, "todo feched successfully"));
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

export const updateUserTodo = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "user id not found");
    }
    const todoId = Number(req.params.todoId);
    if (!todoId || isNaN(todoId)) {
      throw new ApiError(400, "invalid todo id");
    }

    const { title, description, completed, dueDate, categoryId } =
      req.body as UpdateTodoInput;

    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId,
      },
    });

    if (!todo) {
      throw new ApiError(404, "todo not found");
    }

    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: categoryId,
          userId: userId,
        },
      });
      if (!category) {
        throw new ApiError(
          404,
          "category not found or does not belong to this user"
        );
      }
    }

    const updatedTodo = await prisma.todo.update({
      where: {
        id: todoId,
      },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(completed !== undefined && { completed }),
        ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
        ...(categoryId !== undefined && { categoryId }),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, updateUserTodo, "todo updated successfully"));
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

export const toggleIsCompleteUserTodo = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "unauthorized request");
    }
    const todoId = Number(req.params.todoId);
    if (!todoId || isNaN(todoId)) {
      throw new ApiError(400, "invalid todo id");
    }

    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId,
      },
    });

    if (!todo) {
      throw new ApiError(404, "todo not found");
    }

    const updatedTodo = await prisma.todo.update({
      where: {
        id: todoId,
      },
      data: {
        completed: !todo.completed,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedTodo,
          `todo marked as ${updatedTodo.completed ? "completed" : "incomplete"}`
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

export const deleteUserTodo = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "unauthorized request");
    }
    const todoId = Number(req.params.todoId);
    if (!todoId || isNaN(todoId)) {
      throw new ApiError(400, "invalid todo id");
    }

    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId: userId,
      },
    });

    if (!todo) {
      throw new ApiError(404, "todo not found");
    }

    await prisma.todo.delete({
      where: {
        id: todoId,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "todo deleted successfully"));
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
