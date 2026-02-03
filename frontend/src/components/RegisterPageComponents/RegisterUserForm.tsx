import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerUserSchema,
  type RegisterUserFormData,
} from "@/validations/auth.schema";
import { useState } from "react";
import { toast } from "react-toastify";
import { registerUser } from "@/api/auth.api";
import { useNavigate } from "react-router-dom";
import { saveToLocalStorage } from "@/utils/helpers";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import { Spinner } from "../ui/spinner";

const RegisterUserForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterUserFormData>({
    resolver: zodResolver(registerUserSchema),
  });

  const onSubmit = async (data: RegisterUserFormData) => {
    // console.log(data);
    try {
      setLoading(true);
      const userData = await registerUser(data);
      saveToLocalStorage("accessToken", userData.accessToken);
      saveToLocalStorage("refreshToken", userData.refreshToken);
      dispatch(setUser(userData.user));
      toast.success("Account created successfully");
      reset();
      navigate("/");
    } catch (error: any) {
      setServerError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-130 bg-blue-300 shadow-2xl">
      <CardHeader>
        <CardTitle>Create Your Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                {...register("username")}
                className="bg-blue-100"
                placeholder="create your username"
              />
              {errors.username && (
                <p className="text-red-700 text-sm font-bold h-4">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="bg-blue-100"
                placeholder="enter your email"
              />
              {errors.email && (
                <p className="text-red-700 font-bold text-sm h-4">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className="bg-blue-100"
                placeholder="create your password"
              />
              {errors.password && (
                <p className="text-red-700 font-bold text-sm h-4">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Link
              to={"/login"}
              className="text-sm mb-2 text-blue-900 font-bold"
            >
              Already have an account?
            </Link>
          </div>
          <div className="grid gap-2">
            <Button type="submit" className="cursor-pointer bg-primary">
              {loading ? <Spinner /> : "Register"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterUserForm;
