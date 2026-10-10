import { Metadata } from "next";
import LoginPage from "@/components/custom/LoginPage";

export const metadata: Metadata = {
    title: "Administrator sign-in | Roasted Almonds",
    description: "Administrator sign-in for Roasted Almonds.",
};

export default function Page() {
    return <LoginPage />;
}
