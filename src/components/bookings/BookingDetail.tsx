"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { StatusBadge } from "./StatusBadge";
import { CancelBookingButton } from "./CancelBookingButton";
import { ReviewForm } from "./ReviewForm";
import { PayButton } from "@/components/bookings/PayButton";
import type { BookingDetailData , BookingStatus } from "@/types/bookings";


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
			<main className="mx-auto max-w-2xl px-4 py-12">
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
					← Back to my bookings
				</Link>
			</main>
		);
	}

	const booking = bookingQuery.data.booking;
	const service = booking.service;

	return (
		<main className="mx-auto max-w-2xl px-4 py-12">
			<Link
				href="/dashboard/customer"
				className="mb-6 inline-block text-sm font-medium text-primary hover:underline"
			>
				← Back to my bookings
			</Link>

			<div className="ticket-divider flex flex-col gap-4 pt-6">
				<div className="flex items-start justify-between gap-4">
					<div>
						<h1 className="text-2xl font-bold text-ink">
							{service?.title ?? "Service details unavailable"}
						</h1>
						{service?.technician?.user?.name && (
							<p className="mt-1 text-sm text-ink/60">
								with {service.technician.user.name}
							</p>
						)}
					</div>
					<StatusBadge status={booking.status} />
				</div>

				{service?.price != null && (
					<p className="font-mono text-xl font-semibold text-ink">
						${service.price.toFixed(2)}
					</p>
				)}

				{booking.notes && (
					<div className="rounded-lg border border-ink/10 bg-surface p-4">
						<p className="text-xs font-medium uppercase tracking-wide text-ink/50">
							Your notes
						</p>
						<p className="mt-1 text-sm text-ink/80">{booking.notes}</p>
					</div>
				)}

				<p className="mt-4 text-xs text-ink/40">
					Requested {new Date(booking.createdAt).toLocaleString()}
				</p>
				
				<p className="font-mono text-xs text-ink/50">
					Requested{" "}
					{new Date(booking.createdAt).toLocaleDateString(undefined, {
						year: "numeric",
						month: "short",
						day: "numeric",
					})}
				</p>

				<div className="mt-2 flex flex-wrap gap-3">
					<CancelBookingButton booking={booking} />
				</div>

				{booking.status === "COMPLETED" && (
					<div className="mt-4">
						<h2 className="mb-3 text-base font-bold text-ink">
							Leave a review
						</h2>
						<ReviewForm bookingId={booking.id} />
					</div>
				)}
			</div>
		</main>
	);
}

function BookingDetailSkeleton() {
	return (
		<main className="mx-auto max-w-2xl px-4 py-12">
			<div className="flex flex-col gap-4">
				<div className="h-4 w-32 animate-pulse rounded bg-surface" />
				<div className="h-8 w-2/3 animate-pulse rounded bg-surface" />
				<div className="h-6 w-24 animate-pulse rounded bg-surface" />
				<div className="h-20 w-full animate-pulse rounded bg-surface" />
			</div>
		</main>
	);
}
