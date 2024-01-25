// RegisterPage.tsx
import React from "react";
import RegisterForm from "@/components/RegisterForm";

const RegisterPage: React.FC = () => {
  return (
    <div className="register-page flex items-center bg-gray-200">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
