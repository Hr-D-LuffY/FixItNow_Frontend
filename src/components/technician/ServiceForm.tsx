"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
	serviceSchema,
	type ServiceFormInput,
	type ServiceFormOutput,
} from "@/lib/validations/service";
import type {
	CategoriesListData,
	CreateServiceInput,
	Service,
	ServiceResponseData,
	UpdateServiceInput,
} from "@/types/services";

type ServiceFormProps = {
	service?: Service; // present → edit mode, absent → create mode
	onSuccess: () => void;
	onCancel: () => void;
};

export function ServiceForm({
	service,
	onSuccess,
	onCancel,
}: ServiceFormProps) {
	const queryClient = useQueryClient();

	const categoriesQuery = useQuery({
		queryKey: ["categories"],
		queryFn: () => api.get<CategoriesListData>("/categories"),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ServiceFormInput, unknown, ServiceFormOutput>({
		resolver: zodResolver(serviceSchema),
		defaultValues: {
			categoryId: service?.categoryId ?? "",
			title: service?.title ?? "",
			description: service?.description ?? "",
			price: service?.price,
		},
	});

	const saveMutation = useMutation({
		mutationFn: (values: ServiceFormOutput) => {
			if (service) {
				const body: UpdateServiceInput = values;
				return api.patch<ServiceResponseData>(`/services/${service.id}`, body);
			}

			const body: CreateServiceInput = values;
			return api.post<ServiceResponseData>("/services", body);
		},
		onSuccess: () => {
			toast.success(service ? "Service updated" : "Service created");
			queryClient.invalidateQueries({ queryKey: ["technician-services"] });
			onSuccess();
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ? error.message : "Couldn't save this service",
			);
		},
	});

	return (
		<form
			onSubmit={handleSubmit((values) => saveMutation.mutate(values))}
			className="flex flex-col gap-4 rounded-lg border border-ink/10 bg-surface p-6"
		>
			<div className="flex flex-col gap-1.5">
				<label htmlFor="title" className="text-sm font-medium text-ink">
					Title
				</label>
				<input
					id="title"
					type="text"
					{...register("title")}
					className="rounded-md border border-ink/15 bg-paper px-3 py-2 text-sm text-ink outline-none focus-visible:border-primary"
					placeholder="Emergency drain unclogging"
				/>
				{errors.title && (
					<p className="text-xs text-red-700">{errors.title.message}</p>
				)}
			</div>

			<div className="flex flex-col gap-1.5">
				<label htmlFor="categoryId" className="text-sm font-medium text-ink">
					Category
				</label>
				<select
					id="categoryId"
					{...register("categoryId")}
					disabled={categoriesQuery.isLoading}
					className="rounded-md border border-ink/15 bg-paper px-3 py-2 text-sm text-ink outline-none focus-visible:border-primary"
				>
					<option value="">
						{categoriesQuery.isLoading ?
							"Loading categories..."
						:	"Select a category"}
					</option>
					{categoriesQuery.data?.categories.map((category) => (
						<option key={category.id} value={category.id}>
							{category.name}
						</option>
					))}
				</select>
				{errors.categoryId && (
					<p className="text-xs text-red-700">{errors.categoryId.message}</p>
				)}
				{categoriesQuery.isError && (
					<p className="text-xs text-red-700">
						Couldn&apos;t load categories — try reopening this form.
					</p>
				)}
			</div>

			<div className="flex flex-col gap-1.5">
				<label htmlFor="description" className="text-sm font-medium text-ink">
					Description
				</label>
				<textarea
					id="description"
					rows={4}
					{...register("description")}
					className="rounded-md border border-ink/15 bg-paper px-3 py-2 text-sm text-ink outline-none focus-visible:border-primary"
					placeholder="What's included, typical turnaround, anything customers should know"
				/>
				{errors.description && (
					<p className="text-xs text-red-700">{errors.description.message}</p>
				)}
			</div>

			<div className="flex flex-col gap-1.5">
				<label htmlFor="price" className="text-sm font-medium text-ink">
					Price
				</label>
				<input
					id="price"
					type="number"
					step="0.01"
					min={0}
					{...register("price")}
					className="w-40 rounded-md border border-ink/15 bg-paper px-3 py-2 font-mono text-sm text-ink outline-none focus-visible:border-primary"
				/>
				{errors.price && (
					<p className="text-xs text-red-700">{errors.price.message}</p>
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
					: service ?
						"Save changes"
					:	"Create service"}
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
