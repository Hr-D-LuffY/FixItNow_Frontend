"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Pagination } from "@/components/ui/Pagination";
import { AdminBookingRow } from "@/components/admin/AdminBookingRow";
import type {
	Booking,
	BookingsListData,
	BookingStatus,
} from "@/types/bookings";

const PAGE_LIMIT = 10;

const STATUS_OPTIONS: Array<BookingStatus | "ALL"> = [
	"ALL",
	"REQUESTED",
	"ACCEPTED",
	"DECLINED",
	"CANCELLED",
	"COMPLETED",
];

export function AdminBookingsManager() {
	const [page, setPage] = useState(1);
	const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">(
		"ALL",
	);

	// GET /admin/bookings has no documented status query param — same posture
	// as the admin users search (commit 18). Filters only the current page's
	// results client-side, not the whole dataset.
	const bookingsQuery = useQuery({
		queryKey: ["admin", "bookings", page],
		queryFn: () =>
			api.get<BookingsListData>(
				`/admin/bookings?page=${page}&limit=${PAGE_LIMIT}`,
			),
	});

	if (bookingsQuery.isLoading) {
		return <BookingsListSkeleton />;
	}

	if (bookingsQuery.isError || !bookingsQuery.data) {
		return (
			<p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
				{bookingsQuery.error instanceof Error ?
					bookingsQuery.error.message
				:	"Couldn't load bookings. The backend may be waking up from idle."}
			</p>
		);
	}

	const { bookings, pagination } = bookingsQuery.data;

	const filteredBookings: Booking[] =
		statusFilter === "ALL" ? bookings : (
			bookings.filter((b) => b.status === statusFilter)
		);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-3">
				<label
					htmlFor="status-filter"
					className="text-sm font-medium text-ink/70"
				>
					Status
				</label>
				<select
					id="status-filter"
					value={statusFilter}
					onChange={(e) =>
						setStatusFilter(e.target.value as BookingStatus | "ALL")
					}
					className="rounded-md border border-ink/15 bg-paper px-3 py-2 text-sm text-ink outline-none focus-visible:border-primary"
				>
					{STATUS_OPTIONS.map((status) => (
						<option key={status} value={status}>
							{status === "ALL" ? "All statuses (this page)" : status}
						</option>
					))}
				</select>
			</div>

			{filteredBookings.length === 0 ?
				<p className="text-sm text-ink/60">
					No bookings match this page&apos;s results.
				</p>
			:	<div className="flex flex-col gap-4">
					{filteredBookings.map((booking) => (
						<AdminBookingRow key={booking.id} booking={booking} />
					))}
				</div>
			}

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
