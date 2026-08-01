import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { TOKEN_COOKIE } from "@/lib/api";

type Role = "CUSTOMER" | "TECHNICIAN" | "ADMIN";

interface DecodedToken {
	role: Role;
	exp: number;
	[key: string]: unknown;
}

const ROLE_PREFIXES: Record<string, Role> = {
	"/dashboard/customer": "CUSTOMER",
	"/dashboard/technician": "TECHNICIAN",
	"/dashboard/admin": "ADMIN",
};

const HOME_BY_ROLE: Record<Role, string> = {
	CUSTOMER: "/dashboard/customer",
	TECHNICIAN: "/dashboard/technician",
	ADMIN: "/dashboard/admin",
};

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const matchedPrefix = Object.keys(ROLE_PREFIXES).find((prefix) =>
		pathname.startsWith(prefix),
	);

	if (!matchedPrefix) {
		return NextResponse.next();
	}

	const token = request.cookies.get(TOKEN_COOKIE)?.value;

	if (!token) {
		const loginUrl = new URL("/auth/login", request.url);
		loginUrl.searchParams.set("from", pathname);
		return NextResponse.redirect(loginUrl);
	}

	let decoded: DecodedToken;
	try {
		decoded = jwtDecode<DecodedToken>(token);
	} catch {
		const loginUrl = new URL("/auth/login", request.url);
		loginUrl.searchParams.set("from", pathname);
		return NextResponse.redirect(loginUrl);
	}

	const now = Math.floor(Date.now() / 1000);
	if (decoded.exp && decoded.exp < now) {
		const loginUrl = new URL("/auth/login", request.url);
		loginUrl.searchParams.set("from", pathname);
		return NextResponse.redirect(loginUrl);
	}

	const requiredRole = ROLE_PREFIXES[matchedPrefix];
	if (decoded.role !== requiredRole) {
		const ownHome = HOME_BY_ROLE[decoded.role] ?? "/";
		return NextResponse.redirect(new URL(ownHome, request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*"],
};
