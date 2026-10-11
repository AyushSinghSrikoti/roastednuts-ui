"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, Boxes, FolderKanban, Pencil, Search, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import {
  PROJECT_PLATFORM_OPTIONS,
  PROJECT_SEARCH_DEBOUNCE_MS,
  PROJECT_STATUS_OPTIONS,
  PROJECT_STATUS_STYLES,
} from "@/constants/project-listing";
import { formatShortDate } from "@/helpers/date.helper";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/utils";
import { deleteProject, listProjects } from "@/services/projects";
import type { ProjectListItem, ProjectsPagination, ProjectStatus } from "@/types/project";
import { DataTable } from "@/components/ui/data-table";
import { ThemedSelect } from "@/components/ui/select";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { useBackgroundActions } from "@/components/background-actions/BackgroundActionProvider";
import { PROJECTS_CHANGED_EVENT } from "@/constants/project-events";

export default function ProjectsListingPage() {
  const router = useRouter();
  const { runBackgroundAction } = useBackgroundActions();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [pagination, setPagination] = useState<ProjectsPagination>({ page: 1, pageSize: 10, totalItems: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [projectToDelete, setProjectToDelete] = useState<ProjectListItem | null>(null);
  const debouncedQuery = useDebouncedValue(query, PROJECT_SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    const refreshProjects = () => setRetryKey((value) => value + 1);
    window.addEventListener(PROJECTS_CHANGED_EVENT, refreshProjects);
    return () => window.removeEventListener(PROJECTS_CHANGED_EVENT, refreshProjects);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void Promise.resolve()
      .then(() => {
        if (controller.signal.aborted) return null;
        setLoading(true);
        setLoadError(false);
        return listProjects(
          {
            page: pagination.page,
            search: debouncedQuery.trim() || undefined,
            status: status === "all" ? undefined : (status as ProjectStatus),
            platform: platform === "all" ? undefined : platform,
          },
          controller.signal,
        );
      })
      .then((response) => {
        if (!response) return;
        setProjects(response.data.data.items);
        setPagination(response.data.data.pagination);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setProjects([]);
          setLoadError(true);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [debouncedQuery, pagination.page, platform, retryKey, status]);

  const confirmDelete = async () => {
    if (!projectToDelete) return;

    const project = projectToDelete;
    const moveToPreviousPage = projects.length === 1 && pagination.page > 1;
    setProjectToDelete(null);

    const result = await runBackgroundAction({
      title: `Deleting ${project.name}`,
      runningMessage: "Removing the project and its dashboard access…",
      successMessage: `${project.name} was deleted successfully.`,
      errorMessage: `We could not delete ${project.name}. Please try again.`,
      task: () => deleteProject(project.id),
    });

    if (result.status === "succeeded") {
      if (moveToPreviousPage) {
        setPagination((current) => ({ ...current, page: current.page - 1 }));
      } else {
        setRetryKey((value) => value + 1);
      }
    }
  };

  const columns = useMemo<ColumnDef<ProjectListItem>[]>(() => [
    {
      accessorKey: "name",
      header: "Project",
      size: 240,
      minSize: 160,
      cell: ({ row }) => {
        const project = row.original;
        return (
        <Link href={`/logs/projects/${project.id}`} className="group flex w-full min-w-0 items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#f0e4d7] text-[#75452e]"><FolderKanban className="size-4" /></span>
          <span className="min-w-0 flex-1"><span title={project.name} className="block truncate font-semibold text-[#3b2b22] transition group-hover:text-[#75452e]">{project.name}</span><span title={project.slug} className="mt-0.5 block truncate text-[10px] text-[#a08d80]">{project.slug}</span></span>
        </Link>
        );
      },
    },
    { accessorKey: "environmentLabel", header: "Environment label", cell: ({ row }) => row.original.environmentLabel ?? "Not configured" },
    {
      accessorKey: "platform.name",
      header: "Platform",
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-2 font-medium text-[#4d3a2f]">
          {row.original.platform.iconUrl ? (
            // Platform SVG URLs are supplied by the authenticated projects API.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={row.original.platform.iconUrl} alt="" className="size-4 shrink-0 object-contain" />
          ) : (
            <Boxes className="size-4 shrink-0 text-[#80695a]" />
          )}
          {row.original.platform.name}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize", PROJECT_STATUS_STYLES[row.original.status])}>{row.original.status}</span>,
    },
    { accessorKey: "createdAt", header: "Created", cell: ({ row }) => formatShortDate(row.original.createdAt) },
    {
      id: "actions",
      header: "Quick actions",
      enableSorting: false,
      size: 192,
      minSize: 160,
      maxSize: 320,
      meta: { headerClassName: "w-48 min-w-40", cellClassName: "text-left" },
      cell: ({ row }) => (
        <div className="inline-flex items-center gap-1">
          <Link href={`/logs/projects/${row.original.id}/edit`} className="inline-grid size-8 cursor-pointer place-items-center rounded-lg text-[#8d796c] transition hover:bg-[#f0e7de] hover:text-[#4a372c]" aria-label={`Edit ${row.original.name}`}>
            <Pencil className="size-4" />
          </Link>
          <button type="button" onClick={() => setProjectToDelete(row.original)} className="inline-grid size-8 cursor-pointer place-items-center rounded-lg text-[#a8665e] transition hover:bg-[#f7e6e2] hover:text-[#9a3f35]" aria-label={`Delete ${row.original.name}`}>
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    },
  ], []);

  return (
    <div className="mx-auto max-w-7xl">
      <section className="overflow-hidden rounded-2xl border border-[#e0d5c8] bg-white shadow-[0_10px_35px_rgba(67,45,31,0.06)]">
        <div className="flex flex-col gap-3 border-b border-[#e9dfd5] p-4 sm:flex-row sm:items-center sm:p-5">
          <label className="relative min-w-0 flex-1 sm:max-w-sm"><span className="sr-only">Search projects</span><Search className="pointer-events-none absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-[#9b887a]" /><input value={query} onChange={(event) => { setQuery(event.target.value); setPagination((current) => ({ ...current, page: 1 })); }} placeholder="Search projects" className="h-10 w-full rounded-xl border border-[#d9ccbe] bg-[#fffdf9] pl-10 pr-3.5 text-sm text-[#34251d] outline-none transition placeholder:text-[#aa998d] focus:border-[#9b7258] focus:ring-3 focus:ring-[#b88a6b]/15" /></label>
          <div className="flex w-full flex-col gap-3 sm:ml-auto sm:w-auto sm:flex-row">
            <div className="w-full sm:w-40"><ThemedSelect value={status} options={PROJECT_STATUS_OPTIONS} onValueChange={(value) => { setStatus(value ?? "all"); setPagination((current) => ({ ...current, page: 1 })); }} /></div>
            <div className="w-full sm:w-40"><ThemedSelect value={platform} options={PROJECT_PLATFORM_OPTIONS} onValueChange={(value) => { setPlatform(value ?? "all"); setPagination((current) => ({ ...current, page: 1 })); }} /></div>
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={projects}
          getRowKey={(project) => project.id}
          onRowClick={(project) => router.push(`/logs/projects/${project.id}`)}
          caption="Projects"
          loading={loading}
          loadingLabel="Loading projects"
          enableSorting={false}
          pagination={{ ...pagination, onPageChange: (page) => setPagination((current) => ({ ...current, page })) }}
          emptyState={
            <div className="px-6 py-14 text-center">
              <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-[#f2e9df] text-[#80634f]"><Archive className="size-5" /></span>
              <p className="mt-4 text-sm font-semibold text-[#443229]">{loadError ? "Projects could not be loaded" : "No projects found"}</p>
              <p className="mt-1 text-xs text-[#978477]">{loadError ? "Check your connection and try again." : "Try changing your search or filters."}</p>
              {loadError ? <button type="button" onClick={() => setRetryKey((value) => value + 1)} className="mt-4 h-9 cursor-pointer rounded-xl bg-[#75452e] px-4 text-xs font-semibold text-white transition hover:bg-[#603722]">Try again</button> : null}
            </div>
          }
        />
      </section>
      <DeleteConfirmationModal
        open={Boolean(projectToDelete)}
        title="Delete project?"
        description={
          <>
            <span className="font-semibold text-[#5b4032]">{projectToDelete?.name}</span> will be removed from your projects. This action cannot currently be undone from the dashboard.
          </>
        }
        confirmLabel="Delete project"
        onClose={() => setProjectToDelete(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
