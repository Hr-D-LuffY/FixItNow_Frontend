"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { ServiceForm } from "@/components/technician/ServiceForm";
import type { Service } from "@/types/services";

export function ManagedServiceCard({ service }: { service: Service }) {
	const [isEditing, setIsEditing] = useState(false);
	const [confirmingDelete, setConfirmingDelete] = useState(false);
	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: () => api.delete(`/services/${service.id}`),
		onSuccess: () => {
			toast.success("Service deleted");
			queryClient.invalidateQueries({ queryKey: ["technician-services"] });
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ? error.message : "Couldn't delete this service",
			);
			setConfirmingDelete(false);
		},
	});

	if (isEditing) {
		return (
			<ServiceForm
				service={service}
				onSuccess={() => setIsEditing(false)}
				onCancel={() => setIsEditing(false)}
			/>
		);
	}

	return (
		<div className="ticket-divider flex flex-col gap-3 rounded-lg border border-ink/10 bg-surface p-6 pt-6">
			<div className="flex items-start justify-between gap-4">
				<div>
					<span className="text-xs font-medium uppercase tracking-wide text-primary">
						{service.category?.name ?? "Uncategorized"}
					</span>
					<h3 className="text-base font-semibold text-ink">{service.title}</h3>
				</div>
				<p className="font-mono text-lg font-semibold text-ink">
					${service.price.toFixed(2)}
				</p>
			</div>

			<p className="text-sm leading-relaxed text-ink/70">
				{service.description}
			</p>

			{confirmingDelete ?
				<div className="flex items-center gap-3 rounded-md border border-red-200 bg-red-50 p-3">
					<p className="text-sm text-red-700">Delete this service?</p>
					<button
						type="button"
						onClick={() => deleteMutation.mutate()}
						disabled={deleteMutation.isPending}
						className="text-sm font-semibold text-red-700 hover:underline disabled:opacity-60"
					>
						{deleteMutation.isPending ? "Deleting..." : "Confirm"}
					</button>
					<button
						type="button"
						onClick={() => setConfirmingDelete(false)}
						className="text-sm font-medium text-ink/60 hover:text-ink"
					>
						Cancel
					</button>
				</div>
			:	<div className="flex items-center gap-4">
					<button
						type="button"
						onClick={() => setIsEditing(true)}
						className="text-sm font-medium text-primary hover:underline"
					>
						Edit
					</button>
					<button
						type="button"
						onClick={() => setConfirmingDelete(true)}
						className="text-sm font-medium text-red-700 hover:underline"
					>
						Delete
					</button>
				</div>
			}
		</div>
	);
}
