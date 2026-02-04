// src/api/todo.api.ts
import api from "@/lib/axios";
import type {
  CreateTodoFormData,
  UpdateTodoFormData,
} from "@/validations/todo.schema";

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

export const updateTodo = async (
  todoId: number,
  data: Partial<UpdateTodoFormData>,
) => {
  const res = await api.put(`/todo/${todoId}`, {
    ...data,
    categoryId: data.categoryId ? Number(data.categoryId) : undefined,
  });

  return res.data.data;
};

export const toggleTodo = async (todoId: number) => {
  const res = await api.patch(`/todo/${todoId}`);
  return res.data.data;
};

export const deleteTodo = async (todoId: number) => {
  const res = await api.delete(`/todo/${todoId}`);
  return res.data.data;
};
