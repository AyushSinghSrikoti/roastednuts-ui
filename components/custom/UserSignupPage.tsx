"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, LoaderCircle, Mail } from "lucide-react";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toast";

import { Button } from "@/components/ui/button";
import {
  UserSignupForm,
  userSignupSchema,
} from "@/domains/auth/schemas/user-signup.schema";
import AppInput from "@/views/formInput";
import PasswordInput from "@/views/passwordInput";
import { genericAxios } from "@/services/genericAxios";
import type { ApiErrorResponse } from "@/types";
import type { SignupResponse } from "@/types/auth";

const productHighlights = [
  "One account for your entire workspace",
  "Secure access to every playground",
  "Get started in just a few seconds",
];

const inputClassName =
  "h-11 border-[var(--almond-border)]/25 bg-[var(--almond-surface-muted)] px-3 text-[var(--almond-ink)] placeholder:text-[var(--almond-muted)] focus-visible:border-[var(--almond-accent)] focus-visible:ring-[var(--almond-accent)]/20 aria-invalid:border-[var(--almond-border)]/25 aria-invalid:ring-0";

export default function UserSignupPage() {
  const router = useRouter();
  const [dotCount, setDotCount] = useState(1);
  const {
    register,
    handleSubmit,
    formState: { dirtyFields, errors, isSubmitting },
  } = useForm<UserSignupForm>({
    resolver: yupResolver(userSignupSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (!isSubmitting) {
      return;
    }

    const interval = window.setInterval(() => {
      setDotCount((count) => (count === 3 ? 1 : count + 1));
    }, 400);

    return () => window.clearInterval(interval);
  }, [isSubmitting]);

  const onSubmit = async (data: UserSignupForm) => {
    try {
      const response = await genericAxios.post<SignupResponse>(
        "/auth/signup",
        data,
      );

      window.localStorage.setItem("token", response.data.data.token);
      window.localStorage.setItem(
        "refreshToken",
        response.data.data.refreshToken,
      );
      router.push("/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const message = error.response?.data.message;
        toast.error(
          Array.isArray(message)
            ? message[0]
            : message ?? "Unable to create your account",
        );
        return;
      }

      toast.error("Unable to create your account");
    }
  };

  return (
    <main className="h-full min-h-[calc(100dvh-65px)] overflow-hidden bg-[var(--almond-canvas)] text-[var(--almond-ink)] lg:min-h-0">
      <div className="relative isolate min-h-full overflow-hidden px-6 py-6 lg:grid lg:h-full lg:min-h-0 lg:grid-rows-[auto_1fr] lg:px-10 lg:py-4">
        <div className="pointer-events-none absolute inset-0 animate-ambient-drift bg-[radial-gradient(circle_at_15%_18%,rgba(208,163,106,0.22),transparent_26%),radial-gradient(circle_at_84%_76%,rgba(166,111,68,0.12),transparent_28%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(111,78,55,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(111,78,55,0.06)_1px,transparent_1px)] [background-size:48px_48px]" />

        <header className="relative mx-auto flex w-full max-w-7xl items-center">
          <Link href="/login" className="flex items-center gap-3 font-semibold tracking-tight">
            <span className="flex size-10 items-center justify-center overflow-hidden">
              <Image src="/assets/almond-kernel.png" alt="" width={40} height={40} className="size-full object-contain p-0.5" priority />
            </span>
            <span>Roasted Almonds</span>
          </Link>
        </header>

        <div className="relative mx-auto grid w-full max-w-7xl items-start gap-12 pt-10 pb-12 lg:min-h-0 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:pt-6 lg:pb-4">
          <section className="relative max-w-xl lg:pt-10">
            <h1 className="text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Create your workspace account.
            </h1>
            <p className="mt-6 max-w-lg text-pretty text-base leading-7 text-[var(--almond-copy)] sm:text-lg">
              Join Roasted Almonds and keep your ideas, workflows, and tools together in one focused place.
            </p>
            <ul className="mt-8 space-y-3">
              {productHighlights.map((highlight) => (
                <li key={highlight} className="flex items-center gap-3 text-sm">
                  <span className="flex size-5 items-center justify-center rounded-full bg-[var(--almond-accent-soft)] text-[var(--almond-accent)]">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  {highlight}
                </li>
              ))}
            </ul>
          </section>

          <section className="w-full max-w-md justify-self-center lg:justify-self-end">
            <div className="animate-auth-card-enter rounded-3xl border border-[var(--almond-border)]/15 bg-[var(--almond-surface)]/90 p-7 shadow-2xl shadow-[#74523a]/10 backdrop-blur-xl sm:p-9 lg:p-6">
              <div className="mb-7 lg:mb-4">
                <h2 className="text-2xl font-semibold tracking-tight">Create an account</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--almond-copy)]">Enter your details to get started.</p>
              </div>

              <form className="space-y-5 lg:space-y-3" onSubmit={handleSubmit(onSubmit)} noValidate>
                <AppInput id="email" type="email" label="Email address" placeholder="you@company.com" autoComplete="email" error={errors.email?.message} aria-invalid={Boolean(errors.email)} className={inputClassName} rightIcon={<Mail className="size-4 text-[var(--almond-muted)]" />} {...register("email")} />
                <PasswordInput id="password" label="Password" placeholder="Create a strong password" autoComplete="new-password" error={dirtyFields.password ? errors.password?.message : undefined} aria-invalid={dirtyFields.password && Boolean(errors.password)} className={inputClassName} {...register("password", { deps: ["confirmPassword"] })} />
                <PasswordInput id="confirmPassword" label="Confirm password" placeholder="Enter your password again" autoComplete="new-password" error={dirtyFields.confirmPassword ? errors.confirmPassword?.message : undefined} aria-invalid={dirtyFields.confirmPassword && Boolean(errors.confirmPassword)} className={inputClassName} {...register("confirmPassword")} />
                <Button type="submit" disabled={isSubmitting} className="h-11 w-full cursor-pointer bg-[var(--almond-accent)] text-white hover:bg-[var(--almond-accent-hover)] disabled:cursor-wait disabled:opacity-80">
                  {isSubmitting ? (
                    <span className="flex items-center gap-2" aria-live="polite">
                      <LoaderCircle className="size-4 animate-spin" />
                      Creating account{".".repeat(dotCount)}
                    </span>
                  ) : (
                    <>
                      Create account <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="my-7 flex items-center gap-3 text-xs text-[var(--almond-muted)] lg:my-4">
                <span className="h-px flex-1 bg-[var(--almond-border)]/30" />
                or continue with
                <span className="h-px flex-1 bg-[var(--almond-border)]/30" />
              </div>

              <Button type="button" variant="outline" onClick={() => { window.location.assign(new URL("auth/google", `${process.env.NEXT_PUBLIC_API_BASE_URL}/`).toString()); }} className="h-11 w-full cursor-pointer border-[var(--almond-border)]/25 bg-[var(--almond-surface-muted)] text-[var(--almond-ink)] hover:bg-[var(--almond-accent-softer)] hover:text-[var(--almond-ink)]">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
                  <path fill="#4285F4" d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5a4.7 4.7 0 0 1-2 3.1v2.5h3.2c1.9-1.8 3.1-4.4 3.1-7.4Z" />
                  <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.2-2.5c-.9.6-2 .9-3.5.9-2.7 0-4.9-1.8-5.7-4.2H3v2.6A10 10 0 0 0 12 22Z" />
                  <path fill="#FBBC05" d="M6.3 13.8A6 6 0 0 1 6 12c0-.6.1-1.2.3-1.8V7.6H3A10 10 0 0 0 3 16.4l3.3-2.6Z" />
                  <path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.8-2.8C17 3.2 14.7 2 12 2a10 10 0 0 0-9 5.6l3.3 2.6C7.1 7.8 9.3 6 12 6Z" />
                </svg>
                Continue with Google
              </Button>

              <p className="mt-7 text-center text-sm text-[var(--almond-copy)] lg:mt-4">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-[var(--almond-accent)] transition hover:text-[var(--almond-accent-hover)]">Sign in</Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
