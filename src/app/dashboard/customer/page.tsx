"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { BookingCard } from "@/components/bookings/BookingCard";
import { Pagination } from "@/components/ui/Pagination";
import type { BookingsListData } from "@/types/bookings";

const LIMIT = 10;

export default function CustomerDashboardPage() {
	const [page, setPage] = useState(1);

	const bookingsQuery = useQuery({
		queryKey: ["bookings", page],
		queryFn: () =>
			api.get<BookingsListData>(`/bookings?page=${page}&limit=${LIMIT}`),
	});

	return (
		<main className="mx-auto max-w-4xl px-4 py-12">
			<h1 className="text-2xl font-bold text-ink">My Bookings</h1>
			<p className="mt-1 text-sm text-ink/60">
				Track the status of every service you&apos;ve requested.
			</p>

			<div className="mt-8">
				{bookingsQuery.isLoading && <BookingListSkeleton />}

				{bookingsQuery.isError && (
					<p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
						{bookingsQuery.error instanceof Error ?
							bookingsQuery.error.message
						:	"Couldn't load your bookings. The backend may be waking up from idle — try again in a moment."
						}
					</p>
				)}

				{bookingsQuery.data && bookingsQuery.data.bookings.length === 0 && (
					<div className="rounded-lg border border-dashed border-ink/15 p-10 text-center">
						<p className="text-sm text-ink/60">
							You haven&apos;t booked anything yet.
						</p>
						<Link
							href="/services"
							className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
						>
							Browse services →
						</Link>
					</div>
				)}

				{bookingsQuery.data && bookingsQuery.data.bookings.length > 0 && (
					<div className="flex flex-col gap-4">
						{bookingsQuery.data.bookings.map((booking) => (
							<BookingCard key={booking.id} booking={booking} />
						))}
					</div>
				)}
			</div>

			{bookingsQuery.data && (
				<Pagination
					page={bookingsQuery.data.pagination.page}
					totalPages={bookingsQuery.data.pagination.totalPages}
					onPageChange={setPage}
				/>
			)}
		</main>
	);
}

function BookingListSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			{Array.from({ length: 3 }).map((_, i) => (
				<div
					key={i}
					className="h-28 w-full animate-pulse rounded-lg bg-surface"
				/>
			))}
		</div>
	);
}
