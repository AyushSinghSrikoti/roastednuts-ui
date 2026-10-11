"use client";

import { useEffect, useState } from "react";

import ProjectConfigurationPage from "@/components/dashboard/ProjectConfigurationPage";
import { getProject, listProjectPlatforms } from "@/services/projects";
import type { ProjectDetails } from "@/types/project";
import type { SelectOption } from "@/components/ui/select";
import AppLoader from "@/views/loader";

export default function EditProjectPage({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [platformOptions, setPlatformOptions] = useState<SelectOption[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    void Promise.all([
      getProject(projectId, controller.signal),
      listProjectPlatforms(controller.signal),
    ])
      .then(([projectResponse, platformsResponse]) => {
        setProject(projectResponse.data.data);
        const options = platformsResponse.data.data.map((platform) => ({
          label: platform.name,
          value: platform.slug,
          iconUrl: platform.iconUrl,
        }));
        setPlatformOptions(options.some((option) => option.value === "other")
          ? options
          : [...options, { label: "Other", value: "other", iconUrl: null }]);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [projectId, retryKey]);

  if (loading) {
    return <div className="grid min-h-[60vh] place-items-center"><AppLoader label="Loading project settings" /></div>;
  }

  if (failed || !project || !platformOptions) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-center">
        <div>
          <p className="text-sm font-semibold text-[#443229]">Project settings could not be loaded</p>
          <p className="mt-1 text-xs text-[#978477]">Check your connection and try again.</p>
          <button type="button" onClick={() => { setLoading(true); setFailed(false); setRetryKey((value) => value + 1); }} className="mt-4 h-9 cursor-pointer rounded-xl bg-[#75452e] px-4 text-xs font-semibold text-white transition hover:bg-[#603722]">Try again</button>
        </div>
      </div>
    );
  }

  return <ProjectConfigurationPage initialProjectName={project.name} projectId={project.id} initialConfiguration={project.configuration} initialPlatformOptions={platformOptions} />;
}
