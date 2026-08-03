import Link from "next/link";
import { StatusBadge } from "./StatusBadge";
import type { Booking } from "@/types/bookings";

export function BookingCard({ booking }: { booking: Booking }) {
	return (
		<Link
			href={`/dashboard/customer/bookings/${booking.id}`}
			className="ticket-divider flex flex-col gap-3 rounded-lg border border-ink/10 bg-surface p-5 pt-4 transition hover:border-primary/30"
		>
			<div className="flex items-start justify-between gap-4">
				<h3 className="text-base font-semibold text-ink">
					{booking.service?.title ?? "Service details unavailable"}
				</h3>
				<StatusBadge status={booking.status} />
			</div>

			{booking.notes && (
				<p className="text-sm text-ink/70">&ldquo;{booking.notes}&rdquo;</p>
			)}

			<div className="flex items-center justify-between text-xs text-ink/50">
				<span className="font-mono">${booking.price.toFixed(2)}</span>
				<span className="font-mono">
					{new Date(booking.createdAt).toLocaleDateString(undefined, {
						year: "numeric",
						month: "short",
						day: "numeric",
					})}
				</span>
			</div>
		</Link>
	);
}
