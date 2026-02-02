import api from "@/lib/axios";
import type {
  LoginUserFormData,
  RegisterUserFormData,
} from "@/validations/auth.schema";

export const registerUser = async (data: RegisterUserFormData) => {
  const formData = new FormData();

  formData.append("username", data.username);
  formData.append("email", data.email);
  formData.append("password", data.password);

  const response = await api.post("/users/register", formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data.data;
};

export const loginUser = async (data: LoginUserFormData) => {
  const formData = new FormData();
  if (data.identifier.includes("@")) {
    formData.append("email", data.identifier);
  } else {
    formData.append("username", data.identifier);
  }
  formData.append("password", data.password);

  const response = await api.post("/users/login", formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/users/current-user");
  return response.data.data;
};

export const logoutUser = async () => {
  const response = await api.post("/users/logout");
  return response.data;
};
