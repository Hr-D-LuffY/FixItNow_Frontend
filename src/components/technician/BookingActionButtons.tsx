"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type {
	Booking,
	BookingStatusResponseData,
	UpdateBookingStatusInput,
} from "@/types/bookings";

export function BookingActionButtons({ booking }: { booking: Booking }) {
	const [confirmingDecline, setConfirmingDecline] = useState(false);
	const queryClient = useQueryClient();

	const statusMutation = useMutation({
		mutationFn: (status: UpdateBookingStatusInput["status"]) =>
			api.patch<BookingStatusResponseData>(`/bookings/${booking.id}/status`, {
				status,
			} satisfies UpdateBookingStatusInput),
		onSuccess: (_, status) => {
			toast.success(
				status === "ACCEPTED" ? "Booking accepted"
				: status === "DECLINED" ? "Booking declined"
				: "Booking marked complete",
			);
			queryClient.invalidateQueries({ queryKey: ["technician-bookings"] });
			setConfirmingDecline(false);
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ? error.message : "Couldn't update this booking",
			);
			setConfirmingDecline(false);
		},
	});

	if (booking.status === "REQUESTED") {
		if (confirmingDecline) {
			return (
				<div className="flex items-center gap-3 rounded-md border border-red-200 bg-red-50 p-3">
					<p className="text-sm text-red-700">Decline this request?</p>
					<button
						type="button"
						onClick={() => statusMutation.mutate("DECLINED")}
						disabled={statusMutation.isPending}
						className="text-sm font-semibold text-red-700 hover:underline disabled:opacity-60"
					>
						{statusMutation.isPending ? "Declining..." : "Confirm"}
					</button>
					<button
						type="button"
						onClick={() => setConfirmingDecline(false)}
						className="text-sm font-medium text-ink/60 hover:text-ink"
					>
						Cancel
					</button>
				</div>
			);
		}

		return (
			<div className="flex items-center gap-4">
				<button
					type="button"
					onClick={() => statusMutation.mutate("ACCEPTED")}
					disabled={statusMutation.isPending}
					className="inline-flex items-center justify-center rounded-md bg-dispatch px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-60"
				>
					{statusMutation.isPending ? "Accepting..." : "Accept"}
				</button>
				<button
					type="button"
					onClick={() => setConfirmingDecline(true)}
					className="text-sm font-medium text-red-700 hover:underline"
				>
					Decline
				</button>
			</div>
		);
	}

	if (booking.status === "ACCEPTED") {
		return (
			<button
				type="button"
				onClick={() => statusMutation.mutate("COMPLETED")}
				disabled={statusMutation.isPending}
				className="inline-flex items-center justify-center rounded-md bg-dispatch px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-60"
			>
				{statusMutation.isPending ? "Updating..." : "Mark complete"}
			</button>
		);
	}

	return null;
}
