"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toast";

import { Button } from "@/components/ui/button";
import { genericAxios } from "@/services/genericAxios";

export default function DashboardPage() {
  const router = useRouter();

  const logout = async () => {
    const refreshToken = window.localStorage.getItem("refreshToken");

    try {
      await genericAxios.post<null>("/auth/logout", {
        refreshToken,
      });
    } catch {
      toast.info("You have been logged out locally.");
    } finally {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("refreshToken");
      router.replace("/login");
    }
  };

  return (
    <main className="flex h-full min-h-full items-center justify-center bg-[var(--almond-canvas)] text-[var(--almond-ink)]">
      <div className="flex items-center gap-5">
        <h1 className="text-4xl font-semibold tracking-tight">Hello World</h1>
        <Button
          type="button"
          onClick={logout}
          className="cursor-pointer bg-[var(--almond-accent)] text-white hover:bg-[var(--almond-accent-hover)]"
        >
          Logout
        </Button>
      </div>
    </main>
  );
}
