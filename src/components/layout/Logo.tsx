import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
	return (
		<Link
			href="/"
			className={`inline-flex items-center gap-2 shrink-0 ${className}`}
			aria-label="FixItNow home"
		>
			<svg
				width="26"
				height="26"
				viewBox="0 0 26 26"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
			>
				<rect width="26" height="26" rx="7" className="fill-primary" />
				<path
					d="M8 15.5L11 18.5L18 9.5"
					stroke="var(--color-dispatch)"
					strokeWidth="2.25"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
			<span className="text-lg font-extrabold tracking-tight text-ink">
				FixIt<span className="text-primary">Now</span>
			</span>
		</Link>
	);
}
