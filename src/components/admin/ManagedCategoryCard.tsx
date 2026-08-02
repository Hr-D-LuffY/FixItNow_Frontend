"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { CategoryForm } from "@/components/admin/CategoryForm";
import type { Category } from "@/types/services";

export function ManagedCategoryCard({ category }: { category: Category }) {
	const [isEditing, setIsEditing] = useState(false);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: () => api.delete(`/categories/${category.id}`),
		onSuccess: () => {
			toast.success("Category deleted");
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			setConfirmOpen(false);
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ?
					error.message
				:	"Couldn't delete this category — it may still have services attached to it",
			);
			setConfirmOpen(false);
		},
	});

	if (isEditing) {
		return (
			<CategoryForm
				category={category}
				onSuccess={() => setIsEditing(false)}
				onCancel={() => setIsEditing(false)}
			/>
		);
	}

	return (
		<div className="flex items-center justify-between gap-4 rounded-lg border border-ink/10 bg-surface p-5">
			<div>
				<h3 className="text-sm font-semibold text-ink">{category.name}</h3>
				{category.description && (
					<p className="mt-0.5 text-sm text-ink/60">{category.description}</p>
				)}
			</div>
			<div className="flex shrink-0 items-center gap-4">
				<button
					type="button"
					onClick={() => setIsEditing(true)}
					className="text-sm font-medium text-primary hover:underline"
				>
					Edit
				</button>
				<button
					type="button"
					onClick={() => setConfirmOpen(true)}
					className="text-sm font-medium text-red-700 hover:underline"
				>
					Delete
				</button>
			</div>

			<ConfirmDialog
				open={confirmOpen}
				title="Delete this category?"
				description={`"${category.name}" will be removed. If any services still reference this category, the backend may reject the delete.`}
				confirmLabel="Delete category"
				cancelLabel="Cancel"
				variant="danger"
				isLoading={deleteMutation.isPending}
				onConfirm={() => deleteMutation.mutate()}
				onCancel={() => setConfirmOpen(false)}
			/>
		</div>
	);
}
