export type BackgroundActionStatus = "running" | "succeeded" | "failed";

export interface BackgroundAction {
  id: string;
  title: string;
  progress: number;
  status: BackgroundActionStatus;
  statusMessage: string;
}

export type BackgroundActionResult<T> =
  | { status: "succeeded"; value: T }
  | { status: "failed"; error: unknown };

export interface RunBackgroundActionOptions<T> {
  title: string;
  task: () => Promise<T>;
  onSuccess?: (value: T) => void | Promise<void>;
  runningMessage?: string;
  successMessage?: string;
  errorMessage?: string | ((error: unknown) => string);
  successDisplayMs?: number;
}

export interface BackgroundActionContextValue {
  runBackgroundAction: <T>(
    options: RunBackgroundActionOptions<T>,
  ) => Promise<BackgroundActionResult<T>>;
}
