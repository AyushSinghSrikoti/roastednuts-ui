import type { Metadata } from "next";

import DashboardView from "@/components/custom/DashboardPage";

export const metadata: Metadata = {
  title: "Dashboard | Roasted Almonds",
};

export default function DashboardPage() {
  return <DashboardView />;
}
