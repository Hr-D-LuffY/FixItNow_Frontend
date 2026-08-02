"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_LINKS = [
	{ href: "/dashboard/admin", label: "Overview" },
	{ href: "/dashboard/admin/users", label: "Users" },
	{ href: "/dashboard/admin/bookings", label: "Bookings" },
	{ href: "/dashboard/admin/categories", label: "Categories" },
];

export function AdminNav() {
	const pathname = usePathname();

	return (
		<nav className="mb-8 flex items-center gap-1 border-b border-ink/10">
			{ADMIN_LINKS.map((link) => {
				const isActive =
					link.href === "/dashboard/admin" ?
						pathname === link.href
					:	pathname?.startsWith(link.href);

				return (
					<Link
						key={link.href}
						href={link.href}
						className={`px-4 py-3 text-sm font-medium transition ${
							isActive ?
								"border-b-2 border-primary text-primary"
							:	"text-ink/60 hover:text-ink"
						}`}
					>
						{link.label}
					</Link>
				);
			})}
		</nav>
	);
}
