import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const TOKEN_COOKIE = "fixitnow_token";

if (!API_URL) {
	// Fail loudly in dev rather than silently hitting a relative path.
	console.warn(
		"NEXT_PUBLIC_API_URL is not set — check your .env.local against .env.example",
	);
}

export interface ApiEnvelope<T> {
	success: boolean;
	message: string;
	data: T | null;
}

export interface Paginated<T, Key extends string> {
	pagination: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

export class ApiError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
}

interface RequestOptions extends Omit<RequestInit, "body"> {
	body?: unknown; // pass a plain object; we JSON.stringify it
	skipAuth?: boolean; // for public endpoints — don't attach the token
}

export async function apiFetch<T>(
	path: string,
	options: RequestOptions = {},
): Promise<T> {
	const { body, skipAuth, headers, ...rest } = options;

	const finalHeaders: Record<string, string> = {
		"Content-Type": "application/json",
		...(headers as Record<string, string>),
	};

	if (!skipAuth) {
		const token = Cookies.get(TOKEN_COOKIE);
		if (token) {
			finalHeaders.Authorization = `Bearer ${token}`;
		}
	}

	let response: Response;
	try {
		response = await fetch(`${API_URL}${path}`, {
			...rest,
			headers: finalHeaders,
			body: body !== undefined ? JSON.stringify(body) : undefined,
		});
	} catch {
		throw new ApiError(
			"Could not reach the server. It may be waking up from idle — please try again in a moment.",
			0,
		);
	}

	let envelope: ApiEnvelope<T> | null = null;
	const text = await response.text();
	if (text) {
		try {
			envelope = JSON.parse(text) as ApiEnvelope<T>;
		} catch {
			throw new ApiError(
				"Received an unexpected response from the server.",
				response.status,
			);
		}
	}

	if (response.status === 401) {
		Cookies.remove(TOKEN_COOKIE);
		if (typeof window !== "undefined") {
			window.location.href = "/auth/login";
		}
		throw new ApiError(envelope?.message ?? "Session expired.", 401);
	}

	if (!response.ok || envelope?.success === false) {
		throw new ApiError(
			envelope?.message ?? `Request failed with status ${response.status}`,
			response.status,
		);
	}

	return (envelope?.data as T) ?? (undefined as T);
}

// Convenience helpers — thin wrappers over apiFetch for common verbs.
export const api = {
	get: <T>(path: string, options?: RequestOptions) =>
		apiFetch<T>(path, { ...options, method: "GET" }),

	post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
		apiFetch<T>(path, { ...options, method: "POST", body }),

	patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
		apiFetch<T>(path, { ...options, method: "PATCH", body }),

	delete: <T>(path: string, options?: RequestOptions) =>
		apiFetch<T>(path, { ...options, method: "DELETE" }),
};
