"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoaderCircle } from "lucide-react";
import { toast } from "react-toast";
import * as yup from "yup";

import { Button } from "@/components/ui/button";
import { genericAxios } from "@/services/genericAxios";
import PasswordInput from "@/views/passwordInput";

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const inputClassName =
  "h-11 border-[var(--almond-border)]/25 bg-[var(--almond-surface-muted)] px-3 text-[var(--almond-ink)] placeholder:text-[var(--almond-muted)] focus-visible:border-[var(--almond-accent)] focus-visible:ring-[var(--almond-accent)]/20 aria-invalid:border-[var(--almond-border)]/25 aria-invalid:ring-0";

const schema: yup.ObjectSchema<ResetPasswordForm> = yup.object({
  password: yup.string().matches(strongPassword, "Use 8+ characters with uppercase, lowercase, a number, and a special character").required("Password is required"),
  confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords do not match").required("Confirm your password"),
});

interface ResetPasswordPageProps {
  token?: string;
}

export default function ResetPasswordPage({ token }: ResetPasswordPageProps) {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<ResetPasswordForm>({ resolver: yupResolver(schema), mode: "onChange" });

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      toast.error("This password reset link is invalid.");
      return;
    }
    try {
      await genericAxios.post("/auth/reset-password", { token, ...data });
      router.replace("/login");
    } catch {
      toast.error("This password reset link is invalid or expired.");
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
        <h1 className="text-2xl font-semibold tracking-tight">Choose a new password</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--almond-copy)]">
          Create a strong password that you do not use elsewhere.
        </p>
        <form className="mt-6 w-full space-y-5 text-left" onSubmit={handleSubmit(onSubmit)} noValidate>
          <PasswordInput id="password" label="New password" placeholder="Enter your new password" autoComplete="new-password" error={errors.password?.message} aria-invalid={Boolean(errors.password)} className={inputClassName} {...register("password")} />
          <PasswordInput id="confirmPassword" label="Confirm new password" placeholder="Enter your new password again" autoComplete="new-password" error={errors.confirmPassword?.message} aria-invalid={Boolean(errors.confirmPassword)} className={inputClassName} {...register("confirmPassword")} />
          <Button type="submit" className="h-11 w-full cursor-pointer bg-[var(--almond-accent)] text-white hover:bg-[var(--almond-accent-hover)] disabled:cursor-wait disabled:opacity-80" disabled={isSubmitting || !token}>
            {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
            Reset password
          </Button>
        </form>
        <Link className="mt-6 block text-center text-sm font-semibold text-[var(--almond-accent)]" href="/login">Back to sign in</Link>
      </section>
    </main>
  );
}
