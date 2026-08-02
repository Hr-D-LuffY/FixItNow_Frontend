import { z } from "zod";

export const serviceSchema = z.object({
	categoryId: z.string().min(1, "Select a category"),

	title: z
		.string()
		.trim()
		.min(1, "Title is required")
		.max(120, "Title is too long"),

	description: z
		.string()
		.trim()
		.min(1, "Description is required")
		.max(2000, "Description is too long"),

	price: z
		.union([z.string(), z.number()])
		.transform((val, ctx) => {
			const num = typeof val === "string" ? Number(val) : val;

			if (val === "" || Number.isNaN(num)) {
				ctx.addIssue({ code: "custom", message: "Enter a valid price" });
				return z.NEVER;
			}

			return num;
		})
		.pipe(z.number().min(0, "Price can't be negative")),
});

// Shape of the raw form fields before Zod parses/coerces them.
export type ServiceFormInput = z.input<typeof serviceSchema>;

// Shape after Zod has validated and coerced — what you get in onSubmit.
export type ServiceFormOutput = z.output<typeof serviceSchema>;
