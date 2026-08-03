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
	REQUESTED: "bg-status-requested-bg text-status-requested", // Yellow/Orange
	ACCEPTED: "bg-status-accepted-bg text-status-accepted", // Blue
	DECLINED: "bg-status-declined-bg text-status-declined", // Red
	CANCELLED: "bg-status-cancelled-bg text-status-cancelled", // Dark Red
	PAID: "bg-purple-100 text-purple-700", // stopgap — no --color-status-paid token yet; Purple per spec
	IN_PROGRESS: "bg-green-100 text-green-700", // stopgap — no --color-status-in-progress token yet; Green per spec
	COMPLETED: "bg-status-completed-bg text-status-completed", // Gray
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
