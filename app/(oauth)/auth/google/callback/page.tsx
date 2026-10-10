import type { Metadata } from "next";

import GoogleCallbackPage from "@/components/auth/GoogleCallbackPage";

export const metadata: Metadata = {
  title: "Completing sign in | Roasted Almonds",
  description: "Completing your secure Google sign-in.",
};

export default function Page() {
  return <GoogleCallbackPage />;
}
