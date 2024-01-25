import React from "react";
import LoginForm from "@/components/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <div className="login-page flex justify-center items-center bg-gray-200">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
