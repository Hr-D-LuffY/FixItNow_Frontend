"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import type { PaymentSessionData } from "@/types/payments";

export function PayButton({ bookingId }: { bookingId: string }) {
	const [isLoading, setIsLoading] = useState(false);

	async function handlePay() {
		setIsLoading(true);
		try {
			const data = await api.post<PaymentSessionData>("/payments/sessions", {
				bookingId,
			});

			const url = data.checkoutSession?.url;
			if (!url) {
				toast.error("Couldn't start checkout — no payment URL was returned.");
				setIsLoading(false);
				return;
			}

			window.location.href = url;
		} catch (error) {
			toast.error(
				error instanceof ApiError ?
					error.message
				:	"Couldn't start checkout. Please try again.",
			);
			setIsLoading(false);
		}
	}

	return (
		<button
			type="button"
			onClick={handlePay}
			disabled={isLoading}
			className="inline-flex w-fit items-center justify-center rounded-md bg-dispatch px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
		>
			{isLoading ? "Redirecting to checkout…" : "Pay now"}
		</button>
	);
}
