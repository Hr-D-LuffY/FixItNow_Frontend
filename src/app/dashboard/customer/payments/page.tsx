import { PaymentHistoryTable } from "@/components/payments/PaymentHistoryTable";

export default function CustomerPaymentsPage() {
	return (
		<main className="mx-auto max-w-4xl px-4 py-12">
			<h1 className="mb-6 text-2xl font-bold text-ink">Payment history</h1>
			<PaymentHistoryTable />
		</main>
	);
}
