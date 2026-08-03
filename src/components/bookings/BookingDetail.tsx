"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { StatusBadge } from "@/components/bookings/StatusBadge";
import { CancelBookingButton } from "@/components/bookings/CancelBookingButton";
import { ReviewForm } from "@/components/bookings/ReviewForm";
import { PayButton } from "@/components/bookings/PayButton";
import type { BookingDetailData, BookingStatus } from "@/types/bookings";

// Not documented anywhere (same posture as decision 25's cancel gating) —
// sensible-default UI gating only, backend is the real enforcement point.
const PAYABLE_STATUSES: BookingStatus[] = ["ACCEPTED", "COMPLETED"];

export function BookingDetail({ bookingId }: { bookingId: string }) {
	const bookingQuery = useQuery({
		queryKey: ["booking", bookingId],
		queryFn: () => api.get<BookingDetailData>(`/bookings/${bookingId}`),
	});

	if (bookingQuery.isLoading) {
		return <BookingDetailSkeleton />;
	}

	if (bookingQuery.isError || !bookingQuery.data) {
		return (
			<main className="mx-auto max-w-3xl px-4 py-12">
				<p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
					{bookingQuery.error instanceof Error ?
						bookingQuery.error.message
					:	"Couldn't load this booking. It may not exist, or the backend may be waking up from idle."
					}
				</p>
				<Link
					href="/dashboard/customer"
					className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
				>
					← Back to your bookings
				</Link>
			</main>
		);
	}

	const booking = bookingQuery.data.booking;
	const service = booking.service;

	return (
		<main className="mx-auto max-w-3xl px-4 py-12">
			<Link
				href="/dashboard/customer"
				className="mb-6 inline-block text-sm font-medium text-primary hover:underline"
			>
				← Back to your bookings
			</Link>

			<div className="rounded-lg border border-ink/10 bg-surface p-6">
				<div className="flex items-start justify-between gap-4">
					<div>
						<h1 className="text-2xl font-bold text-ink">
							{service?.title ?? "Service details unavailable"}
						</h1>
					</div>
					<StatusBadge status={booking.status} />
				</div>

				<p className="font-mono text-xl font-semibold text-ink">
					${booking.price.toFixed(2)}
				</p>

				{booking.notes && (
					<p className="mt-4 text-sm leading-relaxed text-ink/70">
						<span className="font-medium text-ink">Notes: </span>
						{booking.notes}
					</p>
				)}

				<p className="mt-4 text-xs text-ink/40">
					Requested {new Date(booking.createdAt).toLocaleString()}
				</p>

				<div className="ticket-divider mt-6 flex flex-wrap items-center gap-3 pt-6">
					{PAYABLE_STATUSES.includes(booking.status) && (
						<PayButton bookingId={booking.id} />
					)}
					<CancelBookingButton booking={booking} />
				</div>
			</div>

			{booking.status === "COMPLETED" && (
				<section className="mt-8">
					<ReviewForm bookingId={booking.id} />
				</section>
			)}
		</main>
	);
}

function BookingDetailSkeleton() {
	return (
		<main className="mx-auto max-w-3xl px-4 py-12">
			<div className="h-96 w-full animate-pulse rounded-lg bg-surface" />
		</main>
	);
}
