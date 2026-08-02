import type { Paginated } from "@/lib/api";
import type { Service } from "./services";

export type BookingStatus =
	| "REQUESTED"
	| "ACCEPTED"
	| "DECLINED"
	| "CANCELLED"
	| "COMPLETED";

export type Booking = {
	id: string;
	serviceId: string;
	service?: Service;
	customerId: string;
	notes: string | null;
	status: BookingStatus;
	createdAt: string;
	updatedAt: string;
};

export type CreateBookingInput = {
	serviceId: string;
	notes?: string;
};

export type BookingsListData = Paginated<Booking, "bookings">;

export type BookingResponseData = {
	booking: Booking;
};

export type BookingDetailData = BookingResponseData;

export type UpdateBookingStatusInput = {
	status: Extract<BookingStatus, "ACCEPTED" | "DECLINED" | "COMPLETED">;
};

export type BookingStatusResponseData = BookingResponseData;
