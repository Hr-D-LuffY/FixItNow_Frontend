"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { ManagedCategoryCard } from "@/components/admin/ManagedCategoryCard";
import type { CategoriesListData } from "@/types/services";

export function CategoriesManager() {
	const [showCreateForm, setShowCreateForm] = useState(false);

	const categoriesQuery = useQuery({
		queryKey: ["categories"],
		queryFn: () => api.get<CategoriesListData>("/categories"),
	});

	if (categoriesQuery.isLoading) {
		return <CategoriesSkeleton />;
	}

	if (categoriesQuery.isError || !categoriesQuery.data) {
		return (
			<p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
				{categoriesQuery.error instanceof Error ?
					categoriesQuery.error.message
				:	"Couldn't load categories. The backend may be waking up from idle."}
			</p>
		);
	}

	// Assumed unpaginated (types/services.ts) — no Pagination control here,
	// same open question as CategoriesListData.
	const { categories } = categoriesQuery.data;

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<p className="text-sm text-ink/60">
					{categories.length}{" "}
					{categories.length === 1 ? "category" : "categories"}
				</p>
				{!showCreateForm && (
					<button
						type="button"
						onClick={() => setShowCreateForm(true)}
						className="inline-flex items-center justify-center rounded-md bg-dispatch px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
					>
						Add category
					</button>
				)}
			</div>

			{showCreateForm && (
				<CategoryForm
					onSuccess={() => setShowCreateForm(false)}
					onCancel={() => setShowCreateForm(false)}
				/>
			)}

			{categories.length === 0 && !showCreateForm && (
				<p className="text-sm text-ink/60">No categories yet.</p>
			)}

			<div className="flex flex-col gap-3">
				{categories.map((category) => (
					<ManagedCategoryCard key={category.id} category={category} />
				))}
			</div>
		</div>
	);
}

function CategoriesSkeleton() {
	return (
		<div className="flex flex-col gap-3">
			{Array.from({ length: 4 }).map((_, i) => (
				<div
					key={i}
					className="h-16 w-full animate-pulse rounded-lg bg-surface"
				/>
			))}
		</div>
	);
}
