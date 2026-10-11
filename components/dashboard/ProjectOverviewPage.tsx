"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, AlertTriangle, Boxes, CheckCircle2, Copy, Database, Radio } from "lucide-react";

import { useBackgroundActions } from "@/components/background-actions/BackgroundActionProvider";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import ProjectActionsMenu from "@/components/dashboard/ProjectActionsMenu";
import { announceProjectsChanged } from "@/constants/project-events";
import { cn } from "@/lib/utils";
import { deleteProject, getProject, listProjectPlatforms, setProjectEnabled } from "@/services/projects";
import type { ProjectDetails, ProjectPlatform } from "@/types/project";
import AppLoader from "@/views/loader";

const activityBars = [34, 48, 42, 60, 52, 74, 66, 82, 58, 72, 88, 78, 94, 70, 84, 62, 76, 90, 68, 80, 56, 72, 64, 86];
const recentErrors = [
  { message: "Payment provider request timed out", count: 18, time: "8 minutes ago" },
  { message: "Unable to parse webhook payload", count: 11, time: "24 minutes ago" },
  { message: "Database connection pool exhausted", count: 7, time: "41 minutes ago" },
];

function OverviewSkeleton() {
  return <div className="grid min-h-[60vh] place-items-center"><AppLoader label="Loading project overview" /></div>;
}

function BooleanValue({ value }: { value: boolean }) {
  return <span className={cn("font-medium", value ? "text-[#52683e]" : "text-[#8b7467]")}>{value ? "Enabled" : "Disabled"}</span>;
}

