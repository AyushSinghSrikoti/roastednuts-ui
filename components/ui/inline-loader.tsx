import { cn } from "@/lib/utils";

interface InlineLoaderProps {
  loading: boolean;
  label?: string;
  className?: string;
}

export function InlineLoader({ loading, label = "Loading", className }: InlineLoaderProps) {
  if (!loading) return null;

  return (
    <span className={cn("inline-flex items-center", className)} role="status" aria-label={label}>
      <span className="size-3 animate-spin rounded-full border-2 border-[#d8c7b8] border-t-[#75452e]" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
