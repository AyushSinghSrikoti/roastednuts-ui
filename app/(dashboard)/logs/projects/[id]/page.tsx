import type { Metadata } from "next";

import ProjectOverviewPage from "@/components/dashboard/ProjectOverviewPage";

export const metadata: Metadata = {
  title: "Project overview | Roasted Almonds",
};

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProjectOverviewPage projectId={id} />;
}
