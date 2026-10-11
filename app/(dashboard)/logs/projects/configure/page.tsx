import type { Metadata } from "next";

import ProjectConfigurationPage from "@/components/dashboard/ProjectConfigurationPage";

export const metadata: Metadata = {
  title: "Configure project | Roasted Almonds",
};

export default async function ConfigureProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>;
}) {
  const { name } = await searchParams;

  return <ProjectConfigurationPage initialProjectName={name ?? ""} />;
}
