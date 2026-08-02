"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AdminStatsData } from "@/types/admin";

const KNOWN_STATUS_LABELS: Record<string, string> = {
	REQUESTED: "Requested",
	ACCEPTED: "Accepted",
	DECLINED: "Declined",
	CANCELLED: "Cancelled",
	COMPLETED: "Completed",
	PAID: "Paid", // not in the 5 documented BookingStatus values — see types/admin.ts
};

function labelForStatus(status: string): string {
	return (
		KNOWN_STATUS_LABELS[status] ??
		status.charAt(0) + status.slice(1).toLowerCase()
	);
}

export function AdminStatsOverview() {
	const statsQuery = useQuery({
		queryKey: ["admin", "stats"],
		queryFn: () => api.get<AdminStatsData>("/admin/bookings/stats"),
	});

	if (statsQuery.isLoading) {
		return <StatsSkeleton />;
	}

	if (statsQuery.isError || !statsQuery.data) {
		return (
			<p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
				{statsQuery.error instanceof Error ?
					statsQuery.error.message
				:	"Couldn't load platform stats. The backend may be waking up from idle."
				}
			</p>
		);
	}

	// Confirmed flat shape — no `.stats` wrapper.
	const stats = statsQuery.data;
	const statusEntries = Object.entries(stats.byStatus ?? {});

	return (
		<div className="flex flex-col gap-6">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<StatCard label="Total bookings" value={stats.totalBookings} />
				<StatCard
					label="Total revenue"
					value={
						stats.totalRevenue !== undefined ?
							`$${stats.totalRevenue.toFixed(2)}`
						:	undefined
					}
					mono
				/>
			</div>

			<div className="rounded-lg border border-ink/10 bg-paper">
				<div className="border-b border-ink/10 px-4 py-3">
					<h2 className="text-sm font-semibold text-ink">Bookings by status</h2>
				</div>
				<div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3">
					{statusEntries.map(([status, count]) => (
						<div key={status} className="flex flex-col gap-1">
							<span className="text-xs uppercase tracking-wide text-ink/50">
								{labelForStatus(status)}
							</span>
							<span className="font-mono text-lg font-semibold text-ink">
								{count}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

function StatCard({
	label,
	value,
	mono,
}: {
	label: string;
	value: number | string | undefined;
	mono?: boolean;
}) {
	return (
		<div className="rounded-lg border border-ink/10 bg-surface p-5">
			<p className="text-xs uppercase tracking-wide text-ink/50">{label}</p>
			<p
				className={`mt-1 text-2xl font-bold text-ink ${mono ? "font-mono" : ""}`}
			>
				{value ?? "—"}
			</p>
		</div>
	);
}

function StatsSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{Array.from({ length: 2 }).map((_, i) => (
				<div
					key={i}
					className="h-24 w-full animate-pulse rounded-lg bg-surface"
				/>
			))}
		</div>
	);
}
