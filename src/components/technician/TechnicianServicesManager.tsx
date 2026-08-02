"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { ServiceForm } from "@/components/technician/ServiceForm";
import { ManagedServiceCard } from "@/components/technician/ManagedServiceCard";
import type { ServicesListData } from "@/types/services";

export function TechnicianServicesManager() {
	const { user, isAuthenticated, isHydrating } = useAuthStore();
	const [showCreateForm, setShowCreateForm] = useState(false);

	const servicesQuery = useQuery({
		queryKey: ["technician-services"],
		queryFn: async () => {
			const first = await api.get<ServicesListData>(
				"/services?limit=50&page=1",
			);
			const { totalPages } = first.pagination;

			if (totalPages <= 1) return first.services;

			const rest = await Promise.all(
				Array.from({ length: totalPages - 1 }, (_, i) =>
					api.get<ServicesListData>(`/services?limit=50&page=${i + 2}`),
				),
			);

			return [first.services, ...rest.map((r) => r.services)].flat();
		},
		enabled: isAuthenticated && user?.role === "TECHNICIAN",
	});

	if (isHydrating) {
		return <ServicesListSkeleton />;
	}

	if (!isAuthenticated) {
		return (
			<p className="text-sm text-ink/60">
				Sign in with a technician account to manage your services.
			</p>
		);
	}

	if (user?.role !== "TECHNICIAN") {
		return (
			<p className="text-sm text-ink/60">
				Only technician accounts can manage services here.
			</p>
		);
	}

	if (servicesQuery.isLoading) {
		return <ServicesListSkeleton />;
	}

	if (servicesQuery.isError || !servicesQuery.data) {
		return (
			<p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
				{servicesQuery.error instanceof Error ?
					servicesQuery.error.message
				:	"Couldn't load your services. The backend may be waking up from idle — try again in a moment."
				}
			</p>
		);
	}

	const myServices = (servicesQuery.data ?? []).filter(
	(service) => service.technician?.userId === user?.id,
);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<p className="text-sm text-ink/60">
					{myServices.length} {myServices.length === 1 ? "service" : "services"}
				</p>
				{!showCreateForm && (
					<button
						type="button"
						onClick={() => setShowCreateForm(true)}
						className="inline-flex items-center justify-center rounded-md bg-dispatch px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
					>
						Add service
					</button>
				)}
			</div>

			{showCreateForm && (
				<ServiceForm
					onSuccess={() => setShowCreateForm(false)}
					onCancel={() => setShowCreateForm(false)}
				/>
			)}

			{myServices.length === 0 && !showCreateForm && (
				<p className="text-sm text-ink/60">
					You haven&apos;t listed any services yet.
				</p>
			)}

			<div className="flex flex-col gap-4">
				{myServices.map((service) => (
					<ManagedServiceCard key={service.id} service={service} />
				))}
			</div>
		</div>
	);
}

function ServicesListSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			<div className="h-32 w-full animate-pulse rounded-lg bg-surface" />
			<div className="h-32 w-full animate-pulse rounded-lg bg-surface" />
		</div>
	);
}
