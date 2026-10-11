"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Check, LoaderCircle, X, XCircle } from "lucide-react";

import {
  BACKGROUND_ACTION_PROGRESS_INTERVAL_MS,
  BACKGROUND_ACTION_SUCCESS_DISPLAY_MS,
  DEFAULT_BACKGROUND_ACTION_MESSAGES,
  INITIAL_BACKGROUND_ACTION_PROGRESS,
  MAX_VISIBLE_BACKGROUND_ACTIONS,
} from "@/constants/background-actions";
import {
  createBackgroundActionId,
  getNextBackgroundActionProgress,
} from "@/helpers/background-action.helper";
import { cn } from "@/lib/utils";
import type {
  BackgroundAction,
  BackgroundActionContextValue,
  BackgroundActionResult,
  RunBackgroundActionOptions,
} from "@/types/background-action";

const BackgroundActionContext = createContext<BackgroundActionContextValue | null>(null);

function BackgroundActionPanel({
  actions,
  dismiss,
}: {
  actions: BackgroundAction[];
  dismiss: (id: string) => void;
}) {
  if (!actions.length) return null;

  return (
    <section
      className="fixed inset-x-4 bottom-4 z-[80] ml-auto flex max-w-sm flex-col gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[min(24rem,calc(100vw-3rem))]"
      aria-label="Background activity"
      aria-live="polite"
    >
      {actions.map((action) => (
        <article
          key={action.id}
          className={cn(
            "overflow-hidden rounded-2xl border bg-[#fffdf9] shadow-[0_18px_50px_rgba(45,29,20,0.2)]",
            action.status === "failed" ? "border-[#d7a097]" : "border-[#ded2c5]",
          )}
        >
          <div className="flex items-start gap-3 px-4 py-3.5">
            <span
              className={cn(
                "mt-0.5 grid size-8 shrink-0 place-items-center rounded-full",
                action.status === "running" && "bg-[#f2e5d7] text-[#75452e]",
                action.status === "succeeded" && "bg-[#e9f0df] text-[#52683e]",
                action.status === "failed" && "bg-[#fae7e3] text-[#a14536]",
              )}
              aria-hidden="true"
            >
              {action.status === "running" ? <LoaderCircle className="size-4 animate-spin" /> : null}
              {action.status === "succeeded" ? <Check className="size-4" /> : null}
              {action.status === "failed" ? <XCircle className="size-4" /> : null}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <p className="min-w-0 flex-1 truncate text-xs font-semibold text-[#39291f]">{action.title}</p>
                <span className={cn("text-xs font-semibold tabular-nums", action.status === "failed" ? "text-[#a14536]" : "text-[#75452e]")}>
                  {action.status === "failed" ? "Failed" : `${action.progress}%`}
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-4 text-[#8a7567]">{action.statusMessage}</p>
            </div>

            {action.status === "failed" ? (
              <button
                type="button"
                onClick={() => dismiss(action.id)}
                className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-lg text-[#9a8172] transition hover:bg-[#f2e9e1] hover:text-[#4b382d]"
                aria-label={`Dismiss ${action.title}`}
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>

          {action.status !== "failed" ? (
            <div className="h-1 bg-[#eee5dc]">
              <div
                className={cn(
                  "h-full transition-[width,background-color] duration-300 ease-out",
                  action.status === "succeeded" ? "bg-[#70845c]" : "bg-[#9b6748]",
                )}
                style={{ width: `${action.progress}%` }}
              />
            </div>
          ) : null}
        </article>
      ))}
    </section>
  );
}

export function BackgroundActionProvider({ children }: { children: React.ReactNode }) {
  const [actions, setActions] = useState<BackgroundAction[]>([]);
  const progressTimers = useRef(new Map<string, ReturnType<typeof setInterval>>());
  const removalTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const clearProgressTimer = useCallback((id: string) => {
    const timer = progressTimers.current.get(id);
    if (timer) clearInterval(timer);
    progressTimers.current.delete(id);
  }, []);

  const dismiss = useCallback(
    (id: string) => {
      clearProgressTimer(id);
      const removalTimer = removalTimers.current.get(id);
      if (removalTimer) clearTimeout(removalTimer);
      removalTimers.current.delete(id);
      setActions((current) => current.filter((action) => action.id !== id));
    },
    [clearProgressTimer],
  );

  useEffect(() => {
    const activeProgressTimers = progressTimers.current;
    const activeRemovalTimers = removalTimers.current;

    return () => {
      activeProgressTimers.forEach(clearInterval);
      activeRemovalTimers.forEach(clearTimeout);
    };
  }, []);

  const runBackgroundAction = useCallback(
    async <T,>(options: RunBackgroundActionOptions<T>): Promise<BackgroundActionResult<T>> => {
      const id = createBackgroundActionId();
      const successDisplayMs = options.successDisplayMs ?? BACKGROUND_ACTION_SUCCESS_DISPLAY_MS;

      setActions((current) =>
        [
          {
            id,
            title: options.title,
            progress: INITIAL_BACKGROUND_ACTION_PROGRESS,
            status: "running" as const,
            statusMessage: options.runningMessage ?? DEFAULT_BACKGROUND_ACTION_MESSAGES.running,
          },
          ...current,
        ].slice(0, MAX_VISIBLE_BACKGROUND_ACTIONS),
      );

      const progressTimer = setInterval(() => {
        setActions((current) =>
          current.map((action) =>
            action.id === id && action.status === "running"
              ? { ...action, progress: getNextBackgroundActionProgress(action.progress) }
              : action,
          ),
        );
      }, BACKGROUND_ACTION_PROGRESS_INTERVAL_MS);
      progressTimers.current.set(id, progressTimer);

      try {
        const value = await options.task();
        await options.onSuccess?.(value);
        clearProgressTimer(id);
        setActions((current) =>
          current.map((action) =>
            action.id === id
              ? {
                  ...action,
                  progress: 100,
                  status: "succeeded",
                  statusMessage: options.successMessage ?? DEFAULT_BACKGROUND_ACTION_MESSAGES.succeeded,
                }
              : action,
          ),
        );

        const removalTimer = setTimeout(() => dismiss(id), successDisplayMs);
        removalTimers.current.set(id, removalTimer);
        return { status: "succeeded", value };
      } catch (error: unknown) {
        clearProgressTimer(id);
        const statusMessage =
          typeof options.errorMessage === "function"
            ? options.errorMessage(error)
            : options.errorMessage ?? DEFAULT_BACKGROUND_ACTION_MESSAGES.failed;

        setActions((current) =>
          current.map((action) =>
            action.id === id
              ? { ...action, status: "failed", statusMessage }
              : action,
          ),
        );
        return { status: "failed", error };
      }
    },
    [clearProgressTimer, dismiss],
  );

  const value = useMemo(() => ({ runBackgroundAction }), [runBackgroundAction]);

  return (
    <BackgroundActionContext.Provider value={value}>
      {children}
      <BackgroundActionPanel actions={actions} dismiss={dismiss} />
    </BackgroundActionContext.Provider>
  );
}

export function useBackgroundActions() {
  const context = useContext(BackgroundActionContext);

  if (!context) {
    throw new Error("useBackgroundActions must be used within BackgroundActionProvider");
  }

  return context;
}
