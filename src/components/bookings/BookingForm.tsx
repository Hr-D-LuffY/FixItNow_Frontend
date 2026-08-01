"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import {
	createBookingSchema,
	type CreateBookingFormValues,
} from "@/lib/validations/booking";
import type { BookingResponseData } from "@/types/bookings";

export function BookingForm({ serviceId }: { serviceId: string }) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateBookingFormValues>({
		resolver: zodResolver(createBookingSchema),
		defaultValues: { notes: "" },
	});

	const bookingMutation = useMutation({
		mutationFn: (values: CreateBookingFormValues) =>
			api.post<BookingResponseData>("/bookings", {
				serviceId,
				notes: values.notes?.trim() ? values.notes.trim() : undefined,
			}),
		onSuccess: () => {
			toast.success("Booking request sent! The technician will respond soon.");
			// Commit 11's booking-history query will use this same key —
			// invalidating now is a no-op until then, harmless either way.
			queryClient.invalidateQueries({ queryKey: ["bookings"] });
			router.push("/dashboard/customer");
		},
		onError: (error) => {
			toast.error(
				error instanceof ApiError ?
					error.message
				:	"Couldn't submit your booking. Please try again.",
			);
		},
	});

	return (
		<form
			onSubmit={handleSubmit((values) => bookingMutation.mutate(values))}
			className="mt-2 flex w-full flex-col gap-3 rounded-lg border border-ink/10 bg-surface p-4"
		>
			<label htmlFor="notes" className="text-sm font-medium text-ink">
				Notes for the technician{" "}
				<span className="font-normal text-ink/50">(optional)</span>
			</label>
			<textarea
				id="notes"
				rows={3}
				{...register("notes")}
				placeholder="e.g. leaking pipe under the kitchen sink, available weekday afternoons"
				className="rounded-md border border-ink/15 bg-paper p-3 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none"
			/>
			{errors.notes && (
				<p className="text-xs text-red-600">{errors.notes.message}</p>
			)}

			<button
				type="submit"
				disabled={bookingMutation.isPending}
				className="mt-1 inline-flex w-fit items-center justify-center rounded-md bg-dispatch px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
			>
				{bookingMutation.isPending ? "Submitting…" : "Submit booking request"}
			</button>
		</form>
	);
}
