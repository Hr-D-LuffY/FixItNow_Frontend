export type UserRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

export interface AuthUser {
	id: string;
	name: string;
	email: string;
	phone: string;
	role: UserRole;
}

export interface AuthResponse {
	token: string;
	user: AuthUser;
}
