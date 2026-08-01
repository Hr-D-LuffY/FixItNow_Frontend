"use client";

export function Pagination({
	page,
	totalPages,
	onPageChange,
}: {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}) {
	if (totalPages <= 1) return null;

	return (
		<div className="mt-8 flex items-center justify-center gap-4">
			<button
				type="button"
				onClick={() => onPageChange(page - 1)}
				disabled={page <= 1}
				className="rounded-md border border-ink/15 px-4 py-2 text-sm font-medium text-ink transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
			>
				Previous
			</button>
			<span className="font-mono text-sm text-ink/60">
				Page {page} of {totalPages}
			</span>
			<button
				type="button"
				onClick={() => onPageChange(page + 1)}
				disabled={page >= totalPages}
				className="rounded-md border border-ink/15 px-4 py-2 text-sm font-medium text-ink transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
			>
				Next
			</button>
		</div>
	);
}
