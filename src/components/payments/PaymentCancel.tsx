import Link from "next/link";

export function PaymentCancel({ bookingId }: { bookingId?: string }) {
	return (
		<main className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
			<h1 className="text-2xl font-bold text-ink">Payment cancelled</h1>
			<p className="mt-2 text-sm text-ink/60">
				No charge was made. You can try again any time from the booking detail
				page.
			</p>
			<Link
				href={
					bookingId ?
						`/dashboard/customer/bookings/${bookingId}`
					:	"/dashboard/customer"
				}
				className="mt-6 text-sm font-medium text-primary hover:underline"
			>
				← Back to {bookingId ? "booking" : "your bookings"}
			</Link>
		</main>
	);
}
