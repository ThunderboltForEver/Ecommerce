"use client";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { string, z } from "zod";

const RegisterForm: React.FC = () => {
  const registerSchema = z
    .object({
      name: string().min(1, { message: "The name required" }),
      email: string()
        .min(1, { message: "Email required" })
        .email({ message: "Enter a valid email" }),
      password: string()
        .min(8, { message: "Must be at least 8 characters" })
        .max(20, { message: "Can't be longer than 20" }),
      c_password: string()
        .min(8, { message: "Must be at least 8 characters" })
        .max(20, { message: "Can't be longer than 20" }),
    })
    .refine((data) => data.password === data.c_password, {
      message: "Password doesn't match",
      path: ["c_password"],
    });
  type registerType = z.infer<typeof registerSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<registerType>({
    mode: "onChange",
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<registerType> = async (data) => {
    try {
      const response = await fetch(
        "https://event-reg.app/flutter_test/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        window.location.href = "/";
      } else {
        console.error("Registration failed:", await response.json());
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md min-w-[340px] h-fit mx-auto p-8 bg-white rounded-lg shadow-md"
    >
      <h1 className="text-3xl font-semibold mb-6 text-center">Register</h1>

      <input
        type="text"
        {...register("name")}
        placeholder="Name"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
      <div className="relative p-3">
        {errors.name && (
          <span className=" absolute bottom-1 text-sm text-red-600">
            {errors.name.message}
          </span>
        )}
      </div>

      <input
        type="email"
        {...register("email")}
        placeholder="Email"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
      <div className="relative p-3">
        {errors.email && (
          <span className=" absolute bottom-1 text-sm text-red-600">
            {errors.email.message}
          </span>
        )}
      </div>

      <input
        type="password"
        {...register("password")}
        placeholder="Password"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
      <div className="relative p-3">
        {errors.password && (
          <span className=" absolute bottom-1 text-sm text-red-600">
            {errors.password.message}
          </span>
        )}
      </div>

      <input
        type="password"
        {...register("c_password")}
        placeholder="Confirm Password"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      />
      <div className="relative p-2 mb-4">
        {errors.c_password && (
          <span className=" absolute -bottom-2 text-sm text-red-600">
            {errors.c_password.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300"
        disabled={isSubmitting}
      >
        Register
      </button>
      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <Link href={"/login"} className="underline">
          Login
        </Link>{" "}
      </p>
    </form>
  );
};

export default RegisterForm;
