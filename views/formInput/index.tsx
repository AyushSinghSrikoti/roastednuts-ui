"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AppInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
}

export default function AppInput({
  label,
  error,
  className,
  rightIcon,
  id,
  ...props
}: AppInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <Label
          htmlFor={id}
          className="text-foreground font-medium"
        >
          {label}
        </Label>
      )}

      <div className="relative">
        <Input
          id={id}
          className={cn(
            "pr-10 border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-1",
            className
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}