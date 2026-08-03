import { TechnicianDashboardOverview } from "@/components/technician/TechnicianDashboardOverview";

export default function TechnicianDashboardPage() {
	return (
		<main className="mx-auto max-w-3xl px-4 py-12">
			<h1 className="mb-6 text-2xl font-bold text-ink">Technician dashboard</h1>
			<TechnicianDashboardOverview />
		</main>
	);
}
