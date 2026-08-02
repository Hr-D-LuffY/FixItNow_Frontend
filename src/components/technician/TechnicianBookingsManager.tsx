"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { Pagination } from "@/components/ui/Pagination";
import { TechnicianBookingRow } from "@/components/technician/TechnicianBookingRow";
import type { BookingsListData } from "@/types/bookings";

export function TechnicianBookingsManager() {
	const { user, isAuthenticated, isHydrating } = useAuthStore();
	const [page, setPage] = useState(1);

	// GET /bookings is server-side role-scoped (per API_INTEGRATION.md), so
	// no client-side filtering needed here — unlike /services in commit 16.
	const bookingsQuery = useQuery({
		queryKey: ["technician-bookings", page],
		queryFn: () => api.get<BookingsListData>(`/bookings?page=${page}&limit=10`),
		enabled: isAuthenticated && user?.role === "TECHNICIAN",
	});

	if (isHydrating) {
		return <BookingsListSkeleton />;
	}

	if (!isAuthenticated) {
		return (
			<p className="text-sm text-ink/60">
				Sign in with a technician account to manage your bookings.
			</p>
		);
	}

	if (user?.role !== "TECHNICIAN") {
		return (
			<p className="text-sm text-ink/60">
				Only technician accounts can manage bookings here.
			</p>
		);
	}

	if (bookingsQuery.isLoading) {
		return <BookingsListSkeleton />;
	}

	if (bookingsQuery.isError || !bookingsQuery.data) {
		return (
			<p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
				{bookingsQuery.error instanceof Error ?
					bookingsQuery.error.message
				:	"Couldn't load your bookings. The backend may be waking up from idle — try again in a moment."
				}
			</p>
		);
	}

	const { bookings, pagination } = bookingsQuery.data;

	if (bookings.length === 0) {
		return <p className="text-sm text-ink/60">No booking requests yet.</p>;
	}

	return (
		<div className="flex flex-col gap-4">
			{bookings.map((booking) => (
				<TechnicianBookingRow key={booking.id} booking={booking} />
			))}

			<Pagination
				page={pagination.page}
				totalPages={pagination.totalPages}
				onPageChange={setPage}
			/>
		</div>
	);
}

function BookingsListSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			<div className="h-32 w-full animate-pulse rounded-lg bg-surface" />
			<div className="h-32 w-full animate-pulse rounded-lg bg-surface" />
		</div>
	);
}
