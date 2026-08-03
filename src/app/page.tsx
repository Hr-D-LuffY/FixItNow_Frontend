"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { ServicesListData, CategoriesListData } from "@/types/services";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServiceCardSkeleton } from "@/components/services/ServiceCardSkeleton";

export default function HomePage() {
	const servicesQuery = useQuery({
		queryKey: ["services", { page: 1, limit: 6 }],
		queryFn: () => apiFetch<ServicesListData>("/services?page=1&limit=6"),
	});

	const services = servicesQuery.data?.services ?? [];

	return (
		<main className="mx-auto max-w-6xl px-4 py-12">
			<section className="mb-12 text-center">
				<h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
					Home services, <span className="text-primary">handled.</span>
				</h1>
				<p className="mx-auto mt-4 max-w-xl text-base text-ink/70">
					Book vetted technicians for repairs, installs, and maintenance — no
					phone tag, no guesswork.
				</p>
				<Link
					href="/services"
					className="mt-6 inline-flex items-center justify-center rounded-md bg-dispatch px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
				>
					Browse all services
				</Link>
			</section>

			<section>
				<div className="mb-6 flex items-center justify-between">
					<h2 className="text-xl font-bold text-ink">Featured services</h2>
					<Link
						href="/services"
						className="text-sm font-medium text-primary hover:underline"
					>
						View all
					</Link>
				</div>

				{servicesQuery.isError && (
					<p className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
						{servicesQuery.error instanceof Error ?
							servicesQuery.error.message
						:	"Couldn't load services. The backend may be waking up from idle — try refreshing in a moment."
						}
					</p>
				)}

				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{servicesQuery.isLoading &&
						Array.from({ length: 6 }).map((_, i) => (
							<ServiceCardSkeleton key={i} />
						))}

					{!servicesQuery.isLoading &&
						!servicesQuery.isError &&
						services.length === 0 && (
							<p className="col-span-full text-center text-sm text-ink/60">
								No services available yet.
							</p>
						)}

					{services.map((service) => (
						<ServiceCard key={service.id} service={service} />
					))}
				</div>
			</section>
		</main>
	);
}
