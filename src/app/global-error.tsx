"use client";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<html lang="en">
			<body
				style={{
					margin: 0,
					minHeight: "100vh",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					gap: "1.5rem",
					padding: "1.5rem",
					textAlign: "center",
					fontFamily:
						"ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
					color: "#12151b",
					background: "#ffffff",
				}}
			>
				<span
					style={{
						fontFamily: "ui-monospace, monospace",
						fontSize: "0.875rem",
						letterSpacing: "0.1em",
						color: "#8a93a1",
					}}
				>
					CRITICAL ERROR
				</span>
				<h1 style={{ fontSize: "1.75rem", fontWeight: 600, margin: 0 }}>
					FixItNow hit a snag loading the app shell.
				</h1>
				<p style={{ color: "#5b6470", maxWidth: "28rem" }}>
					This is a rare, app-wide failure — not a missing page. Reloading
					usually fixes it.
				</p>
				<button
					onClick={reset}
					style={{
						borderRadius: "0.625rem",
						background: "#ff6a1f",
						color: "#ffffff",
						border: "none",
						padding: "0.625rem 1.25rem",
						fontWeight: 500,
						cursor: "pointer",
					}}
				>
					Reload
				</button>
			</body>
		</html>
	);
}
