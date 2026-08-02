"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Swap for a real logging service later if one gets added to the stack.
		console.error("Route error boundary caught:", error);
	}, [error]);

	return (
		<main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-6 px-4 text-center">
			<span className="font-mono text-sm tracking-widest text-ink-faint">
				ERROR 500
			</span>
			<h1 className="text-3xl font-semibold text-ink sm:text-4xl">
				Something broke on our end.
			</h1>
			<p className="text-ink-muted">
				That wasn&apos;t supposed to happen. Try again, or head back home — if
				it keeps happening, the backend may just be waking up from a cold start.
			</p>
			<div className="ticket-divider w-full pt-6" />
			<div className="flex flex-col gap-3 sm:flex-row">
				<button
					onClick={reset}
					className="rounded-md bg-dispatch px-5 py-2.5 font-medium text-white transition-colors hover:bg-dispatch-hover"
				>
					Try again
				</button>
				<Link
					href="/"
					className="rounded-md border border-border px-5 py-2.5 font-medium text-ink transition-colors hover:bg-surface"
				>
					Back to home
				</Link>
			</div>
		</main>
	);
}
