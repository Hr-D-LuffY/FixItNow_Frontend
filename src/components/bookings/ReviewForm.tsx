"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import {
	createReviewSchema,
	type CreateReviewFormValues,
} from "@/lib/validations/review";
import type { ReviewResponseData } from "@/types/reviews";
import {
	isBookingReviewed,
	markBookingReviewed,
} from "@/lib/reviewed-bookings";

export function ReviewForm({ bookingId }: { bookingId: string }) {
	const [submitted, setSubmitted] = useState(() =>
		isBookingReviewed(bookingId),
	);

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateReviewFormValues>({
		resolver: zodResolver(createReviewSchema),
		defaultValues: { rating: 0, comment: "" },
	});

	const reviewMutation = useMutation({
		mutationFn: (values: CreateReviewFormValues) =>
			api.post<ReviewResponseData>("/reviews", {
				bookingId,
				rating: values.rating,
				comment: values.comment,
			}),
		onSuccess: () => {
			toast.success("Thanks for your review!");
			markBookingReviewed(bookingId);
			setSubmitted(true);
		},
		onError: (error) => {
			toast.error(
				error instanceof ApiError ?
					error.message
				:	"Couldn't submit your review. Please try again.",
			);
		},
	});

	if (submitted) {
		return (
			<p className="rounded-md border border-status-completed/30 bg-status-completed-bg p-4 text-sm text-status-completed">
				Your review has been submitted. Thanks for the feedback!
			</p>
		);
	}

	return (
		<form
			onSubmit={handleSubmit((values) => reviewMutation.mutate(values))}
			className="flex flex-col gap-3 rounded-lg border border-ink/10 bg-surface p-4"
		>
			<span className="text-sm font-medium text-ink">Your rating</span>
			<Controller
				control={control}
				name="rating"
				render={({ field }) => (
					<div className="flex gap-2" role="radiogroup" aria-label="Rating">
						{[1, 2, 3, 4, 5].map((value) => (
							<button
								key={value}
								type="button"
								role="radio"
								aria-checked={field.value === value}
								onClick={() => field.onChange(value)}
								className={`h-9 w-9 rounded-md border text-sm font-semibold transition ${
									field.value >= value ?
										"border-dispatch bg-dispatch text-white"
									:	"border-ink/15 text-ink/50 hover:border-ink/30"
								}`}
							>
								{value}
							</button>
						))}
					</div>
				)}
			/>
			{errors.rating && (
				<p className="text-xs text-red-600">{errors.rating.message}</p>
			)}

			<label htmlFor="comment" className="text-sm font-medium text-ink">
				Comment
			</label>
			<textarea
				id="comment"
				rows={3}
				{...register("comment")}
				placeholder="How did it go?"
				className="rounded-md border border-ink/15 bg-paper p-3 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none"
			/>
			{errors.comment && (
				<p className="text-xs text-red-600">{errors.comment.message}</p>
			)}

			<button
				type="submit"
				disabled={reviewMutation.isPending}
				className="mt-1 inline-flex w-fit items-center justify-center rounded-md bg-dispatch px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
			>
				{reviewMutation.isPending ? "Submitting…" : "Submit review"}
			</button>
		</form>
	);
}
