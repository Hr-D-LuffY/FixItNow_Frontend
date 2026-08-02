"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { AdminUser, BanUserResponseData } from "@/types/admin";

export function UserRow({ user }: { user: AdminUser }) {
	const queryClient = useQueryClient();
	const [confirmOpen, setConfirmOpen] = useState(false);

	const isBanned = user.status === "BANNED";

	const banMutation = useMutation({
		mutationFn: () =>
			api.patch<BanUserResponseData>(`/admin/users/${user.id}/ban`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
			setConfirmOpen(false);
		},
	});

	const unbanMutation = useMutation({
		mutationFn: () =>
			api.patch<BanUserResponseData>(`/admin/users/${user.id}/unban`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
		},
	});

	return (
		<tr>
			<td className="px-4 py-3 text-ink">{user.name}</td>
			<td className="px-4 py-3 text-ink/70">{user.email}</td>
			<td className="px-4 py-3">
				<span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-ink/70">
					{user.role}
				</span>
			</td>
			<td className="px-4 py-3">
				{isBanned ?
					<span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
						Banned
					</span>
				:	<span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
						Active
					</span>
				}
			</td>
			<td className="px-4 py-3 font-mono text-xs text-ink/50">
				{new Date(user.createdAt).toLocaleDateString()}
			</td>
			<td className="px-4 py-3">
				{user.role === "ADMIN" ?
					<span className="text-xs text-ink/40">—</span>
				: isBanned ?
					<button
						type="button"
						onClick={() => unbanMutation.mutate()}
						disabled={unbanMutation.isPending}
						className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
					>
						{unbanMutation.isPending ? "Unbanning…" : "Unban"}
					</button>
				:	<>
						<button
							type="button"
							onClick={() => setConfirmOpen(true)}
							className="text-sm font-medium text-red-600 hover:underline"
						>
							Ban
						</button>
						<ConfirmDialog
							open={confirmOpen}
							title="Ban this user?"
							description={`${user.name} won't be able to log in or use the platform until unbanned.`}
							confirmLabel="Ban user"
							cancelLabel="Cancel"
							variant="danger"
							isLoading={banMutation.isPending}
							onConfirm={() => banMutation.mutate()}
							onCancel={() => setConfirmOpen(false)}
						/>
					</>
				}
			</td>
		</tr>
	);
}
