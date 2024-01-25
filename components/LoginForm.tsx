"use client";
import { useAppContext } from "@/context";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const LoginForm = () => {
  const { count, setCount } = useAppContext();
  const loginSchema = z.object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Enter a valid email" }),
    password: z
      .string()
      .min(8, { message: "Password must at least 8 characters" })
      .max(20, { message: "Can't be longer than 20 characters" }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginType>({
    mode: "onChange",
    resolver: zodResolver(loginSchema),
  });

  type LoginType = z.infer<typeof loginSchema>;

  const onSubmit: SubmitHandler<LoginType> = async (data) => {
    const { email, password } = data;
    try {
      const response = await fetch(
        "https://event-reg.app/flutter_test/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        const info = await response.json();

        localStorage.setItem("token", info.data.token);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", info.data.name);
        const token = localStorage.getItem("token");

        /* Getting User Orders Count */
        const ordersResponse = await fetch(
          "https://event-reg.app/flutter_test/api/orders",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (ordersResponse.ok) {
          const data = await ordersResponse.json();
          const userOrders = data.data.length;
          localStorage.setItem("ordersCount", userOrders);
          setCount(userOrders);
          window.location.href = "/";
        } else {
          throw new Error("Failed to fetch orders");
        }
      } else {
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xs mx-auto mt-8 p-8 bg-white rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="w-full py-2 px-4 mb-4 rounded border border-gray-300"
        />
        <div className="relative p-1">
          {errors.email && (
            <span className=" absolute bottom-1 text-sm text-red-600">
              {errors.email.message}
            </span>
          )}
        </div>
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="w-full py-2 px-4 mb-4 rounded border border-gray-300"
        />
        <div className="relative p-1">
          {errors.password && (
            <span className=" absolute bottom-1 text-sm text-red-600">
              {errors.password.message}
            </span>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={isSubmitting}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
