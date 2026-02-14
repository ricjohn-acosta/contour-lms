"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { authService } from "@/services/auth/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LOGO_URL =
  "https://www.contoureducation.com.au/wp-content/uploads/2023/02/Contour-Education-Full-Logo-Single-Line-2048x271-2.png";

type FormType = "login" | "register";

type AuthFormValues = {
  email: string;
  password: string;
};

export const AuthForm = () => {
  const router = useRouter();
  const [formType, setFormType] = useState<FormType>("login");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AuthFormValues>({
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const handleSwitchFormType = (type: FormType) => {
    setFormType(type);
    reset();
  };

  const onSubmit = async (values: AuthFormValues) => {
    const { data, error } =
      formType === "login"
        ? await authService.login(values.email, values.password)
        : await authService.register(values.email, values.password);

    if (error) {
      toast.error(error);
    }

    if (data) {
      router.replace("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Image
        src={LOGO_URL}
        alt="Contour Education"
        width={120}
        height={44}
        className="h-11 w-auto object-contain"
        unoptimized
      />

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder="Try: admin@contoureducation.com"
          type="email"
          autoComplete="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email",
            },
          })}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          placeholder="Try: test@TEST1"
          type="password"
          autoComplete={
            formType === "login" ? "current-password" : "new-password"
          }
          {...register("password", {
            required: "Password is required",
            ...(formType === "register" && {
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }),
          })}
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="bg-blue-400 hover:bg-blue-500"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Please wait..."
          : formType === "login"
          ? "Login"
          : "Register"}
      </Button>

      <div className="text-center text-sm text-gray-500">
        {formType === "login" ? (
          <div>
            Don't have an account?{" "}
            <Button
              type="button"
              variant="link"
              className="p-0 pl-1"
              onClick={() => handleSwitchFormType("register")}
            >
              Register
            </Button>
          </div>
        ) : (
          <div>
            Already have an account?
            <Button
              type="button"
              variant="link"
              className="p-0 pl-1"
              onClick={() => handleSwitchFormType("login")}
            >
              Login
            </Button>
          </div>
        )}
      </div>
    </form>
  );
};
