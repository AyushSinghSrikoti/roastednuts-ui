"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AppButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export default function AppButton({
  children,
  loading,
  className,
  disabled,
  ...props
}: AppButtonProps) {
  return (
    <Button
      disabled={disabled || loading}
      className={cn(
        "w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90",
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        children
      )}
    </Button>
  );
}