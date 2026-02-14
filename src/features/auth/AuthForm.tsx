"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { authService } from "@/services/auth/auth.service";
import { useRouter } from "next/navigation";

const LOGO_URL =
  "https://www.contoureducation.com.au/wp-content/uploads/2023/02/Contour-Education-Full-Logo-Single-Line-2048x271-2.png";

type FormType = "login" | "register";

export const AuthForm = () => {
  const router = useRouter();

  const [formType, setFormType] = useState<FormType>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSwitchFormType = (type: FormType) => {
    setFormType(type);
  };

  const handleLogin = async () => {
    const data = await authService.login(email, password);

    if (data.user) {
      router.replace("/dashboard");
    }
  };

  const handleRegister = async () => {
    const data = await authService.register(email, password);

    if (data.user) {
      router.replace("/dashboard");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Image
        src={LOGO_URL}
        alt="Contour Education"
        width={120}
        height={44}
        className="h-11 w-auto object-contain"
        unoptimized
      />

      <div className="grid gap-2">
        <Label>Email</Label>
        <Input
          placeholder="Try: admin@contoureducation.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label>Password</Label>
        <Input
          placeholder="Try: test@TEST1"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <Button
        className="bg-blue-400 hover:bg-blue-500"
        onClick={formType === "login" ? handleLogin : handleRegister}
      >
        {formType === "login" ? "Login" : "Register"}
      </Button>

      <div className="text-center text-sm text-gray-500">
        {formType === "login" ? (
          <div>
            Don't have an account?{" "}
            <Button
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
              variant="link"
              className="p-0 pl-1"
              onClick={() => handleSwitchFormType("login")}
            >
              Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
