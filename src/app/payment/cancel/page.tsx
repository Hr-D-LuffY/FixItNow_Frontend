import { PaymentCancel } from "@/components/payments/PaymentCancel";

export default async function PaymentCancelPage({
	searchParams,
}: {
	searchParams: Promise<{ bookingId?: string }>;
}) {
	const { bookingId } = await searchParams;
	return <PaymentCancel bookingId={bookingId} />;
}
