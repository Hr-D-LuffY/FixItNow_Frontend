"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import { useAuthStore } from "@/store/auth-store";

const DASHBOARD_PATH: Record<string, string> = {
	CUSTOMER: "/dashboard/customer",
	TECHNICIAN: "/dashboard/technician",
	ADMIN: "/dashboard/admin",
};

export default function Navbar() {
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

	return (
		<header className="border-b border-ink/10 bg-paper">
			<nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
				<Logo className="flex items-center gap-2" />

				{/* Desktop auth section — swap in your existing nav links here */}
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

				{/* Mobile menu toggle — keep your existing button, just make
            sure aria-expanded/aria-controls still point at the panel */}
				<button
					type="button"
					aria-expanded={mobileOpen}
					aria-controls="mobile-menu"
					aria-label="Toggle menu"
					onClick={() => setMobileOpen((v) => !v)}
					className="md:hidden"
				>
					{/* your existing hamburger icon */}
				</button>
			</nav>

			{/* Mobile panel */}
			{mobileOpen && (
				<div id="mobile-menu" className="ticket-divider border-t md:hidden">
					<div className="flex flex-col gap-3 px-4 py-4">
						{isAuthenticated && user ?
							<>
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
							</>
						:	<>
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
							</>
						}
					</div>
				</div>
			)}
		</header>
	);
}
