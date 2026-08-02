import Link from "next/link";

export const metadata = {
	title: "Page not found — FixItNow",
};

export default function NotFound() {
	return (
		<main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-6 px-4 text-center">
			<span className="font-mono text-sm tracking-widest text-ink-faint">
				ERROR 404
			</span>
			<h1 className="text-3xl font-semibold text-ink sm:text-4xl">
				This job ticket doesn&apos;t exist.
			</h1>
			<p className="text-ink-muted">
				The page you&apos;re looking for was moved, completed, or never existed.
				Let&apos;s get you back to something real.
			</p>
			<div className="ticket-divider w-full pt-6" />
			<div className="flex flex-col gap-3 sm:flex-row">
				<Link
					href="/"
					className="rounded-md bg-dispatch px-5 py-2.5 font-medium text-white transition-colors hover:bg-dispatch-hover"
				>
					Back to home
				</Link>
				<Link
					href="/services"
					className="rounded-md border border-border px-5 py-2.5 font-medium text-ink transition-colors hover:bg-surface"
				>
					Browse services
				</Link>
			</div>
		</main>
	);
}
