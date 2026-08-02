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
			<div className="w-full h-[600px] overflow-y-auto">{children}</div>
		</div>
	);
}
