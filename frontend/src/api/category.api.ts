import api from "@/lib/axios";

export const getUserCategories = async () => {
  const response = await api.get("/category/all");
  return response.data.data;
};
