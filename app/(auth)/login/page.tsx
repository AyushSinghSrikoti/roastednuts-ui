import { Metadata } from "next";

import UserLoginPage from "@/components/custom/UserLoginPage";

export const metadata: Metadata = {
  title: "Sign in | Roasted Almonds",
  description: "Sign in to your Roasted Almonds workspace.",
};

interface LoginPageProps {
  searchParams: Promise<{ error?: string | string[] }>;
}

export default async function Page({ searchParams }: LoginPageProps) {
  const parameters = await searchParams;
  const oauthError = Array.isArray(parameters.error)
    ? parameters.error[0]
    : parameters.error;

  return <UserLoginPage oauthError={oauthError} />;
}
