export type ProjectLaunchMode = "quick" | "configured";

export interface ProjectConfigurationInput {
  platform: string;
  environmentLabel?: string;
  maximumStorageGb: number;
  retentionDays: number;
  archiveExpiredLogs: boolean;
  warnNearStorageLimit: boolean;
  eventsPerMinute: number;
  errorEventsPerMinute: number;
  maximumEventSizeKb: number;
  eventsPerBatch: number;
  redactAuthorization: boolean;
  redactCookies: boolean;
  redactIpAddresses: boolean;
  storeStackTraces: boolean;
}

export type CreateProjectInput =
  | {
      name: string;
      launchMode: "quick";
    }
  | {
      name: string;
      launchMode: "configured";
      configuration: ProjectConfigurationInput;
    };

export interface ProjectResponse {
  id: string;
  name: string;
  slug: string;
  status: string;
}

export interface ProjectDetails {
  id: string;
  name: string;
  slug: string;
  status: ProjectStatus;
  configuration: ProjectConfigurationInput & {
    environmentLabel: string | null;
  };
}

export interface UpdateProjectInput {
  name: string;
  configuration: ProjectConfigurationInput;
}

export type ProjectStatus = "active" | "paused" | "archived";

export interface ProjectPlatform {
  name: string;
  slug: string;
  iconUrl: string | null;
}

export interface ProjectListItem {
  id: string;
  name: string;
  slug: string;
  platform: ProjectPlatform;
  environmentLabel: string | null;
  status: ProjectStatus;
  createdAt: string;
}

export interface ProjectsPagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedProjects {
  items: ProjectListItem[];
  pagination: ProjectsPagination;
}

export interface ListProjectsParams {
  page: number;
  search?: string;
  status?: ProjectStatus;
  platform?: string;
}
