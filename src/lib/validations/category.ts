import { z } from "zod";

export const categorySchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Name must be at least 2 characters")
		.max(60, "Name must be 60 characters or fewer"),

	description: z
		.string()
		.trim()
		.max(500, "Description must be 500 characters or fewer")
		.optional()
		.or(z.literal("")),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
