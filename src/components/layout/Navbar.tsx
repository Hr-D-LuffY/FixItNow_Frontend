"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";
import { useAuthStore } from "@/store/auth-store";

const DASHBOARD_PATH: Record<string, string> = {
	CUSTOMER: "/dashboard/customer",
	TECHNICIAN: "/dashboard/technician",
	ADMIN: "/dashboard/admin",
};

const NAV_LINKS = [
	{ href: "/", label: "Home" },
	{ href: "/services", label: "Browse services" },
];

export default function Navbar() {
	const pathname = usePathname();
	const router = useRouter();
	const [mobileOpen, setMobileOpen] = useState(false);

	const user = useAuthStore((state) => state.user);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const isHydrating = useAuthStore((state) => state.isHydrating);
	const logout = useAuthStore((state) => state.logout);

	const handleLogout = () => {
		logout();
		setMobileOpen(false);
		router.push("/");
	};

	const isActive = (href: string) =>
		href === "/" ? pathname === "/" : pathname.startsWith(href);

	return (
		<header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur">
			<nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3">
				<Logo className="flex items-center gap-2" />

				{/* Primary nav links — desktop */}
				<div className="hidden flex-1 items-center gap-6 md:flex">
					{NAV_LINKS.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={`text-sm font-medium transition-colors hover:text-primary ${
								isActive(link.href) ? "text-primary" : "text-ink/70"
							}`}
						>
							{link.label}
						</Link>
					))}
				</div>

				{/* Auth section — desktop */}
				<div className="hidden items-center gap-4 md:flex">
					{isHydrating ?
						// Skeleton to avoid a flash of logged-out UI while
						// AuthHydrator's /auth/me call resolves.
						<div className="h-8 w-24 animate-pulse rounded-md bg-surface" />
					: isAuthenticated && user ?
						<>
							<Link
								href={DASHBOARD_PATH[user.role] ?? "/"}
								className="text-sm font-medium text-ink hover:text-primary"
							>
								{user?.name?.split(" ")[0] ?? "Your"}&apos;s Dashboard
							</Link>
							<button
								onClick={handleLogout}
								className="rounded-md border border-ink/15 px-3 py-1.5 text-sm font-medium text-ink hover:border-primary/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-dispatch"
							>
								Log out
							</button>
						</>
					:	<>
							<Link
								href="/auth/login"
								className="text-sm font-medium text-ink hover:text-primary"
							>
								Log in
							</Link>
							<Link
								href="/auth/register"
								className="rounded-md bg-dispatch px-3 py-1.5 text-sm font-medium text-paper hover:opacity-90"
							>
								Register
							</Link>
						</>
					}
				</div>

				{/* Mobile menu toggle */}
				<button
					type="button"
					aria-expanded={mobileOpen}
					aria-controls="mobile-menu"
					aria-label="Toggle menu"
					onClick={() => setMobileOpen((v) => !v)}
					className="flex h-9 w-9 items-center justify-center rounded-md text-ink hover:bg-surface md:hidden"
				>
					<svg
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						{mobileOpen ?
							<>
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</>
						:	<>
								<line x1="3" y1="6" x2="21" y2="6" />
								<line x1="3" y1="12" x2="21" y2="12" />
								<line x1="3" y1="18" x2="21" y2="18" />
							</>
						}
					</svg>
				</button>
			</nav>

			{/* Mobile panel */}
			{mobileOpen && (
				<div id="mobile-menu" className="ticket-divider border-t md:hidden">
					<div className="flex flex-col gap-3 px-4 py-4">
						{NAV_LINKS.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={() => setMobileOpen(false)}
								className={`text-sm font-medium ${
									isActive(link.href) ? "text-primary" : "text-ink"
								}`}
							>
								{link.label}
							</Link>
						))}

						<div className="ticket-divider pt-3">
							{isAuthenticated && user ?
								<div className="flex flex-col gap-3 pt-3">
									<Link
										href={DASHBOARD_PATH[user.role] ?? "/"}
										onClick={() => setMobileOpen(false)}
										className="text-sm font-medium text-ink"
									>
										{user.name.split(" ")[0]}&apos;s Dashboard
									</Link>
									<button
										onClick={handleLogout}
										className="text-left text-sm font-medium text-ink"
									>
										Log out
									</button>
								</div>
							:	<div className="flex flex-col gap-3 pt-3">
									<Link
										href="/auth/login"
										onClick={() => setMobileOpen(false)}
										className="text-sm font-medium text-ink"
									>
										Log in
									</Link>
									<Link
										href="/auth/register"
										onClick={() => setMobileOpen(false)}
										className="text-sm font-medium text-ink"
									>
										Register
									</Link>
								</div>
							}
						</div>
					</div>
				</div>
			)}
		</header>
	);
}