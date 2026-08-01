"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Booking } from "@/types/bookings";

const CANCELLABLE_STATUSES: Booking["status"][] = ["REQUESTED", "ACCEPTED"];

export function CancelBookingButton({ booking }: { booking: Booking }) {
	const [confirmOpen, setConfirmOpen] = useState(false);
	const queryClient = useQueryClient();

	const cancelMutation = useMutation({
		mutationFn: () => api.patch(`/bookings/${booking.id}/cancel`),
		onSuccess: () => {
			toast.success("Booking cancelled.");
			queryClient.invalidateQueries({ queryKey: ["booking", booking.id] });
			queryClient.invalidateQueries({ queryKey: ["bookings"] });
			setConfirmOpen(false);
		},
		onError: (error) => {
			toast.error(
				error instanceof ApiError ?
					error.message
				:	"Couldn't cancel this booking. Please try again.",
			);
			setConfirmOpen(false);
		},
	});

	if (!CANCELLABLE_STATUSES.includes(booking.status)) {
		return null;
	}

	return (
		<>
			<button
				type="button"
				onClick={() => setConfirmOpen(true)}
				className="inline-flex w-fit items-center justify-center rounded-md border border-status-declined px-5 py-2.5 text-sm font-semibold text-status-declined transition hover:bg-status-declined-bg"
			>
				Cancel booking
			</button>

			<ConfirmDialog
				open={confirmOpen}
				title="Cancel this booking?"
				description="This can't be undone. The technician will be notified that you've withdrawn the request."
				confirmLabel="Cancel booking"
				cancelLabel="Keep booking"
				variant="danger"
				isLoading={cancelMutation.isPending}
				onConfirm={() => cancelMutation.mutate()}
				onCancel={() => setConfirmOpen(false)}
			/>
		</>
	);
}
