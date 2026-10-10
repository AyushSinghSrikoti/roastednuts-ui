"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { genericAxios } from "@/services/genericAxios";
import type { CurrentUser } from "@/types/auth";
import AppLoader from "@/views/loader";

interface GuestRouteProps {
  children: React.ReactNode;
}

export default function GuestRoute({ children }: GuestRouteProps) {
  const router = useRouter();
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const resolveAccess = async () => {
      const token = window.localStorage.getItem("token");
      const refreshToken = window.localStorage.getItem("refreshToken");

      if (!token && !refreshToken) {
        setIsGuest(true);
        return;
      }

      try {
        await genericAxios.get<CurrentUser>("/auth/me");
        router.replace("/dashboard");
      } catch {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("refreshToken");
        setIsGuest(true);
      }
    };

    void resolveAccess();
  }, [router]);

  if (!isGuest) {
    return (
      <main className="flex h-full min-h-full items-center justify-center bg-[var(--almond-canvas)]">
        <AppLoader label="Checking your session" />
      </main>
    );
  }

  return children;
}
