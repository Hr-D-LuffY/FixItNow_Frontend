import { z } from "zod";

export const technicianProfileSchema = z.object({
	bio: z
		.string()
		.trim()
		.max(1000, "Bio must be 1000 characters or fewer")
		.optional()
		.or(z.literal("")),

	// Comma-separated in the UI; split into an array at the API boundary.
	skills: z
		.string()
		.trim()
		.max(300, "Skills list is too long — try trimming it down")
		.optional()
		.or(z.literal("")),

	// Native number inputs report their value as a string, so the input
	// side accepts string | number. We convert manually instead of using
	// z.coerce.number() here — coerce's input type is `unknown`, which
	// Zod v4 won't let you .pipe() a narrower type into.
	experienceYears: z
		.union([z.string(), z.number()])
		.optional()
		.transform((val, ctx) => {
			if (val === "" || val === undefined) return undefined;

			const num = typeof val === "string" ? Number(val) : val;

			if (Number.isNaN(num)) {
				ctx.addIssue({ code: "custom", message: "Enter a number" });
				return z.NEVER;
			}

			return num;
		})
		.pipe(
			z
				.number()
				.int("Must be a whole number")
				.min(0, "Can't be negative")
				.max(60, "That doesn't look right — double check the number")
				.optional(),
		),

	availability: z.boolean(),
});

// Shape of the raw form fields before Zod parses/coerces them.
export type TechnicianProfileFormInput = z.input<
	typeof technicianProfileSchema
>;

// Shape after Zod has validated and coerced — what you get in onSubmit.
export type TechnicianProfileFormOutput = z.output<
	typeof technicianProfileSchema
>;
