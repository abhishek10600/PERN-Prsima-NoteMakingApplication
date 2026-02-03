import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginUserSchema,
  type LoginUserFormData,
} from "@/validations/auth.schema";
import { useState } from "react";
import { loginUser } from "@/api/auth.api";
import { saveToLocalStorage } from "@/utils/helpers";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import { Spinner } from "../ui/spinner";

const LoginUserForm = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginUserFormData>({
    resolver: zodResolver(loginUserSchema),
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: LoginUserFormData) => {
    // console.log(data);
    try {
      setLoading(true);
      const userData = await loginUser(data);
      saveToLocalStorage("accessToken", userData.accessToken);
      saveToLocalStorage("refreshToken", userData.refreshToken);
      dispatch(setUser(userData.user));
      toast.success("Logged in successfully");
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
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username/Email</Label>
              <Input
                id="username"
                type="text"
                className="bg-gray-100"
                {...register("identifier")}
                placeholder="enter your username or email"
              />
              {errors.identifier && (
                <p className="text-red-700 text-sm font-bold h-4">
                  {errors.identifier.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className="bg-gray-100"
                placeholder="enter your password"
              />
              {errors.password && (
                <p className="text-red-700 text-sm font-bold h-4">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Link
              to={"/register"}
              className="text-sm mb-2 text-blue-900 font-bold"
            >
              Don't have an account?
            </Link>
          </div>
          <div className="grid gap-2">
            <Button
              disabled={loading}
              type="submit"
              className="cursor-pointer bg-primary"
            >
              {loading ? <Spinner /> : "Login"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginUserForm;
