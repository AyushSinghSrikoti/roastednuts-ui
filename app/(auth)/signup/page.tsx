import { Metadata } from "next";

import UserSignupPage from "@/components/custom/UserSignupPage";

export const metadata: Metadata = {
  title: "Create account | Roasted Almonds",
  description: "Create your Roasted Almonds workspace account.",
};

export default function Page() {
  return <UserSignupPage />;
}
