"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { api, type ApiError } from "@/lib/api";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { useAuthStore } from "@/store/auth-store";
import type { AuthResponse } from "@/types/auth";

export default function LoginPage() {
	const router = useRouter();
	const login = useAuthStore((state) => state.login);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
	});

	const mutation = useMutation({
		mutationFn: (payload: LoginFormValues) =>
			api.post<AuthResponse>("/auth/login", payload, { skipAuth: true }),
		onSuccess: (data) => {
			login(data.user, data.token);
			toast.success(`Welcome back, ${data.user.name.split(" ")[0]}.`);

			router.push("/");
		},
		onError: (error: ApiError) => {
			toast.error(
				error.message || "Login failed. Check your credentials and try again.",
			);
		},
	});

	const onSubmit = (values: LoginFormValues) => {
		mutation.mutate(values);
	};

	return (
		<main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
			<h1 className="mb-1 text-2xl font-semibold text-ink">Welcome back</h1>
			<p className="mb-8 text-sm text-ink/60">
				Log in to your FixItNow account.
			</p>

			<form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
				<div>
					<label
						htmlFor="email"
						className="mb-1 block text-sm font-medium text-ink"
					>
						Email
					</label>
					<input
						id="email"
						type="email"
						{...register("email")}
						className="w-full rounded-md border border-ink/15 bg-paper px-3 py-2 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-dispatch"
					/>
					{errors.email && (
						<p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
					)}
				</div>

				<div>
					<label
						htmlFor="password"
						className="mb-1 block text-sm font-medium text-ink"
					>
						Password
					</label>
					<input
						id="password"
						type="password"
						{...register("password")}
						className="w-full rounded-md border border-ink/15 bg-paper px-3 py-2 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-dispatch"
					/>
					{errors.password && (
						<p className="mt-1 text-sm text-red-600">
							{errors.password.message}
						</p>
					)}
				</div>

				<button
					type="submit"
					disabled={isSubmitting || mutation.isPending}
					className="w-full rounded-md bg-dispatch px-4 py-2.5 font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
				>
					{mutation.isPending ? "Logging in..." : "Log in"}
				</button>

				<p className="text-center text-sm text-ink/60">
					Don&apos;t have an account?{" "}
					<Link
						href="/auth/register"
						className="font-medium text-primary underline underline-offset-2"
					>
						Register
					</Link>
				</p>
			</form>
		</main>
	);
}
