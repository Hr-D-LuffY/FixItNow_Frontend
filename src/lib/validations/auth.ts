import { z } from "zod";

export const registerSchema = z
	.object({
		name: z.string().min(2, "Name must be at least 2 characters"),
		email: z.string().email("Enter a valid email address"),
		phone: z
			.string()
			.min(7, "Enter a valid phone number")
			.regex(/^[0-9+\-\s()]+$/, "Phone number contains invalid characters"),
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string(),
		role: z.enum(["CUSTOMER", "TECHNICIAN"], {
			message: "Select a role",
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export type RegisterPayload = Omit<RegisterFormValues, "confirmPassword">;

export const loginSchema = z.object({
	email: z.string().email("Enter a valid email address"),
	password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
