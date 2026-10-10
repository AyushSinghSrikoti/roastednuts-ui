"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoaderCircle } from "lucide-react";
import { toast } from "react-toast";
import * as yup from "yup";

import { Button } from "@/components/ui/button";
import { genericAxios } from "@/services/genericAxios";
import AppInput from "@/views/formInput";

interface ForgotPasswordForm {
  email: string;
}

const schema: yup.ObjectSchema<ForgotPasswordForm> = yup.object({
  email: yup.string().email("Enter a valid email address").required("Email is required"),
});

const inputClassName =
  "h-11 border-[var(--almond-border)]/25 bg-[var(--almond-surface-muted)] px-3 text-[var(--almond-ink)] placeholder:text-[var(--almond-muted)] focus-visible:border-[var(--almond-accent)] focus-visible:ring-[var(--almond-accent)]/20 aria-invalid:border-[var(--almond-border)]/25 aria-invalid:ring-0";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<ForgotPasswordForm>({
      resolver: yupResolver(schema),
      mode: "onChange",
      reValidateMode: "onChange",
    });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      const response = await genericAxios.post<{ resetToken?: string }>(
        "/auth/forgot-password",
        data,
      );
      const resetToken = response.data.data.resetToken;
      if (resetToken) {
        router.push(`/reset-password?token=${encodeURIComponent(resetToken)}`);
        return;
      }
      setSubmitted(true);
    } catch {
      toast.error("Unable to start password reset. Please try again.");
    }
  };

  return (
    <main className="flex min-h-full items-center justify-center bg-[var(--almond-canvas)] px-6 py-10 text-[var(--almond-ink)]">
      <section className="w-full max-w-md rounded-3xl border border-[var(--almond-border)]/15 bg-[var(--almond-surface)] p-8 text-left shadow-2xl shadow-[#74523a]/10">
        <Link href="/login" className="mb-7 flex w-full items-center justify-center gap-3 font-semibold tracking-tight text-[var(--almond-ink)]">
          <span className="flex size-9 shrink-0 items-center justify-start overflow-hidden">
            <Image src="/assets/almond-kernel.png" alt="" width={36} height={36} className="size-9 object-contain object-left" priority />
          </span>
          <span>Roasted Almonds</span>
        </Link>
        <h1 className="text-2xl font-semibold">Reset your password</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--almond-copy)]">
          Enter your account email and we’ll prepare secure reset instructions.
        </p>
        {submitted ? (
          <p className="mt-6 rounded-xl bg-[var(--almond-accent-softer)] p-4 text-sm">
            If an eligible account exists, password reset instructions have been sent.
          </p>
        ) : (
          <form className="mt-6 w-full space-y-5 text-left" onSubmit={handleSubmit(onSubmit)} noValidate>
            <AppInput
              id="email"
              label="Email address"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              error={errors.email?.message}
              aria-invalid={Boolean(errors.email)}
              className={inputClassName}
              {...register("email")}
            />
            <Button type="submit" className="w-full cursor-pointer bg-[var(--almond-accent)] text-white hover:bg-[var(--almond-accent-hover)]" disabled={isSubmitting}>
              {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
              Continue
            </Button>
          </form>
        )}
        <Link className="mt-6 block text-center text-sm font-semibold text-[var(--almond-accent)]" href="/login">
          Back to sign in
        </Link>
      </section>
    </main>
  );
}
