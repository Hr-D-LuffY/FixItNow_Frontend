import Link from "next/link";
import Logo from "./Logo";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
	{
		title: "For customers",
		links: [
			{ href: "/services", label: "Browse services" },
			{ href: "/auth/register", label: "Book a technician" },
		],
	},
	{
		title: "For technicians",
		links: [{ href: "/auth/register", label: "Join as a technician" }],
	},
	{
		title: "Company",
		links: [
			{ href: "/auth/login", label: "Log in" },
			{ href: "/auth/register", label: "Create account" },
		],
	},
];

export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="ticket-divider mt-24 bg-surface">
			<div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
				<div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
					<div className="col-span-2 sm:col-span-1">
						<Logo />
						<p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">
							Book qualified home service technicians for the job in front of
							you.
						</p>
					</div>

					{COLUMNS.map((col) => (
						<div key={col.title}>
							<h3 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
								{col.title}
							</h3>
							<ul className="mt-3 flex flex-col gap-2">
								{col.links.map((link) => (
									<li key={link.label}>
										<Link
											href={link.href}
											className="text-sm text-ink-muted transition-colors hover:text-ink"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="ticket-divider mt-10 flex flex-col gap-2 pt-6 font-mono text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
					<span>© {year} FixItNow. All rights reserved.</span>
				</div>
			</div>
		</footer>
	);
}
