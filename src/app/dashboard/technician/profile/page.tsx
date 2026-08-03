import { TechnicianProfileForm } from "@/components/technician/TechnicianProfileForm";

export default function TechnicianProfilePage() {
	return (
		<main className="mx-auto max-w-3xl px-4 py-12">
			<h1 className="mb-6 text-2xl font-bold text-ink">
				Your technician profile
			</h1>
			<TechnicianProfileForm />
		</main>
	);
}
