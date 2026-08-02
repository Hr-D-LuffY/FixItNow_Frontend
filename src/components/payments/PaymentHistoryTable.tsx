"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Pagination } from "@/components/ui/Pagination";
import { PaymentStatusBadge } from "@/components/payments/PaymentStatusBadge";
import type { PaymentsListData } from "@/types/payments";

const PAGE_LIMIT = 10;

export function PaymentHistoryTable() {
	const [page, setPage] = useState(1);

	const paymentsQuery = useQuery({
		queryKey: ["payments", page],
		queryFn: () =>
			api.get<PaymentsListData>(`/payments?page=${page}&limit=${PAGE_LIMIT}`),
	});

	if (paymentsQuery.isLoading) {
		return <PaymentHistorySkeleton />;
	}

	if (paymentsQuery.isError || !paymentsQuery.data) {
		return (
			<p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
				{paymentsQuery.error instanceof Error ?
					paymentsQuery.error.message
				:	"Couldn't load your payment history. The backend may be waking up from idle."
				}
			</p>
		);
	}

	const { payments, pagination } = paymentsQuery.data;

	if (payments.length === 0) {
		return (
			<p className="rounded-md border border-ink/10 bg-surface p-6 text-sm text-ink/60">
				No payments yet. Once you pay for a booking, it&apos;ll show up here.
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="overflow-hidden rounded-lg border border-ink/10">
				<table className="w-full text-left text-sm">
					<thead className="bg-surface text-xs uppercase tracking-wide text-ink/50">
						<tr>
							<th className="px-4 py-3 font-medium">Date</th>
							<th className="px-4 py-3 font-medium">Amount</th>
							<th className="px-4 py-3 font-medium">Provider</th>
							<th className="px-4 py-3 font-medium">Status</th>
							<th className="px-4 py-3 font-medium">Booking</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-ink/10">
						{payments.map((payment) => (
							<tr key={payment.id}>
								<td className="px-4 py-3 text-ink/70">
									{new Date(payment.createdAt).toLocaleDateString()}
								</td>
								<td className="px-4 py-3 font-mono font-semibold text-ink">
									${payment.amount.toFixed(2)}
								</td>
								<td className="px-4 py-3 text-ink/70">{payment.provider}</td>
								<td className="px-4 py-3">
									<PaymentStatusBadge status={payment.status} />
								</td>
								<td className="px-4 py-3">
									<Link
										href={`/dashboard/customer/bookings/${payment.bookingId}`}
										className="font-medium text-primary hover:underline"
									>
										View booking →
									</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<Pagination
				page={pagination.page}
				totalPages={pagination.totalPages}
				onPageChange={setPage}
			/>
		</div>
	);
}

function PaymentHistorySkeleton() {
	return (
		<div className="flex flex-col gap-3">
			{Array.from({ length: 4 }).map((_, i) => (
				<div
					key={i}
					className="h-12 w-full animate-pulse rounded-md bg-surface"
				/>
			))}
		</div>
	);
}
