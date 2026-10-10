import Image from "next/image";

interface AppLoaderProps {
  label?: string;
}

export default function AppLoader({
  label = "Loading",
}: AppLoaderProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 text-[var(--almond-copy)]"
      role="status"
      aria-live="polite"
    >
      <div className="relative flex size-12 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-[var(--almond-accent-soft)] border-t-[var(--almond-accent)] border-r-[var(--almond-border)]" />
        <Image
          src="/assets/almond-kernel.png"
          alt=""
          width={32}
          height={32}
          className="size-8 object-contain"
          priority
        />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
