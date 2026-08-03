const STORAGE_KEY = "fixitnow_reviewed_bookings";

function readAll(): string[] {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as string[]) : [];
	} catch {
		return [];
	}
}

export function isBookingReviewed(bookingId: string): boolean {
	return readAll().includes(bookingId);
}

export function markBookingReviewed(bookingId: string): void {
	if (typeof window === "undefined") return;
	const current = readAll();
	if (!current.includes(bookingId)) {
		window.localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify([...current, bookingId]),
		);
	}
}
