import api from "@/lib/axios";
import type { CreateCategoryFormData } from "@/validations/category.schema";

export const getUserCategories = async () => {
  const response = await api.get("/category/all");
  return response.data.data;
};

export const createCategory = async (data: CreateCategoryFormData) => {
  const response = await api.post("/category/create", data);
  return response.data.data;
};
