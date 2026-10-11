import {
  BACKGROUND_ACTION_PROGRESS_STAGES,
  MAX_PENDING_BACKGROUND_ACTION_PROGRESS,
} from "@/constants/background-actions";

export function createBackgroundActionId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getNextBackgroundActionProgress(progress: number): number {
  const stage = BACKGROUND_ACTION_PROGRESS_STAGES.find(({ below }) => progress < below);
  return stage
    ? Math.min(stage.below, progress + stage.increment)
    : MAX_PENDING_BACKGROUND_ACTION_PROGRESS;
}
