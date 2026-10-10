import GuestRoute from "@/components/auth/GuestRoute";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <GuestRoute>{children}</GuestRoute>;
}
