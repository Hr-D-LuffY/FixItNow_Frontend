"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
	categorySchema,
	type CategoryFormValues,
} from "@/lib/validations/category";
import type {
	Category,
	CategoryResponseData,
	CreateCategoryInput,
	UpdateCategoryInput,
} from "@/types/services";

type CategoryFormProps = {
	category?: Category; // present → edit mode, absent → create mode
	onSuccess: () => void;
	onCancel: () => void;
};

export function CategoryForm({
	category,
	onSuccess,
	onCancel,
}: CategoryFormProps) {
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CategoryFormValues>({
		resolver: zodResolver(categorySchema),
		defaultValues: {
			name: category?.name ?? "",
			description: category?.description ?? "",
		},
	});

	const saveMutation = useMutation({
		mutationFn: (values: CategoryFormValues) => {
			if (category) {
				const body: UpdateCategoryInput = values;
				return api.patch<CategoryResponseData>(
					`/categories/${category.id}`,
					body,
				);
			}

			const body: CreateCategoryInput = values;
			return api.post<CategoryResponseData>("/categories", body);
		},
		onSuccess: () => {
			toast.success(category ? "Category updated" : "Category created");
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			onSuccess();
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ? error.message : "Couldn't save this category",
			);
		},
	});

	return (
		<form
			onSubmit={handleSubmit((values) => saveMutation.mutate(values))}
			className="flex flex-col gap-4 rounded-lg border border-ink/10 bg-surface p-6"
		>
			<div className="flex flex-col gap-1.5">
				<label htmlFor="name" className="text-sm font-medium text-ink">
					Name
				</label>
				<input
					id="name"
					type="text"
					{...register("name")}
					className="rounded-md border border-ink/15 bg-paper px-3 py-2 text-sm text-ink outline-none focus-visible:border-primary"
					placeholder="Plumbing"
				/>
				{errors.name && (
					<p className="text-xs text-red-700">{errors.name.message}</p>
				)}
			</div>

			<div className="flex flex-col gap-1.5">
				<label htmlFor="description" className="text-sm font-medium text-ink">
					Description{" "}
					<span className="font-normal text-ink/40">(optional)</span>
				</label>
				<textarea
					id="description"
					rows={3}
					{...register("description")}
					className="rounded-md border border-ink/15 bg-paper px-3 py-2 text-sm text-ink outline-none focus-visible:border-primary"
					placeholder="Leak repairs, pipe installs, drain clearing"
				/>
				{errors.description && (
					<p className="text-xs text-red-700">{errors.description.message}</p>
				)}
			</div>

			<div className="mt-2 flex items-center gap-3">
				<button
					type="submit"
					disabled={saveMutation.isPending}
					className="inline-flex items-center justify-center rounded-md bg-dispatch px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-60"
				>
					{saveMutation.isPending ?
						"Saving..."
					: category ?
						"Save changes"
					:	"Create category"}
				</button>
				<button
					type="button"
					onClick={onCancel}
					className="text-sm font-medium text-ink/60 hover:text-ink"
				>
					Cancel
				</button>
			</div>
		</form>
	);
}
