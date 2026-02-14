"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

const LOGO_URL =
  "https://www.contoureducation.com.au/wp-content/uploads/2023/02/Contour-Education-Full-Logo-Single-Line-2048x271-2.png";

type FormType = "login" | "register";

export const AuthForm = () => {
  const [formType, setFormType] = useState<FormType>("login");

  const handleSwitchFormType = (type: FormType) => {
    setFormType(type);
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
        <Input type="email" />
      </div>

      <div className="grid gap-2">
        <Label>Password</Label>
        <Input type="email" />
      </div>

      <Button className="bg-blue-400 hover:bg-blue-500">
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
