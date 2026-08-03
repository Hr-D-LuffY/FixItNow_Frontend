import { StatusBadge } from "@/components/bookings/StatusBadge";
import { BookingActionButtons } from "@/components/technician/BookingActionButtons";
import type { Booking } from "@/types/bookings";

export function TechnicianBookingRow({ booking }: { booking: Booking }) {
	return (
		<div className="ticket-divider flex flex-col gap-3 rounded-lg border border-ink/10 bg-surface p-6 pt-6">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h3 className="text-base font-semibold text-ink">
						{booking.service?.title ?? "Service request"}
					</h3>
					<p className="font-mono text-xs text-ink/50">
						Booking #{booking.id.slice(0, 8)} ·{" "}
						{booking.customer?.name ??
							`Customer #${booking.customerId.slice(0, 8)}`}
					</p>
				</div>
				<StatusBadge status={booking.status} />
			</div>

			{booking.notes && (
				<p className="text-sm leading-relaxed text-ink/70">{booking.notes}</p>
			)}

			<BookingActionButtons booking={booking} />
		</div>
	);
}
