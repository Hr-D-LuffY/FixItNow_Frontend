import { z } from "zod";

export const createReviewSchema = z.object({
	rating: z
		.number({ message: "Please select a rating" })
		.int()
		.min(1, "Rating must be between 1 and 5")
		.max(5, "Rating must be between 1 and 5"),
	comment: z
		.string()
		.trim()
		.min(1, "Please add a short comment")
		.max(1000, "Comment must be 1000 characters or fewer"),
});

export type CreateReviewFormValues = z.infer<typeof createReviewSchema>;
