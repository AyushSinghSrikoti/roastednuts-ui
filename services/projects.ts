import { genericAxios } from "@/services/genericAxios";
import type {
  CreateProjectInput,
  ListProjectsParams,
  PaginatedProjects,
  ProjectDetails,
  ProjectPlatform,
  ProjectResponse,
  UpdateProjectInput,
} from "@/types/project";

export function createProject(input: CreateProjectInput) {
  return genericAxios.post<ProjectResponse>("/projects", input);
}

export function listProjects(input: ListProjectsParams, signal?: AbortSignal) {
  const params = new URLSearchParams({ page: String(input.page) });
  if (input.search) params.set("search", input.search);
  if (input.status) params.set("status", input.status);
  if (input.platform) params.set("platform", input.platform);

  return genericAxios.get<PaginatedProjects>(`/projects?${params.toString()}`, {
    signal,
  });
}

export function deleteProject(projectId: string) {
  return genericAxios.delete<null>(`/projects/${projectId}`);
}

export function getProject(projectId: string, signal?: AbortSignal) {
  return genericAxios.get<ProjectDetails>(`/projects/${projectId}`, { signal });
}

export function listProjectPlatforms(signal?: AbortSignal) {
  return genericAxios.get<ProjectPlatform[]>("/projects/platforms", { signal });
}

export function updateProject(projectId: string, input: UpdateProjectInput) {
  return genericAxios.patch<ProjectDetails>(`/projects/${projectId}`, input);
}

export function setProjectEnabled(projectId: string, enabled: boolean) {
  return genericAxios.patch<ProjectDetails>(`/projects/${projectId}/status`, { enabled });
}
