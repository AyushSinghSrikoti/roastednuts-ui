import AuthenticatedRoute from "@/components/auth/AuthenticatedRoute";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AuthenticatedRoute>{children}</AuthenticatedRoute>;
}
