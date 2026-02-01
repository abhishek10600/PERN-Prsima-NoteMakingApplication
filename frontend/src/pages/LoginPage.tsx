import LoginUserForm from "@/components/LoginPageComponents/LoginUserForm";

const LoginPage = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center md:gap-6">
      <div>
        <h1 className="md:text-5xl font-bold text-primary">
          Welcome To Toooder
        </h1>
      </div>
      <LoginUserForm />
    </div>
  );
};

export default LoginPage;
