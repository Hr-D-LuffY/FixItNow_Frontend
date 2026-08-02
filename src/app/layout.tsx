import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/providers/Providers";

export const metadata: Metadata = {
	title: "FixItNow — Your Trusted Home Service Platform",
	description:
		"Book qualified home service technicians for plumbing, electrical, cleaning, and more.",
};
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="h-full antialiased">
			<body className="flex min-h-full flex-col bg-paper text-ink">
				<Providers>
					<Navbar />
					<main className="flex flex-1 flex-col">{children}</main>
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
