export function ServiceCardSkeleton() {
	return (
		<div className="flex flex-col overflow-hidden rounded-lg border border-ink/10 bg-paper shadow-sm">
			<div className="h-40 w-full animate-pulse bg-surface" />
			<div className="flex flex-1 flex-col gap-2 p-4">
				<div className="h-3 w-16 animate-pulse rounded bg-surface" />
				<div className="h-4 w-3/4 animate-pulse rounded bg-surface" />
				<div className="h-3 w-full animate-pulse rounded bg-surface" />
				<div className="h-3 w-2/3 animate-pulse rounded bg-surface" />
				<div className="mt-auto flex items-center justify-between pt-2">
					<div className="h-4 w-12 animate-pulse rounded bg-surface" />
					<div className="h-3 w-16 animate-pulse rounded bg-surface" />
				</div>
			</div>
		</div>
	);
}
