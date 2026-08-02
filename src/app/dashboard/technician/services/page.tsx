import { TechnicianServicesManager } from "@/components/technician/TechnicianServicesManager";

export default function TechnicianServicesPage() {
	return (
		<main className="mx-auto max-w-3xl px-4 py-12">
			<h1 className="mb-6 text-2xl font-bold text-ink">My services</h1>
			<TechnicianServicesManager />
		</main>
	);
}
