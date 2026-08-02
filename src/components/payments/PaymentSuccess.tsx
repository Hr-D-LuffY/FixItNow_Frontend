"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { PaymentStatusBadge } from "@/components/payments/PaymentStatusBadge";
import type { Payment, PaymentsListData } from "@/types/payments";

const MAX_POLL_ATTEMPTS = 8;
const POLL_INTERVAL_MS = 3000;

export function PaymentSuccess({ bookingId }: { bookingId?: string }) {
	const [attempts, setAttempts] = useState(0);

	const paymentsQuery = useQuery({
		queryKey: ["payments", "success-lookup"],
		queryFn: () => api.get<PaymentsListData>("/payments?page=1&limit=50"),
		enabled: !!bookingId,
		refetchInterval: POLL_INTERVAL_MS,
	});

	const payment: Payment | undefined = paymentsQuery.data?.payments.find(
		(p) => p.bookingId === bookingId,
	);
	const resolved = !!payment && payment.status !== "PENDING";
	const gaveUp = attempts >= MAX_POLL_ATTEMPTS && !resolved;

	useEffect(() => {
		if (bookingId && !resolved && !paymentsQuery.isFetching) {
			setAttempts((n) => n + 1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [paymentsQuery.dataUpdatedAt]);

	if (!bookingId) {
		return (
			<StatusShell
				heading="Payment complete"
				body="Your payment was processed. You can find the details in your payment history."
			>
				<Link
					href="/dashboard/customer/payments"
					className="text-sm font-medium text-primary hover:underline"
				>
					View payment history →
				</Link>
			</StatusShell>
		);
	}

	if (paymentsQuery.isLoading) {
		return (
			<StatusShell
				heading="Confirming your payment…"
				body="This should only take a moment."
			>
				<div className="mt-2 h-10 w-40 animate-pulse rounded-md bg-surface" />
			</StatusShell>
		);
	}

	if (paymentsQuery.isError) {
		return (
			<StatusShell
				heading="Payment received"
				body={
					paymentsQuery.error instanceof Error ?
						paymentsQuery.error.message
					:	"We couldn't confirm the status just now, but Stripe reported success. Check your payment history shortly."
				}
			>
				<Link
					href={`/dashboard/customer/bookings/${bookingId}`}
					className="text-sm font-medium text-primary hover:underline"
				>
					Back to booking →
				</Link>
			</StatusShell>
		);
	}

	if (!payment) {
		return (
			<StatusShell
				heading={gaveUp ? "Still processing" : "Confirming your payment…"}
				body={
					gaveUp ?
						"This is taking longer than usual. Your payment may still be processing on Stripe's side — check your payment history shortly."
					:	"Stripe confirmed your checkout. We're just waiting on the backend to record it."
				}
			>
				{!gaveUp && (
					<div className="mt-2 h-10 w-40 animate-pulse rounded-md bg-surface" />
				)}
				<Link
					href="/dashboard/customer/payments"
					className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
				>
					View payment history →
				</Link>
			</StatusShell>
		);
	}

	return (
		<StatusShell
			heading={
				payment.status === "SUCCEEDED" ?
					"Payment successful"
				:	"Payment failed"
			}
			body={
				payment.status === "SUCCEEDED" ?
					"Thanks — your technician has been notified."
				:	"Something went wrong processing this payment. You can try again from the booking."
			}
		>
			<div className="mt-2 flex flex-col items-center gap-3">
				<PaymentStatusBadge status={payment.status} />
				<p className="font-mono text-lg font-semibold text-ink">
					${payment.amount.toFixed(2)}
				</p>
				<Link
					href={`/dashboard/customer/bookings/${bookingId}`}
					className="text-sm font-medium text-primary hover:underline"
				>
					Back to booking →
				</Link>
			</div>
		</StatusShell>
	);
}

function StatusShell({
	heading,
	body,
	children,
}: {
	heading: string;
	body: string;
	children?: ReactNode;
}) {
	return (
		<main className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
			<h1 className="text-2xl font-bold text-ink">{heading}</h1>
			<p className="mt-2 text-sm text-ink/60">{body}</p>
			{children}
		</main>
	);
}