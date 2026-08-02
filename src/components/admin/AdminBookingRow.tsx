import { StatusBadge } from "@/components/bookings/StatusBadge";
import type { Booking } from "@/types/bookings";

export function AdminBookingRow({ booking }: { booking: Booking }) {
	return (
		<div className="ticket-divider flex flex-col gap-3 rounded-lg border border-ink/10 bg-surface p-6 pt-6">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h3 className="text-base font-semibold text-ink">
						{booking.service?.title ?? "Service request"}
					</h3>
					{/* No nested customer field on Booking (decision 39) — admin view
					    can only show a truncated ID, same disclosed limitation as the
					    technician dashboard. Technician name shown when the nested
					    service happens to include it. */}
					<p className="font-mono text-xs text-ink/50">
						Booking #{booking.id.slice(0, 8)} · Customer #
						{booking.customerId.slice(0, 8)}
						{booking.service?.technician?.user?.name && (
							<> · {booking.service.technician.user.name}</>
						)}
					</p>
				</div>
				<StatusBadge status={booking.status} />
			</div>

			{booking.notes && (
				<p className="text-sm leading-relaxed text-ink/70">{booking.notes}</p>
			)}

			<p className="font-mono text-xs text-ink/40">
				Created {new Date(booking.createdAt).toLocaleDateString()}
			</p>
		</div>
	);
}