export default function ProjectOverviewPage({ projectId }: { projectId: string }) {
  const router = useRouter();
  const { runBackgroundAction } = useBackgroundActions();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [platforms, setPlatforms] = useState<ProjectPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    void Promise.all([getProject(projectId, controller.signal), listProjectPlatforms(controller.signal)])
      .then(([projectResponse, platformResponse]) => {
        setProject(projectResponse.data.data);
        setPlatforms(platformResponse.data.data);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [projectId, retryKey]);

  if (loading) return <OverviewSkeleton />;

  if (failed || !project) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-center">
        <div>
          <p className="text-sm font-semibold text-[#443229]">Project overview could not be loaded</p>
          <p className="mt-1 text-xs text-[#978477]">Check your connection and try again.</p>
          <button type="button" onClick={() => { setLoading(true); setFailed(false); setRetryKey((value) => value + 1); }} className="mt-4 h-9 cursor-pointer rounded-xl bg-[#75452e] px-4 text-xs font-semibold text-white transition hover:bg-[#603722]">Try again</button>
        </div>
      </div>
    );
  }

  const configuration = project.configuration;
  const platform = platforms.find((item) => item.slug === configuration.platform);

  const confirmDelete = async () => {
    setDeleteOpen(false);
    const result = await runBackgroundAction({
      title: `Deleting ${project.name}`,
      runningMessage: "Removing the project and its dashboard access…",
      successMessage: `${project.name} was deleted successfully.`,
      errorMessage: `We could not delete ${project.name}. Please try again.`,
      task: () => deleteProject(project.id),
      onSuccess: announceProjectsChanged,
    });
    if (result.status === "succeeded") router.push("/logs/projects");
  };

  const copyProjectId = async () => {
    await navigator.clipboard.writeText(project.id);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const toggleProjectStatus = async () => {
    const enable = project.status !== "active";
    await runBackgroundAction({
      title: `${enable ? "Enabling" : "Disabling"} ${project.name}`,
      runningMessage: `${enable ? "Enabling" : "Disabling"} the project…`,
      successMessage: `${project.name} was ${enable ? "enabled" : "disabled"} successfully.`,
      errorMessage: `We could not ${enable ? "enable" : "disable"} ${project.name}. Please try again.`,
      task: () => setProjectEnabled(project.id, enable),
      onSuccess: (response) => {
        setProject(response.data.data);
        announceProjectsChanged();
      },
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-5 rounded-2xl border border-[#e0d5c8] bg-white p-4 shadow-[0_10px_35px_rgba(67,45,31,0.06)] sm:p-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-[#e0d5c8] bg-white p-5 shadow-[0_10px_35px_rgba(67,45,31,0.06)] sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-2xl font-semibold tracking-[-0.03em] text-[#302219]">{project.name}</h1>
            {platform?.iconUrl ? (
              // Platform SVG URLs are supplied by the authenticated projects API.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={platform.iconUrl} alt="" className="size-7 shrink-0 object-contain" />
            ) : <Boxes className="size-7 shrink-0 text-[#80695a]" />}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8e796b]">
            <span className="inline-flex items-center gap-1.5">
              <span>{project.id}</span>
              <span className="group relative inline-flex">
                <button type="button" onClick={() => void copyProjectId()} className="grid size-6 cursor-pointer place-items-center rounded-md text-[#8e796b] transition hover:bg-[#f2e9df] hover:text-[#75452e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b7258]" aria-label={copied ? "Project ID copied" : "Copy project ID"}><Copy className="size-3.5" /></button>
                <span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#34251d] px-2 py-1 text-[9px] font-medium text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">{copied ? "Copied" : "Copy"}</span>
              </span>
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <ProjectActionsMenu editHref={`/logs/projects/${project.id}/edit`} enabled={project.status === "active"} onToggleStatus={() => void toggleProjectStatus()} onDelete={() => setDeleteOpen(true)} />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[{ label: "Events (24h)", value: "84,291", icon: Activity }, { label: "Errors", value: "1,204", icon: AlertTriangle }, { label: "Error rate", value: "1.43%", icon: Radio }, { label: "Storage used", value: `2.1 / ${configuration.maximumStorageGb} GB`, icon: Database }].map((item) => {
          const Icon = item.icon;
          return <article key={item.label} className="rounded-2xl border border-[#e0d5c8] bg-white p-4"><div className="flex items-center justify-between"><span className="text-[11px] font-medium text-[#8e796b]">{item.label}</span><Icon className="size-4 text-[#94735e]" /></div><p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#39291f]">{item.value}</p></article>;
        })}
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.85fr)]">
        <article className="rounded-2xl border border-[#e0d5c8] bg-white p-5">
          <div className="flex items-center justify-between"><div><h2 className="text-sm font-semibold text-[#39291f]">Event activity</h2><p className="mt-1 text-[11px] text-[#927f72]">Events received during the last 24 hours</p></div><span className="rounded-lg border border-[#dfd4c8] px-2.5 py-1.5 text-[10px] font-medium text-[#745e50]">Last 24 hours</span></div>
          <div className="mt-6 flex h-48 items-end gap-1.5 border-b border-[#e9dfd5] px-1" aria-label="Sample event activity chart">
            {activityBars.map((height, index) => <span key={index} className="min-w-1 flex-1 rounded-t bg-[#b87d58] transition hover:bg-[#8d583c]" style={{ height: `${height}%` }} />)}
          </div>
          <div className="mt-2 flex justify-between text-[9px] text-[#a18f83]"><span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>Now</span></div>
        </article>

        <article className="rounded-2xl border border-[#e0d5c8] bg-white p-5"><h2 className="text-sm font-semibold text-[#39291f]">Recent errors</h2><p className="mt-1 text-[11px] text-[#927f72]">Latest recurring issues in this project</p><div className="mt-4 divide-y divide-[#eee5dc]">{recentErrors.map((error) => <div key={error.message} className="flex items-start justify-between gap-4 py-3"><div className="min-w-0"><p className="truncate text-xs font-medium text-[#4a372c]">{error.message}</p><p className="mt-1 text-[10px] text-[#9a877a]">{error.time}</p></div><span className="shrink-0 rounded-full bg-[#f7e6e2] px-2 py-1 text-[10px] font-semibold text-[#9a3f35]">{error.count}</span></div>)}</div></article>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <article className="rounded-2xl border border-[#e0d5c8] bg-white p-5"><h2 className="text-sm font-semibold text-[#39291f]">Project health</h2><p className="mt-1 text-[11px] text-[#927f72]">Current service indicators</p><div className="mt-5 space-y-4">{[{ label: "Ingestion", value: "Healthy" }, { label: "Last event", value: "2 minutes ago" }, { label: "Storage", value: "Within limit" }].map((item) => <div key={item.label} className="flex items-center justify-between gap-4"><span className="flex items-center gap-2 text-xs text-[#6f594b]"><CheckCircle2 className="size-4 text-[#70845c]" />{item.label}</span><span className="text-xs font-semibold text-[#445433]">{item.value}</span></div>)}</div></article>

        <article className="rounded-2xl border border-[#e0d5c8] bg-white p-5"><div className="flex items-center justify-between"><div><h2 className="text-sm font-semibold text-[#39291f]">Project configuration</h2><p className="mt-1 text-[11px] text-[#927f72]">API-backed saved settings</p></div><Link href={`/logs/projects/${project.id}/edit`} className="text-[11px] font-semibold text-[#75452e] hover:text-[#603722]">Edit settings</Link></div><dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 text-xs"><div><dt className="text-[#978477]">Platform</dt><dd className="mt-1 font-medium text-[#4a372c]">{platform?.name ?? configuration.platform}</dd></div><div><dt className="text-[#978477]">Environment</dt><dd className="mt-1 font-medium text-[#4a372c]">{configuration.environmentLabel || "Not configured"}</dd></div><div><dt className="text-[#978477]">Retention</dt><dd className="mt-1 font-medium text-[#4a372c]">{configuration.retentionDays} days</dd></div><div><dt className="text-[#978477]">Maximum storage</dt><dd className="mt-1 font-medium text-[#4a372c]">{configuration.maximumStorageGb} GB</dd></div><div><dt className="text-[#978477]">Events per minute</dt><dd className="mt-1 font-medium text-[#4a372c]">{configuration.eventsPerMinute.toLocaleString()}</dd></div><div><dt className="text-[#978477]">Error events/min</dt><dd className="mt-1 font-medium text-[#4a372c]">{configuration.errorEventsPerMinute.toLocaleString()}</dd></div><div><dt className="text-[#978477]">Archive expired logs</dt><dd className="mt-1"><BooleanValue value={configuration.archiveExpiredLogs} /></dd></div><div><dt className="text-[#978477]">Store stack traces</dt><dd className="mt-1"><BooleanValue value={configuration.storeStackTraces} /></dd></div></dl></article>
      </section>

      <DeleteConfirmationModal open={deleteOpen} title="Delete project?" description={<><span className="font-semibold text-[#5b4032]">{project.name}</span> will be removed from your projects. This action cannot currently be undone from the dashboard.</>} confirmLabel="Delete project" onClose={() => setDeleteOpen(false)} onConfirm={() => void confirmDelete()} />
    </div>
  );
}
