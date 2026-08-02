import { PaymentSuccess } from "@/components/payments/PaymentSuccess";

export default async function PaymentSuccessPage({
	searchParams,
}: {
	searchParams: Promise<{ bookingId?: string }>;
}) {
	const { bookingId } = await searchParams;
	return <PaymentSuccess bookingId={bookingId} />;
}
