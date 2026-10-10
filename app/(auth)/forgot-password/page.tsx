import type { Metadata } from "next";

import ForgotPasswordPage from "@/components/auth/ForgotPasswordPage";

export const metadata: Metadata = {
  title: "Forgot password | Roasted Almonds",
  description: "Request a secure password reset for your Roasted Almonds account.",
};

export default function Page() {
  return <ForgotPasswordPage />;
}
