import type { Metadata } from "next";

import EditProjectPage from "@/components/dashboard/EditProjectPage";

export const metadata: Metadata = {
  title: "Edit project | Roasted Almonds",
};

export default async function ProjectEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditProjectPage projectId={id} />;
}
