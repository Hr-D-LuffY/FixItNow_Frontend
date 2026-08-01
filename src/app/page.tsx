import Link from "next/link";

/**
 * Temporary placeholder. The real homepage (featured services grid,
 * next/image, skeleton loaders) is built in Phase 2. This just proves the
 * layout/nav/footer/token system out and gives the app a non-boilerplate
 * landing state in the meantime.
 */
export default function Home() {
	return (
		<div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-start justify-center px-4 py-24 sm:px-6">
			<span className="font-mono text-xs uppercase tracking-widest text-dispatch">
				Home services, dispatched
			</span>
			<h1 className="mt-4 max-w-2xl text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
				Find trusted help for the job in front of you.
			</h1>
			<p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-muted">
				FixItNow connects you with vetted plumbers, electricians, cleaners, and
				more — book a technician and track the job from request to completion.
			</p>
			<div className="mt-8 flex flex-col gap-3 sm:flex-row">
				<Link
					href="/auth/register"
					className="rounded-full bg-dispatch px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-dispatch-hover"
				>
					Get started
				</Link>
				<Link
					href="/services"
					className="rounded-full border border-border px-6 py-3 text-center text-sm font-semibold text-ink transition-colors hover:bg-surface"
				>
					Browse services
				</Link>
			</div>
		</div>
	);
}
