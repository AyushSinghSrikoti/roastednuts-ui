"use client" 

import { cn } from "@/lib/utils";
import "./globals.css";

import { Inter } from "next/font/google";
import Link from "next/link";
import { ToastContainer  } from "react-toast";


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, "grid min-h-dvh grid-rows-[1fr_auto] font-sans")}>
        <div className="min-h-0 bg-[var(--almond-canvas)]">{children}</div>
        <footer className="border-t border-[var(--almond-border)]/15 bg-[var(--almond-canvas)] px-6 py-4 text-xs text-[var(--almond-muted)] lg:px-10">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
            <span>© 2026 Roasted Almonds</span>
            <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              <Link href="/privacy" className="transition hover:text-[var(--almond-ink)]">Privacy Policy</Link>
              <Link href="/documentation" className="transition hover:text-[var(--almond-ink)]">Documentation</Link>
              <Link href="/terms" className="transition hover:text-[var(--almond-ink)]">Terms &amp; Conditions</Link>
            </nav>
          </div>
        </footer>
        <ToastContainer position="top-right" delay={4500} />
      </body>
    </html>
  );
}
