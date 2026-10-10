import { Metadata } from "next";
import { redirect } from "next/navigation";


export const metadata: Metadata = {
  title: "Distributed Systems Playground",
  description: "Distributed Systems Playground",
};

export default function HomePage() {
  redirect("/login");
}
