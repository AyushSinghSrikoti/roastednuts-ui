export function getInitials(name: string, email: string | null, fallback = "RN"): string {
  const source = name.trim() || email?.split("@")[0] || fallback;

  return source
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
