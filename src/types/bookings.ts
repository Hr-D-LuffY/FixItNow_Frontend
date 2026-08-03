import type { Paginated } from "@/lib/api";
import type { TechnicianProfile } from "./technician";

export type BookingStatus =
	| "REQUESTED"
	| "ACCEPTED"
	| "DECLINED"
	| "CANCELLED"
	| "PAID"
	| "IN_PROGRESS"
	| "COMPLETED";

export type BookingService = {
	id: string;
	categoryId: string;
	technicianId: string;
	title: string;
	description: string;
	price: number;
	createdAt: string;
	updatedAt: string;
};

export type BookingCustomer = {
	id: string;
	name: string;
	email: string;
};

export type Booking = {
	id: string;
	serviceId: string;
	technicianId: string;
	customerId: string;
	price: number;
	notes: string | null;
	status: BookingStatus;
	createdAt: string;
	updatedAt: string;
	service?: BookingService;
	customer?: BookingCustomer;
	technician?: TechnicianProfile;
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
	status: Extract<
		BookingStatus,
		"ACCEPTED" | "DECLINED" | "IN_PROGRESS" | "COMPLETED"
	>;
};

export type BookingStatusResponseData = BookingResponseData;
