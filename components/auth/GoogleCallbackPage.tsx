"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toast";

import AppLoader from "@/views/loader";
import { genericAxios } from "@/services/genericAxios";
import type { SignupResponse } from "@/types/auth";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const hasStartedExchange = useRef(false);

  useEffect(() => {
    if (hasStartedExchange.current) return;
    hasStartedExchange.current = true;

    const parameters = new URLSearchParams(window.location.hash.slice(1));
    const code = parameters.get("code");

    if (!code) {
      router.replace("/login?error=google_auth_failed");
      return;
    }

    window.history.replaceState(null, "", window.location.pathname);
    const exchangeCode = async () => {
      try {
        const response = await genericAxios.post<SignupResponse>(
          "/auth/google/exchange",
          { code },
        );
        window.localStorage.setItem("token", response.data.data.token);
        window.localStorage.setItem(
          "refreshToken",
          response.data.data.refreshToken,
        );
        router.replace("/dashboard");
      } catch {
        toast.error("Google sign-in failed. Please try again.");
        router.replace("/login");
      }
    };

    void exchangeCode();
  }, [router]);

  return (
    <main className="flex h-full min-h-full items-center justify-center bg-[var(--almond-canvas)]">
      <AppLoader label="Completing Google sign in" />
    </main>
  );
}
