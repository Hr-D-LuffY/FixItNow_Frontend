"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import {
	technicianProfileSchema,
	type TechnicianProfileFormInput,
	type TechnicianProfileFormOutput,
} from "@/lib/validations/technician";
import type {
	SaveTechnicianProfileInput,
	TechnicianProfileResponseData,
} from "@/types/technician";

export function TechnicianProfileForm() {
	const { user, isAuthenticated, isHydrating } = useAuthStore();
	const queryClient = useQueryClient();
	const profileQuery = useQuery({
		queryKey: ["technician-profile"],
		queryFn: () =>
			api.get<TechnicianProfileResponseData>("/technicians/profile"),
		enabled: isAuthenticated && user?.role === "TECHNICIAN",
		retry: (failureCount, error) =>
			error instanceof ApiError && error.status === 404 ?
				false
			:	failureCount < 2,
	});

	const notCreatedYet =
		profileQuery.isError &&
		profileQuery.error instanceof ApiError &&
		profileQuery.error.status === 404;

	const profile = profileQuery.data?.technician;

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		reset,
		formState: { errors },
	} = useForm<TechnicianProfileFormInput, unknown, TechnicianProfileFormOutput>(
		{
			resolver: zodResolver(technicianProfileSchema),
			defaultValues: {
				bio: "",
				skills: "",
				experienceYears: undefined,
				availability: true,
			},
		},
	);

	// Prefill once the real profile loads (no-op while it's still 404/loading).
	useEffect(() => {
		if (profile) {
			reset({
				bio: profile.bio ?? "",
				skills: profile.skills.join(", "),
				experienceYears: profile.experienceYears ?? undefined,
				availability: profile.availability,
			});
		}
	}, [profile, reset]);

	const availability = watch("availability");

	const saveMutation = useMutation({
		mutationFn: (values: TechnicianProfileFormOutput) => {
			const body: SaveTechnicianProfileInput = {
				bio: values.bio || undefined,
				skills:
					values.skills
						?.split(",")
						.map((skill) => skill.trim())
						.filter(Boolean) ?? [],
				experienceYears: values.experienceYears,
				availability: values.availability,
			};

			return profile ?
					api.patch<TechnicianProfileResponseData>("/technicians/profile", body)
				:	api.post<TechnicianProfileResponseData>("/technicians/profile", body);
		},
		onSuccess: (data) => {
			toast.success(profile ? "Profile updated" : "Profile created");
			queryClient.setQueryData(["technician-profile"], data);
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ? error.message : "Couldn't save your profile",
			);
		},
	});

	if (isHydrating) {
		return <ProfileFormSkeleton />;
	}

	if (!isAuthenticated) {
		return (
			<p className="text-sm text-ink/60">
				Sign in with a technician account to manage your profile.
			</p>
		);
	}

	if (user?.role !== "TECHNICIAN") {
		return (
			<p className="text-sm text-ink/60">
				Only technician accounts have a profile to manage here.
			</p>
		);
	}

	if (profileQuery.isLoading) {
		return <ProfileFormSkeleton />;
	}

	if (profileQuery.isError && !notCreatedYet) {
		return (
			<p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
				{profileQuery.error instanceof Error ?
					profileQuery.error.message
				:	"Couldn't load your profile. The backend may be waking up from idle — try again in a moment."
				}
			</p>
		);
	}

	return (
		<form
			onSubmit={handleSubmit((values) => saveMutation.mutate(values))}
			className="flex flex-col gap-5 rounded-lg border border-ink/10 bg-surface p-6"
		>
			{notCreatedYet && (
				<p className="text-sm text-ink/60">
					You haven&apos;t set up your technician profile yet — fill this in so
					customers can see your bio and skills on your service listings.
				</p>
			)}

			<div className="flex flex-col gap-1.5">
				<label htmlFor="bio" className="text-sm font-medium text-ink">
					Bio
				</label>
				<textarea
					id="bio"
					rows={4}
					{...register("bio")}
					placeholder="Tell customers a bit about your experience and approach"
					className="rounded-md border border-ink/15 bg-paper px-3 py-2 text-sm text-ink outline-none focus-visible:border-primary"
				/>
				{errors.bio && (
					<p className="text-xs text-red-700">{errors.bio.message}</p>
				)}
			</div>

			<div className="flex flex-col gap-1.5">
				<label htmlFor="skills" className="text-sm font-medium text-ink">
					Skills
				</label>
				<input
					id="skills"
					type="text"
					{...register("skills")}
					placeholder="Plumbing, Electrical, HVAC (comma-separated)"
					className="rounded-md border border-ink/15 bg-paper px-3 py-2 text-sm text-ink outline-none focus-visible:border-primary"
				/>
				{errors.skills && (
					<p className="text-xs text-red-700">{errors.skills.message}</p>
				)}
			</div>

			<div className="flex flex-col gap-1.5">
				<label
					htmlFor="experienceYears"
					className="text-sm font-medium text-ink"
				>
					Years of experience
				</label>
				<input
					id="experienceYears"
					type="number"
					min={0}
					max={60}
					{...register("experienceYears")}
					className="w-32 rounded-md border border-ink/15 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus-visible:border-primary"
				/>
				{errors.experienceYears && (
					<p className="text-xs text-red-700">
						{errors.experienceYears.message}
					</p>
				)}
			</div>

			<div className="flex items-center justify-between border-t border-ink/10 pt-4">
				<div>
					<p className="text-sm font-medium text-ink">Accepting new jobs</p>
					<p className="text-xs text-ink/60">
						Toggle off to hide yourself from new booking requests
					</p>
				</div>
				<button
					type="button"
					role="switch"
					aria-checked={availability}
					onClick={() =>
						setValue("availability", !availability, { shouldDirty: true })
					}
					className={`relative h-6 w-11 shrink-0 rounded-full transition ${
						availability ? "bg-dispatch" : "bg-ink/20"
					}`}
				>
					<span
						className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${
							availability ? "left-5" : "left-0.5"
						}`}
					/>
				</button>
			</div>

			<button
				type="submit"
				disabled={saveMutation.isPending}
				className="mt-2 inline-flex w-fit items-center justify-center rounded-md bg-dispatch px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-60"
			>
				{saveMutation.isPending ?
					"Saving..."
				: profile ?
					"Save changes"
				:	"Create profile"}
			</button>
		</form>
	);
}

function ProfileFormSkeleton() {
	return (
		<div className="flex flex-col gap-4 rounded-lg border border-ink/10 bg-surface p-6">
			<div className="h-4 w-24 animate-pulse rounded bg-paper" />
			<div className="h-20 w-full animate-pulse rounded bg-paper" />
			<div className="h-4 w-24 animate-pulse rounded bg-paper" />
			<div className="h-10 w-full animate-pulse rounded bg-paper" />
			<div className="h-10 w-32 animate-pulse rounded bg-paper" />
		</div>
	);
}
