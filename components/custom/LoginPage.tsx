"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import AppButton from "@/views/button";
import PasswordInput from "@/views/passwordInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { LoginForm, loginSchema } from "@/schemas/auth/login.schema";
import { genericAxios } from "@/services/genericAxios";
import { LoginResponse } from "@/types/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toast";
import axios from "axios";

export default function LoginPage() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isValid,
            isSubmitting,
        },
    } = useForm<LoginForm>({
        resolver: yupResolver(loginSchema),
        mode: "onChange",
    });

    const onSubmit = async (data: LoginForm) => {
        try {
            const response = await genericAxios.post<LoginResponse>(
                "/admin/login",
                data
            );

            localStorage.setItem("token", response.data.data.token);
            localStorage.removeItem("refreshToken");
            router.push("/dashboard");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message ??
                        error.message ??
                        "Something went wrong"
                );
            } else toast.error("Something went wrong");
        }
    };

    return (
        <main className="relative flex h-full min-h-[calc(100dvh-65px)] items-center justify-center overflow-hidden bg-[var(--almond-canvas)] px-6 text-[var(--almond-ink)]">
            <div className="pointer-events-none absolute inset-0 animate-ambient-drift bg-[radial-gradient(circle_at_15%_18%,rgba(208,163,106,0.22),transparent_26%),radial-gradient(circle_at_84%_76%,rgba(166,111,68,0.12),transparent_28%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(111,78,55,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(111,78,55,0.06)_1px,transparent_1px)] [background-size:48px_48px]" />

            <div className="relative w-full max-w-md rounded-3xl border border-[var(--almond-border)]/15 bg-[var(--almond-surface)]/90 p-8 shadow-2xl shadow-[#74523a]/10 backdrop-blur-xl sm:p-10">
                <div className="mb-8 flex flex-col items-center text-center">
                    <Link href="/login" className="mb-7 flex items-center gap-3 font-semibold tracking-tight text-[var(--almond-ink)]">
                        <span className="flex size-10 items-center justify-center overflow-hidden rounded-xl border border-[var(--almond-border)]/20 bg-[var(--almond-accent-soft)]">
                            <Image src="/assets/almond-kernel.png" alt="" width={40} height={40} className="size-full object-contain p-0.5" priority />
                        </span>
                        <span>Roasted Almonds</span>
                    </Link>

                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--almond-accent-soft)] text-[var(--almond-accent)]">
                        <ShieldCheck className="h-6 w-6" />
                    </div>

                    <h1 className="text-2xl font-semibold tracking-tight text-[var(--almond-ink)]">
                        Administrator sign-in
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-[var(--almond-copy)]">
                        Enter the master password to access the internal workspace.
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <PasswordInput
                        id="password"
                        label="Master Password"
                        placeholder="Enter your master password"
                        {...register("password")}
                        error={errors.password?.message}
                        className="h-11 border-[var(--almond-border)]/25 bg-[var(--almond-surface-muted)] px-3 text-[var(--almond-ink)] placeholder:text-[var(--almond-muted)] focus-visible:border-[var(--almond-accent)] focus-visible:ring-[var(--almond-accent)]/20 aria-invalid:border-[var(--almond-border)]/25 aria-invalid:ring-0"
                    />

                    <AppButton
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        loading={isSubmitting}
                        className="h-11 bg-[var(--almond-accent)] text-white hover:bg-[var(--almond-accent-hover)]"
                    >
                        Continue to admin
                    </AppButton>
                </form>

                <div className="mt-7 border-t border-[var(--almond-border)]/15 pt-5 text-center">
                    <Link href="/login" className="text-sm text-[var(--almond-copy)] transition hover:text-[var(--almond-ink)]">
                        Return to user sign-in
                    </Link>
                </div>
            </div>
        </main>
    );
}
