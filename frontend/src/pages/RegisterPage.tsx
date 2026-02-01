import RegisterUserForm from "@/components/RegisterPageComponents/RegisterUserForm";
import React from "react";

const RegisterPage = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center md:gap-6">
      <div>
        <h1 className="md:text-5xl font-bold text-primary">Welcome To Toooder</h1>
      </div>
      <RegisterUserForm />
    </div>
  );
};

export default RegisterPage;
