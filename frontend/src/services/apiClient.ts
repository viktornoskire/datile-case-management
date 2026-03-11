import {ApiError} from "./apiError.ts";
import {buildQuery, type QueryValue} from "./buildQuery.ts";

/* Shared API client wrapper + standardized error handling. It builds correct URL´s, does fetch and converts to JSON */

const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").trim();
const baseUrl = rawBaseUrl.replace(/\/+$/, "");

// Build a correct url every time
const toUrl = (path: string) => {
    const p = path.startsWith("/") ? path : `/${path}`;
    return baseUrl ? `${baseUrl}${p}` : p;
};

// parseBody reads the answer from the server- a common parser for all endpoints to be interpreted correctly
const parseBody = async (res: Response) => {
    const contentType = res.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
        try {
            return await res.json();
        } catch {
            return null;
        }
    }

    const text = await res.text().catch(() => "");
    return text.length ? {raw: text} : null;
};

//Defines what is allowed, GET sends params, all other needs headers
type GetOptions = {
    params?: Record<string, QueryValue>;
    headers?: HeadersInit;
};

type RequestOptions = {
    headers?: HeadersInit;
};

// The heart of it all: this builds URL correctly, does fetch with right headers, interprets  parseBody and throws error if needed
const request = async <T>(
    path: string,
    init: RequestInit = {}
): Promise<T> => {
    const res = await fetch(toUrl(path), {
        ...init,
        credentials: "include",
        headers: {
            Accept: "application/json",
            ...(init.body ? {"Content-Type": "application/json"} : {}),
            ...(init.headers ?? {}),
        },
    });

    const body = await parseBody(res);

    if (!res.ok) {
        const msg =
            body && typeof body === "object" && "message" in body && typeof (body as any).message === "string"
                ? (body as any).message
                : `Request failed (${res.status})`;

        throw new ApiError(msg, res.status, body);
    }

    return body as T;
};

export const apiClient = {
    request,

    get: <T>(path: string, options?: GetOptions) => {
        const query = buildQuery(options?.params);
        return request<T>(`${path}${query}`, {
            method: "GET",
            headers: options?.headers,
        });
    },

    post: <T>(path: string, data: unknown, options?: RequestOptions) => {
        return request<T>(path, {
            method: "POST",
            body: JSON.stringify(data),
            headers: options?.headers,
        });
    },

    put: <T>(path: string, data: unknown, options?: RequestOptions) => {
        return request<T>(path, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: options?.headers,
        });
    },

    patch: <T>(path: string, data: unknown, options?: RequestOptions) => {
        return request<T>(path, {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: options?.headers,
        });
    },

    delete: <T>(path: string, options?: RequestOptions) => {
        return request<T>(path, {
            method: "DELETE",
            headers: options?.headers,
        });
    },
};