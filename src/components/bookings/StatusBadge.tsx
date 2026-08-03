import type { BookingStatus } from "@/types/bookings";

const STATUS_LABEL: Record<BookingStatus, string> = {
	REQUESTED: "Requested",
	ACCEPTED: "Accepted",
	DECLINED: "Declined",
	CANCELLED: "Cancelled",
	PAID: "Paid",
	IN_PROGRESS: "In progress",
	COMPLETED: "Completed",
};

const STATUS_CLASS: Record<BookingStatus, string> = {
	REQUESTED: "bg-status-requested-bg text-status-requested",
	ACCEPTED: "bg-status-accepted-bg text-status-accepted",
	DECLINED: "bg-status-declined-bg text-status-declined",
	CANCELLED: "bg-status-cancelled-bg text-status-cancelled",
	PAID: "bg-blue-100 text-blue-700", // stopgap — no --color-status-paid token yet
	IN_PROGRESS: "bg-amber-100 text-amber-700", // stopgap — no --color-status-in-progress token yet
	COMPLETED: "bg-status-completed-bg text-status-completed",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
	return (
		<span
			className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASS[status]}`}
		>
			{STATUS_LABEL[status]}
		</span>
	);
}
