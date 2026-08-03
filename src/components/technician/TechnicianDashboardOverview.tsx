"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import type { TechnicianProfileResponseData } from "@/types/technician";
import type { BookingsListData } from "@/types/bookings";

export function TechnicianDashboardOverview() {
	const { user, isAuthenticated, isHydrating } = useAuthStore();

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

	// Reuses the backend's `status` filter (confirmed in booking.service.ts's
	// browseBookings) rather than fetching all bookings just to count one status.
	const incomingQuery = useQuery({
		queryKey: ["technician-bookings", "incoming-count"],
		queryFn: () =>
			api.get<BookingsListData>("/bookings?status=REQUESTED&limit=1"),
		enabled: isAuthenticated && user?.role === "TECHNICIAN",
	});

	if (isHydrating) {
		return <OverviewSkeleton />;
	}

	if (!isAuthenticated) {
		return (
			<p className="text-sm text-ink/60">
				Sign in with a technician account to view your dashboard.
			</p>
		);
	}

	if (user?.role !== "TECHNICIAN") {
		return (
			<p className="text-sm text-ink/60">
				This dashboard is only available to technician accounts.
			</p>
		);
	}

	if (profileQuery.isLoading || incomingQuery.isLoading) {
		return <OverviewSkeleton />;
	}

	const notCreatedYet =
		profileQuery.isError &&
		profileQuery.error instanceof ApiError &&
		profileQuery.error.status === 404;

	const profile = profileQuery.data?.profile;
	const incomingCount = incomingQuery.data?.pagination.total ?? 0;

	return (
		<div className="flex flex-col gap-6">
			<div className="ticket-divider rounded-lg border border-ink/10 bg-surface p-6 pt-6">
				<div className="flex items-start justify-between gap-4">
					<div className="min-w-0">
						<h2 className="text-lg font-semibold text-ink">Your profile</h2>
						{notCreatedYet ?
							<p className="text-sm text-ink/60">
								You haven&apos;t set up your technician profile yet.
							</p>
						: profile ?
							<>
								<p className="mt-1 line-clamp-2 max-w-prose text-sm text-ink/70">
									{profile.bio || "No bio added yet."}
								</p>
								<p className="mt-2 text-xs font-medium">
									{profile.availability ?
										<span className="text-status-completed">
											Accepting new jobs
										</span>
									:	<span className="text-ink/50">Not accepting new jobs</span>}
								</p>
							</>
						:	<p className="text-sm text-red-700">
								Couldn&apos;t load your profile.
							</p>
						}
					</div>
					<Link
						href="/dashboard/technician/profile"
						className="shrink-0 text-sm font-medium text-primary hover:underline"
					>
						{profile ? "Edit profile" : "Create profile"}
					</Link>
				</div>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<Link
					href="/dashboard/technician/bookings"
					className="ticket-divider flex flex-col gap-1 rounded-lg border border-ink/10 bg-surface p-6 pt-6 transition hover:border-primary"
				>
					<span className="font-mono text-3xl font-semibold text-ink">
						{incomingCount}
					</span>
					<span className="text-sm text-ink/60">
						Incoming booking {incomingCount === 1 ? "request" : "requests"}
					</span>
				</Link>

				<Link
					href="/dashboard/technician/services"
					className="ticket-divider flex flex-col gap-1 rounded-lg border border-ink/10 bg-surface p-6 pt-6 transition hover:border-primary"
				>
					<span className="text-sm font-medium text-ink">Manage services</span>
					<span className="text-xs text-ink/60">
						Add, edit, or remove your listed services
					</span>
				</Link>
			</div>
		</div>
	);
}

function OverviewSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			<div className="h-28 w-full animate-pulse rounded-lg bg-surface" />
			<div className="grid gap-4 sm:grid-cols-2">
				<div className="h-24 w-full animate-pulse rounded-lg bg-surface" />
				<div className="h-24 w-full animate-pulse rounded-lg bg-surface" />
			</div>
		</div>
	);
}
