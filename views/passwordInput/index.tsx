"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import AppInput from "../formInput";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function PasswordInput({
  label,
  error,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] =
    React.useState(false);

  return (
    <AppInput
      {...props}
      label={label}
      error={error}
      type={showPassword ? "text" : "password"}
      rightIcon={
        <button
          type="button"
          onClick={() =>
            setShowPassword((p) => !p)
          }
          className="cursor-pointer text-muted-foreground transition hover:text-foreground"
        >
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      }
    />
  );
}