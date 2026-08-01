"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ServicesListData, CategoriesListData } from "@/types/services";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServiceCardSkeleton } from "@/components/services/ServiceCardSkeleton";

const PAGE_SIZE = 9;

export default function ServicesPage() {
	const [page, setPage] = useState(1);
	const [categoryId, setCategoryId] = useState<string>("all");
	const [maxPrice, setMaxPrice] = useState<string>("");

	const servicesQuery = useQuery({
		queryKey: ["services", { page, limit: PAGE_SIZE }],
		queryFn: () =>
			api.get<ServicesListData>(`/services?page=${page}&limit=${PAGE_SIZE}`),
	});

	const categoriesQuery = useQuery({
		queryKey: ["categories"],
		queryFn: () => api.get<CategoriesListData>("/categories"),
	});

	const services = servicesQuery.data?.services ?? [];
	const categories = categoriesQuery.data?.categories ?? [];
	const pagination = servicesQuery.data?.pagination;

	const filteredServices = useMemo(() => {
		return services.filter((service) => {
			const matchesCategory =
				categoryId === "all" || service.categoryId === categoryId;

			const parsedMax = maxPrice ? Number(maxPrice) : null;
			const matchesPrice =
				parsedMax === null || Number.isNaN(parsedMax) ?
					true
				:	service.price <= parsedMax;

			return matchesCategory && matchesPrice;
		});
	}, [services, categoryId, maxPrice]);

	const hasActiveFilters = categoryId !== "all" || maxPrice !== "";

	return (
		<main className="mx-auto max-w-6xl px-4 py-12">
			<div className="mb-8 flex flex-col gap-2">
				<h1 className="text-2xl font-bold text-ink">Browse services</h1>
				<p className="text-sm text-ink/60">
					Filters apply to the page of results currently loaded — refine your
					search, or page through results below for more.
				</p>
			</div>

			<div className="mb-8 flex flex-wrap items-end gap-4 rounded-lg border border-ink/10 bg-surface p-4">
				<label className="flex flex-col gap-1 text-sm">
					<span className="font-medium text-ink/70">Category</span>
					<select
						value={categoryId}
						onChange={(e) => setCategoryId(e.target.value)}
						className="rounded-md border border-ink/15 bg-paper px-3 py-2 text-sm text-ink"
					>
						<option value="all">All categories</option>
						{categories.map((category) => (
							<option key={category.id} value={category.id}>
								{category.name}
							</option>
						))}
					</select>
				</label>

				<label className="flex flex-col gap-1 text-sm">
					<span className="font-medium text-ink/70">Max price</span>
					<input
						type="number"
						min={0}
						inputMode="decimal"
						placeholder="Any"
						value={maxPrice}
						onChange={(e) => setMaxPrice(e.target.value)}
						className="w-28 rounded-md border border-ink/15 bg-paper px-3 py-2 text-sm text-ink"
					/>
				</label>

				{hasActiveFilters && (
					<button
						type="button"
						onClick={() => {
							setCategoryId("all");
							setMaxPrice("");
						}}
						className="rounded-md px-3 py-2 text-sm font-medium text-primary hover:underline"
					>
						Clear filters
					</button>
				)}
			</div>

			{servicesQuery.isError && (
				<p className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
					{servicesQuery.error instanceof Error ?
						servicesQuery.error.message
					:	"Couldn't load services. Try again in a moment."}
				</p>
			)}

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{servicesQuery.isLoading &&
					Array.from({ length: PAGE_SIZE }).map((_, i) => (
						<ServiceCardSkeleton key={i} />
					))}

				{!servicesQuery.isLoading &&
					!servicesQuery.isError &&
					filteredServices.length === 0 && (
						<p className="col-span-full text-center text-sm text-ink/60">
							{hasActiveFilters ?
								"No services on this page match your filters — try clearing them or checking another page."
							:	"No services available yet."}
						</p>
					)}

				{filteredServices.map((service) => (
					<ServiceCard key={service.id} service={service} />
				))}
			</div>

			{pagination && pagination.totalPages > 1 && (
				<div className="mt-10 flex items-center justify-center gap-4">
					<button
						type="button"
						disabled={page <= 1}
						onClick={() => setPage((p) => Math.max(1, p - 1))}
						className="rounded-md border border-ink/15 px-4 py-2 text-sm font-medium text-ink disabled:opacity-40"
					>
						Previous
					</button>
					<span className="text-sm text-ink/60">
						Page {pagination.page} of {pagination.totalPages}
					</span>
					<button
						type="button"
						disabled={page >= pagination.totalPages}
						onClick={() =>
							setPage((p) => Math.min(pagination.totalPages, p + 1))
						}
						className="rounded-md border border-ink/15 px-4 py-2 text-sm font-medium text-ink disabled:opacity-40"
					>
						Next
					</button>
				</div>
			)}
		</main>
	);
}
