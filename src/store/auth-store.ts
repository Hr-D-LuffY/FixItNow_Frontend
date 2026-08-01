import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { TOKEN_COOKIE } from "@/lib/api";
import type { AuthUser } from "@/types/auth";

interface AuthState {
	user: AuthUser | null;
	token: string | null;
	isAuthenticated: boolean;

	isHydrating: boolean;
	login: (user: AuthUser, token: string) => void;
	logout: () => void;
	setUser: (user: AuthUser | null) => void;
	setHydrating: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			token: null,
			isAuthenticated: false,
			isHydrating: true,

			login: (user, token) => {
				Cookies.set(TOKEN_COOKIE, token, { expires: 7 });
				set({ user, token, isAuthenticated: true, isHydrating: false });
			},

			logout: () => {
				Cookies.remove(TOKEN_COOKIE);
				set({
					user: null,
					token: null,
					isAuthenticated: false,
					isHydrating: false,
				});
			},

			setUser: (user) => set({ user, isAuthenticated: !!user }),

			setHydrating: (value) => set({ isHydrating: value }),
		}),
		{
			name: "fixitnow-auth", // localStorage key
			partialize: (state) => ({
				user: state.user,
				token: state.token,
				isAuthenticated: state.isAuthenticated,
			}),
		},
	),
);
