"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { genericAxios } from "@/services/genericAxios";
import type { CurrentUser } from "@/types/auth";
import AppLoader from "@/views/loader";

interface AuthenticatedRouteProps {
  children: React.ReactNode;
}

const CurrentUserContext = createContext<CurrentUser | null>(null);

export function useCurrentUser(): CurrentUser {
  const user = useContext(CurrentUserContext);

  if (!user) {
    throw new Error("useCurrentUser must be used within an authenticated route");
  }

  return user;
}

export default function AuthenticatedRoute({
  children,
}: AuthenticatedRouteProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const response = await genericAxios.get<CurrentUser>("/auth/me");
        setCurrentUser(response.data.data);
        return;
      } catch {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("refreshToken");
        router.replace("/login");
      }
    };

    void authenticate();
  }, [router]);

  if (!currentUser) {
    return (
      <main className="flex h-full min-h-full items-center justify-center bg-[var(--almond-canvas)] text-[var(--almond-copy)]">
        <AppLoader label="Checking your session" />
      </main>
    );
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="h-full min-h-full bg-[var(--almond-canvas)]">
        {children}
      </div>
    </CurrentUserContext.Provider>
  );
}
