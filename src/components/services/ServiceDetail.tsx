"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { BookingForm } from "@/components/bookings/BookingForm";
import type { ServiceDetailData } from "@/types/services";

export function ServiceDetail({ serviceId }: { serviceId: string }) {
	const [showBookingForm, setShowBookingForm] = useState(false);
	const { user, isAuthenticated, isHydrating } = useAuthStore();

	const serviceQuery = useQuery({
		queryKey: ["service", serviceId],
		queryFn: () => api.get<ServiceDetailData>(`/services/${serviceId}`),
	});

	if (serviceQuery.isLoading) {
		return <ServiceDetailSkeleton />;
	}

	if (serviceQuery.isError || !serviceQuery.data) {
		return (
			<main className="mx-auto max-w-4xl px-4 py-12">
				<p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
					{serviceQuery.error instanceof Error ?
						serviceQuery.error.message
					:	"Couldn't load this service. It may not exist, or the backend may be waking up from idle."
					}
				</p>
				<Link
					href="/services"
					className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
				>
					← Back to all services
				</Link>
			</main>
		);
	}

	const service = serviceQuery.data.service;
	const technician = service.technician;

	return (
		<main className="mx-auto max-w-4xl px-4 py-12">
			<Link
				href="/services"
				className="mb-6 inline-block text-sm font-medium text-primary hover:underline"
			>
				← Back to all services
			</Link>

			<div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.2fr]">
				<div className="relative h-64 w-full overflow-hidden rounded-lg bg-surface md:h-full">
					{service.imageUrl ?
						<Image
							src={service.imageUrl}
							alt={service.title}
							fill
							sizes="(min-width: 768px) 40vw, 100vw"
							className="object-cover"
						/>
					:	<div className="flex h-full w-full items-center justify-center text-6xl font-bold text-ink/20">
							{service.category?.name?.charAt(0)?.toUpperCase() ?? "?"}
						</div>
					}
				</div>

				<div className="flex flex-col gap-4">
					<span className="text-xs font-medium uppercase tracking-wide text-primary">
						{service.category?.name ?? "Service"}
					</span>
					<h1 className="text-3xl font-bold text-ink">{service.title}</h1>
					<p className="font-mono text-2xl font-semibold text-ink">
						${service.price.toFixed(2)}
					</p>
					<p className="text-sm leading-relaxed text-ink/70">
						{service.description}
					</p>

					{isHydrating ?
						<div className="mt-2 h-12 w-36 animate-pulse rounded-md bg-surface" />
					: !isAuthenticated ?
						<Link
							href={`/auth/login?from=/services/${serviceId}`}
							className="mt-2 inline-flex w-fit items-center justify-center rounded-md border border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5"
						>
							Sign in to book this service
						</Link>
					: user?.role !== "CUSTOMER" ?
						<p className="mt-2 text-sm text-ink/60">
							Only customer accounts can book services.
						</p>
					: showBookingForm ?
						<BookingForm serviceId={service.id} />
					:	<button
							type="button"
							onClick={() => setShowBookingForm(true)}
							className="mt-2 inline-flex w-fit items-center justify-center rounded-md bg-dispatch px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
						>
							Book Now
						</button>
					}
				</div>
			</div>

			<section className="ticket-divider mt-12 pt-8">
				<h2 className="mb-4 text-lg font-bold text-ink">
					About the technician
				</h2>

				<div className="flex flex-col gap-3 rounded-lg border border-ink/10 bg-surface p-6">
					<div className="flex items-center justify-between">
						<h3 className="text-base font-semibold text-ink">
							{technician?.user?.name ?? "Technician"}
						</h3>
						{technician?.availability ?
							<span className="text-xs font-medium text-green-600">
								Accepting new jobs
							</span>
						:	<span className="text-xs font-medium text-ink/40">
								Not accepting jobs right now
							</span>
						}
					</div>

					{technician?.experienceYears != null && (
						<p className="text-sm text-ink/60">
							{technician.experienceYears}{" "}
							{technician.experienceYears === 1 ? "year" : "years"} of
							experience
						</p>
					)}

					{technician?.bio && (
						<p className="text-sm leading-relaxed text-ink/70">
							{technician.bio}
						</p>
					)}

					{technician?.skills && technician.skills.length > 0 && (
						<div className="mt-2 flex flex-wrap gap-2">
							{technician.skills.map((skill) => (
								<span
									key={skill}
									className="rounded-full border border-ink/10 bg-paper px-3 py-1 text-xs font-medium text-ink/70"
								>
									{skill}
								</span>
							))}
						</div>
					)}
				</div>
			</section>
		</main>
	);
}

function ServiceDetailSkeleton() {
	return (
		<main className="mx-auto max-w-4xl px-4 py-12">
			<div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.2fr]">
				<div className="h-64 w-full animate-pulse rounded-lg bg-surface" />
				<div className="flex flex-col gap-4">
					<div className="h-3 w-20 animate-pulse rounded bg-surface" />
					<div className="h-8 w-3/4 animate-pulse rounded bg-surface" />
					<div className="h-6 w-24 animate-pulse rounded bg-surface" />
					<div className="h-16 w-full animate-pulse rounded bg-surface" />
					<div className="h-10 w-32 animate-pulse rounded bg-surface" />
				</div>
			</div>
		</main>
	);
}
