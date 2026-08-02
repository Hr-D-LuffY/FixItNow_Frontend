import type { Paginated } from "@/lib/api";

export type PaymentProvider = "STRIPE";
export type PaymentStatus = "PENDING" | "SUCCEEDED" | "FAILED";

export type Payment = {
	id: string;
	bookingId: string;
	provider: PaymentProvider;
	status: PaymentStatus;
	amount: number;
	createdAt: string;
	updatedAt: string;
};

export type CreatePaymentSessionInput = {
	bookingId: string;
};

export type PaymentSessionData = {
	checkoutSession: {
		id: string;
		url: string;
	};
};

export type PaymentsListData = Paginated<Payment, "payments">;
