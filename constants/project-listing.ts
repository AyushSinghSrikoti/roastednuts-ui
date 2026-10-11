export const PROJECT_SEARCH_DEBOUNCE_MS = 350;

export const PROJECT_STATUS_STYLES = {
  active: "bg-[#eaf0e2] text-[#536742]",
  paused: "bg-[#f8eddc] text-[#8a5b25]",
  archived: "bg-[#eeeae6] text-[#75675e]",
} as const;

export const PROJECT_STATUS_OPTIONS = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Paused", value: "paused" },
  { label: "Archived", value: "archived" },
];

export const PROJECT_PLATFORM_OPTIONS = [
  { label: "All platforms", value: "all" },
  { label: "NestJS", value: "nestjs" },
  { label: "Next.js", value: "nextjs" },
  { label: "Node.js", value: "nodejs" },
  { label: "Python", value: "python" },
];
