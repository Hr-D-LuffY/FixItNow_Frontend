import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/types/services";

export function ServiceCard({ service }: { service: Service }) {
	return (
		<Link
			href={`/services/${service.id}`}
			className="group flex flex-col overflow-hidden rounded-lg border border-ink/10 bg-paper shadow-sm transition hover:shadow-md"
		>
			<div className="relative h-40 w-full bg-surface">
				{service.imageUrl ?
					<Image
						src={service.imageUrl}
						alt={service.title}
						fill
						sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
						className="object-cover"
					/>
				:	<div className="flex h-full w-full items-center justify-center text-3xl font-bold text-ink/20">
						{service.category?.name?.charAt(0)?.toUpperCase() ?? "?"}
					</div>
				}
			</div>

			<div className="flex flex-1 flex-col gap-2 p-4">
				<span className="text-xs font-medium uppercase tracking-wide text-primary">
					{service.category?.name ?? "Service"}
				</span>
				<h3 className="text-base font-semibold text-ink group-hover:text-primary">
					{service.title}
				</h3>
				<p className="line-clamp-2 text-sm text-ink/60">
					{service.description}
				</p>
				<div className="mt-auto flex items-center justify-between pt-2">
					<span className="font-mono text-sm font-semibold text-ink">
						${service.price.toFixed(2)}
					</span>
					{service.technician?.availability ?
						<span className="text-xs font-medium text-green-600">
							Available
						</span>
					:	<span className="text-xs font-medium text-ink/40">
							Not accepting jobs
						</span>
					}
				</div>
			</div>
		</Link>
	);
}
