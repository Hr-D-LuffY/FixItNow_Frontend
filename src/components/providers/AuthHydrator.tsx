"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { api, TOKEN_COOKIE, type ApiError } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import type { AuthUser } from "@/types/auth";

export function AuthHydrator() {
	const setUser = useAuthStore((state) => state.setUser);
	const setHydrating = useAuthStore((state) => state.setHydrating);
	const logout = useAuthStore((state) => state.logout);

	useEffect(() => {
		const token = Cookies.get(TOKEN_COOKIE);

		if (!token) {
			logout();
			return;
		}

		api
			.get<AuthUser>("/auth/me")
			.then((user) => {
				setUser(user);
			})
			.catch((error: ApiError) => {
				if (error.status === 401) {
					logout();
				}
			})
			.finally(() => {
				setHydrating(false);
			});
	}, []);

	return null;
}
