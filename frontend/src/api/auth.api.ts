import api from "@/lib/axios";
import type { RegisterUserFormData } from "@/validations/auth.schema";

export const registerUser = async (data: RegisterUserFormData) => {
  const formData = new FormData();

  //   console.log({ data });
  //   console.log({ BACKEND_URL: import.meta.env.VITE_BACKEND_URL });

  formData.append("username", data.username);
  formData.append("email", data.email);
  formData.append("password", data.password);

  const response = await api.post("/users/register", formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
