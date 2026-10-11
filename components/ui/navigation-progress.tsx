"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const COMPLETE_DELAY_MS = 220;

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname}?${searchParams.toString()}`;
  const previousRouteKey = useRef(routeKey);
  const browserLocation = useRef<string | null>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const clearTimers = useCallback(() => {
    if (progressTimer.current) clearInterval(progressTimer.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    progressTimer.current = null;
    hideTimer.current = null;
  }, []);

  const start = useCallback(() => {
    clearTimers();
    setVisible(true);
    setProgress(12);
    progressTimer.current = setInterval(() => {
      setProgress((current) => current >= 88 ? current : current + Math.max(1, (88 - current) * 0.12));
    }, 180);
  }, [clearTimers]);

  const complete = useCallback(() => {
    if (progressTimer.current) clearInterval(progressTimer.current);
    progressTimer.current = null;
    setProgress(100);
    hideTimer.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
      hideTimer.current = null;
    }, COMPLETE_DELAY_MS);
  }, []);

  useEffect(() => {
    browserLocation.current = `${window.location.pathname}${window.location.search}`;
    if (previousRouteKey.current === routeKey) return;
    previousRouteKey.current = routeKey;
    const completionTimer = setTimeout(complete, 0);
    return () => clearTimeout(completionTimer);
  }, [complete, routeKey]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin) return;

      const currentLocation = `${window.location.pathname}${window.location.search}`;
      const nextLocation = `${destination.pathname}${destination.search}`;
      if (currentLocation === nextLocation) return;
      start();
    };

    const handlePopState = () => {
      const nextLocation = `${window.location.pathname}${window.location.search}`;
      if (browserLocation.current === nextLocation) return;
      browserLocation.current = nextLocation;
      start();
    };

    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleDocumentClick, true);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleDocumentClick, true);
      clearTimers();
    };
  }, [clearTimers, start]);

  return (
    <div
      role="progressbar"
      aria-label="Loading page"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      className={`pointer-events-none fixed inset-x-0 top-0 z-[200] h-0.5 transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className="h-full bg-[#9b6748] shadow-[0_0_10px_rgba(155,103,72,0.75)] transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
