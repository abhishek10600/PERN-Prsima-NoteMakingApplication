// src/api/todo.api.ts
import api from "@/lib/axios";
import type { CreateTodoFormData } from "@/validations/todo.schema";

export const getUserTodos = async () => {
  const response = await api.get("/todo/all");
  return response.data.data.todos;
};

export const createTodo = async (data: CreateTodoFormData) => {
  const res = await api.post("/todo/create", {
    title: data.title,
    description: data.description,
    dueDate: data.dueDate,
    categoryId: data.categoryId ? Number(data.categoryId) : undefined,
  });
  return res.data.data;
};
