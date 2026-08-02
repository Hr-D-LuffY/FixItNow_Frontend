"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Pagination } from "@/components/ui/Pagination";
import { UserRow } from "@/components/admin/UserRow";
import type { AdminUsersListData } from "@/types/admin";

const PAGE_LIMIT = 10;

export function AdminUsersManager() {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");

	const usersQuery = useQuery({
		queryKey: ["admin", "users", page],
		queryFn: () =>
			api.get<AdminUsersListData>(
				`/admin/users?page=${page}&limit=${PAGE_LIMIT}`,
			),
	});

	if (usersQuery.isLoading) {
		return <UsersSkeleton />;
	}

	if (usersQuery.isError || !usersQuery.data) {
		return (
			<p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
				{usersQuery.error instanceof Error ?
					usersQuery.error.message
				:	"Couldn't load users. The backend may be waking up from idle."}
			</p>
		);
	}

	const { users, pagination } = usersQuery.data;

	// No search query param exists on GET /admin/users (API_INTEGRATION.md
	// doesn't document one — same gap as /services). This filters only the
	// current page's results client-side, not the whole dataset. Disclosed
	// limitation, same posture as the category/price filters on /services.
	const filteredUsers =
		search.trim() === "" ?
			users
		:	users.filter(
				(u) =>
					u.name.toLowerCase().includes(search.toLowerCase()) ||
					u.email.toLowerCase().includes(search.toLowerCase()),
			);

	return (
		<div className="flex flex-col gap-4">
			<input
				type="text"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				placeholder="Search this page by name or email…"
				className="w-full max-w-sm rounded-md border border-ink/15 bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus:border-primary focus:outline-none"
			/>

			{filteredUsers.length === 0 ?
				<p className="rounded-md border border-ink/10 bg-surface p-6 text-sm text-ink/60">
					No users match this page&apos;s results.
				</p>
			:	<div className="overflow-hidden rounded-lg border border-ink/10">
					<table className="w-full text-left text-sm">
						<thead className="bg-surface text-xs uppercase tracking-wide text-ink/50">
							<tr>
								<th className="px-4 py-3 font-medium">Name</th>
								<th className="px-4 py-3 font-medium">Email</th>
								<th className="px-4 py-3 font-medium">Role</th>
								<th className="px-4 py-3 font-medium">Status</th>
								<th className="px-4 py-3 font-medium">Joined</th>
								<th className="px-4 py-3 font-medium">Action</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-ink/10">
							{filteredUsers.map((user) => (
								<UserRow key={user.id} user={user} />
							))}
						</tbody>
					</table>
				</div>
			}

			<Pagination
				page={pagination.page}
				totalPages={pagination.totalPages}
				onPageChange={setPage}
			/>
		</div>
	);
}

function UsersSkeleton() {
	return (
		<div className="flex flex-col gap-3">
			{Array.from({ length: 5 }).map((_, i) => (
				<div
					key={i}
					className="h-12 w-full animate-pulse rounded-md bg-surface"
				/>
			))}
		</div>
	);
}
