import { z } from "zod";

export const createBookingSchema = z.object({
	notes: z
		.string()
		.trim()
		.max(500, "Notes must be 500 characters or fewer")
		.optional()
		.or(z.literal("")),
});

export type CreateBookingFormValues = z.infer<typeof createBookingSchema>;
