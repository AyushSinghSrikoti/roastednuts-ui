import type { Metadata } from "next";

import ResetPasswordPage from "@/components/auth/ResetPasswordPage";

export const metadata: Metadata = {
  title: "Reset password | Roasted Almonds",
  description: "Choose a new password for your Roasted Almonds account.",
};

interface PageProps {
  searchParams: Promise<{ token?: string | string[] }>;
}

export default async function Page({ searchParams }: PageProps) {
  const parameters = await searchParams;
  const token = Array.isArray(parameters.token) ? parameters.token[0] : parameters.token;

  return <ResetPasswordPage token={token} />;
}
