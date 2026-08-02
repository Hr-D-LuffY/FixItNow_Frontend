import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="mx-auto max-w-5xl px-4 py-12">
			<h1 className="mb-6 text-2xl font-bold text-ink">Admin</h1>
			<AdminNav />
			<div className="w-full min-h-[400px] max-h-[80vh] overflow-y-auto sm:h-[600px] sm:max-h-none">{children}</div>
		</div>
	);
}
