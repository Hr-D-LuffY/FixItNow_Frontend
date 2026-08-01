"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { api, ApiError } from "@/lib/api";
import {
	registerSchema,
	type RegisterFormValues,
	type RegisterPayload,
} from "@/lib/validations/auth";
import type { AuthResponse } from "@/types/auth";

export default function RegisterPage() {
	const router = useRouter();
	const [selectedRole, setSelectedRole] = useState<"CUSTOMER" | "TECHNICIAN">(
		"CUSTOMER",
	);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: { role: "CUSTOMER" },
	});

	const mutation = useMutation({
		mutationFn: (payload: RegisterPayload) =>
			api.post<AuthResponse>("/auth/register", payload, { skipAuth: true }),
		onSuccess: () => {
			toast.success("Account created — please log in.");
			router.push("/auth/login");
		},
		onError: (error: ApiError) => {
			toast.error(error.message || "Registration failed. Please try again.");
		},
	});

	const onSubmit = (values: RegisterFormValues) => {
		// Strip the frontend-only confirmPassword field before sending.
		const { confirmPassword, ...payload } = values;
		mutation.mutate(payload);
	};

	const handleRoleSelect = (role: "CUSTOMER" | "TECHNICIAN") => {
		setSelectedRole(role);
		setValue("role", role, { shouldValidate: true });
	};

	return (
		<main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
			<h1 className="mb-1 text-2xl font-semibold text-ink">
				Create an account
			</h1>
			<p className="mb-8 text-sm text-ink/60">
				Join FixItNow as a customer or a technician.
			</p>

			<form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
				{/* Role selector */}
				<div>
					<span className="mb-2 block text-sm font-medium text-ink">
						I am a...
					</span>
					<div className="grid grid-cols-2 gap-3">
						{(["CUSTOMER", "TECHNICIAN"] as const).map((role) => (
							<button
								key={role}
								type="button"
								onClick={() => handleRoleSelect(role)}
								aria-pressed={selectedRole === role}
								className={`rounded-md border px-4 py-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-dispatch ${
									selectedRole === role ?
										"border-primary bg-primary text-paper"
									:	"border-ink/15 bg-surface text-ink hover:border-primary/50"
								}`}
							>
								{role === "CUSTOMER" ? "Customer" : "Technician"}
							</button>
						))}
					</div>
					{errors.role && (
						<p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
					)}
				</div>

				{/* Name */}
				<div>
					<label
						htmlFor="name"
						className="mb-1 block text-sm font-medium text-ink"
					>
						Full name
					</label>
					<input
						id="name"
						type="text"
						{...register("name")}
						className="w-full rounded-md border border-ink/15 bg-paper px-3 py-2 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-dispatch"
					/>
					{errors.name && (
						<p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
					)}
				</div>

				{/* Email */}
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

				{/* Phone */}
				<div>
					<label
						htmlFor="phone"
						className="mb-1 block text-sm font-medium text-ink"
					>
						Phone number
					</label>
					<input
						id="phone"
						type="tel"
						{...register("phone")}
						className="w-full rounded-md border border-ink/15 bg-paper px-3 py-2 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-dispatch"
					/>
					{errors.phone && (
						<p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
					)}
				</div>

				{/* Password */}
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

				{/* Confirm password */}
				<div>
					<label
						htmlFor="confirmPassword"
						className="mb-1 block text-sm font-medium text-ink"
					>
						Confirm password
					</label>
					<input
						id="confirmPassword"
						type="password"
						{...register("confirmPassword")}
						className="w-full rounded-md border border-ink/15 bg-paper px-3 py-2 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-dispatch"
					/>
					{errors.confirmPassword && (
						<p className="mt-1 text-sm text-red-600">
							{errors.confirmPassword.message}
						</p>
					)}
				</div>

				<button
					type="submit"
					disabled={isSubmitting || mutation.isPending}
					className="w-full rounded-md bg-dispatch px-4 py-2.5 font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
				>
					{mutation.isPending ? "Creating account..." : "Create account"}
				</button>
			</form>
		</main>
	);
}
