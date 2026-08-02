import type { PaymentStatus } from "@/types/payments";

const LABELS: Record<PaymentStatus, string> = {
	PENDING: "Pending",
	SUCCEEDED: "Paid",
	FAILED: "Failed",
};

const CLASS_BY_STATUS: Record<PaymentStatus, string> = {
	PENDING: "bg-payment-pending-bg text-payment-pending",
	SUCCEEDED: "bg-payment-succeeded-bg text-payment-succeeded",
	FAILED: "bg-payment-failed-bg text-payment-failed",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
	return (
		<span
			className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${CLASS_BY_STATUS[status]}`}
		>
			{LABELS[status]}
		</span>
	);
}
