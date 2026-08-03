import type { Paginated } from "@/lib/api";

export type BookingStatus =
	| "REQUESTED"
	| "ACCEPTED"
	| "DECLINED"
	| "CANCELLED"
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

export type BookingTechnician = {
	id: string;
	userId: string;
	bio: string | null;
	experienceYears: number | null;
	skills: string[];
	availability: boolean;
};

export type Booking = {
	id: string;
	customerId: string;
	technicianId: string;
	serviceId: string;
	status: BookingStatus;
	price: number;
	notes: string | null;
	createdAt: string;
	updatedAt: string;
	service?: BookingService;
	customer?: BookingCustomer;
	technician?: BookingTechnician;
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
