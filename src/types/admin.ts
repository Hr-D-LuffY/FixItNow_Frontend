import type { Paginated } from "@/lib/api";

export type UserRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

export type UserStatus = "ACTIVE" | "BANNED";

export interface AdminUser {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	status: UserStatus; 
	createdAt: string; 
}

export type AdminUsersListData = Paginated<AdminUser, "users">;

export interface BanUserResponseData {
	user: AdminUser;
}

export interface AdminBookingStats {
	totalBookings: number;
	totalRevenue: number;
	totalUsers?: number;
	byStatus: Record<string, number>;
}

export type AdminStatsData = AdminBookingStats;
