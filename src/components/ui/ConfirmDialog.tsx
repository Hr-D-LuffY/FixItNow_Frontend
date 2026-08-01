"use client";

import { useEffect } from "react";

type ConfirmDialogProps = {
	open: boolean;
	title: string;
	description?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	isLoading?: boolean;
	variant?: "default" | "danger";
	onConfirm: () => void;
	onCancel: () => void;
};

export function ConfirmDialog({
	open,
	title,
	description,
	confirmLabel = "Confirm",
	cancelLabel = "Cancel",
	isLoading = false,
	variant = "default",
	onConfirm,
	onCancel,
}: ConfirmDialogProps) {
	useEffect(() => {
		if (!open) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && !isLoading) onCancel();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [open, isLoading, onCancel]);

	if (!open) return null;

	const confirmClasses =
		variant === "danger" ?
			"bg-status-declined text-white hover:opacity-90"
		:	"bg-dispatch text-white hover:opacity-90";

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
			role="dialog"
			aria-modal="true"
			aria-labelledby="confirm-dialog-title"
			onClick={() => !isLoading && onCancel()}
		>
			<div
				className="ticket-divider w-full max-w-sm rounded-lg border border-ink/10 bg-paper p-6 pt-5 shadow-lg"
				onClick={(e) => e.stopPropagation()}
			>
				<h2 id="confirm-dialog-title" className="text-lg font-bold text-ink">
					{title}
				</h2>
				{description && (
					<p className="mt-2 text-sm text-ink/70">{description}</p>
				)}

				<div className="mt-6 flex justify-end gap-3">
					<button
						type="button"
						onClick={onCancel}
						disabled={isLoading}
						className="rounded-md border border-ink/15 px-4 py-2 text-sm font-medium text-ink transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-60"
					>
						{cancelLabel}
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={isLoading}
						className={`rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${confirmClasses}`}
					>
						{isLoading ? "Working…" : confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
}
