import type { Metadata } from "next";

import ProjectsListingPage from "@/components/dashboard/ProjectsListingPage";

export const metadata: Metadata = {
  title: "Projects | Roasted Almonds",
};

export default function ProjectsPage() {
  return <ProjectsListingPage />;
}
