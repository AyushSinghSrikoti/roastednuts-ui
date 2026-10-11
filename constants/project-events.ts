export const PROJECTS_CHANGED_EVENT = "projects:changed";

export function announceProjectsChanged() {
  window.dispatchEvent(new Event(PROJECTS_CHANGED_EVENT));
}
