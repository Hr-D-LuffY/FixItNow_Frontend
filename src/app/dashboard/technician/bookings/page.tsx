import { TechnicianBookingsManager } from "@/components/technician/TechnicianBookingsManager";

export default function TechnicianBookingsPage() {
	return (
		<main className="mx-auto max-w-3xl px-4 py-12">
			<h1 className="mb-6 text-2xl font-bold text-ink">Booking requests</h1>
			<TechnicianBookingsManager />
		</main>
	);
}
