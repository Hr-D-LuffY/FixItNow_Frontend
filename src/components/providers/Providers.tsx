"use client";

import { Toaster } from "sonner";

/**
 * Single client-boundary wrapper for the whole app. Sonner's <Toaster />
 * lives here now; TanStack Query's <QueryClientProvider> and the auth store
 * hydration will be added to this same file in later commits rather than
 * introducing a second provider tree.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<>
			{children}
			<Toaster
				position="top-center"
				richColors
				toastOptions={{
					style: {
						fontFamily: "var(--font-sans)",
					},
				}}
			/>
		</>
	);
}
