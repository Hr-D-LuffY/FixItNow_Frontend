"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";

const NAV_LINKS = [{ href: "/services", label: "Browse services" }];

export default function Navbar() {
	const [open, setOpen] = useState(false);

	return (
		<header className="sticky top-0 z-40 border-b border-border bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
				<Logo />

				{/* Desktop nav */}
				<nav className="hidden items-center gap-8 md:flex">
					{NAV_LINKS.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
						>
							{link.label}
						</Link>
					))}
				</nav>

				<div className="hidden items-center gap-3 md:flex">
					<Link
						href="/auth/login"
						className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
					>
						Log in
					</Link>
					<Link
						href="/auth/register"
						className="rounded-full bg-dispatch px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-dispatch-hover"
					>
						Get started
					</Link>
				</div>

				{/* Mobile menu toggle */}
				<button
					type="button"
					onClick={() => setOpen((v) => !v)}
					className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink md:hidden"
					aria-expanded={open}
					aria-controls="mobile-nav"
					aria-label={open ? "Close menu" : "Open menu"}
				>
					<svg
						width="22"
						height="22"
						viewBox="0 0 22 22"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						{open ?
							<path
								d="M5 5L17 17M17 5L5 17"
								stroke="currentColor"
								strokeWidth="1.75"
								strokeLinecap="round"
							/>
						:	<path
								d="M3 6H19M3 11H19M3 16H19"
								stroke="currentColor"
								strokeWidth="1.75"
								strokeLinecap="round"
							/>
						}
					</svg>
				</button>
			</div>

			{/* Mobile nav panel */}
			{open && (
				<nav
					id="mobile-nav"
					className="border-t border-border bg-paper px-4 pb-4 md:hidden"
				>
					<ul className="flex flex-col gap-1 pt-2">
						{NAV_LINKS.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									onClick={() => setOpen(false)}
									className="block rounded-md px-2 py-2.5 text-sm font-medium text-ink-muted hover:bg-surface hover:text-ink"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
					<div className="ticket-divider mt-3 flex flex-col gap-2 pt-3">
						<Link
							href="/auth/login"
							onClick={() => setOpen(false)}
							className="rounded-md px-2 py-2.5 text-center text-sm font-medium text-ink-muted hover:bg-surface hover:text-ink"
						>
							Log in
						</Link>
						<Link
							href="/auth/register"
							onClick={() => setOpen(false)}
							className="rounded-full bg-dispatch px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-dispatch-hover"
						>
							Get started
						</Link>
					</div>
				</nav>
			)}
		</header>
	);
}
