export const MAX_VISIBLE_BACKGROUND_ACTIONS = 3;
export const INITIAL_BACKGROUND_ACTION_PROGRESS = 4;
export const MAX_PENDING_BACKGROUND_ACTION_PROGRESS = 99;
export const BACKGROUND_ACTION_PROGRESS_INTERVAL_MS = 300;
export const BACKGROUND_ACTION_SUCCESS_DISPLAY_MS = 1200;

export const BACKGROUND_ACTION_PROGRESS_STAGES = [
  { below: 60, increment: 4 },
  { below: 85, increment: 2 },
  { below: MAX_PENDING_BACKGROUND_ACTION_PROGRESS, increment: 1 },
] as const;

export const DEFAULT_BACKGROUND_ACTION_MESSAGES = {
  running: "Working in the background…",
  succeeded: "Completed successfully.",
  failed: "The action could not be completed. Please try again.",
} as const;
