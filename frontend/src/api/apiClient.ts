import { ApiError } from "./apiError";

/* Shared API client wrapper + standardized error handling. It builds correct URL´s, does fetch and converts to JSON */

const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").trim();
const baseUrl = rawBaseUrl.replace(/\/+$/, "");

const toUrl = (path: string) => {
    const p = path.startsWith("/") ? path : `/${path}`;
    return baseUrl ? `${baseUrl}${p}` : p;
};

const parseBody = async (res: Response) => {
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) return res.json();
    const text = await res.text();
    return text.length ? text : null;
};

export const apiClient = {
    async request<T>(path: string, init: RequestInit = {}): Promise<T> {
        const res = await fetch(toUrl(path), {
            ...init,
            headers: {
                Accept: "application/json",
                ...(init.body ? { "Content-Type": "application/json" } : {}),
                ...(init.headers ?? {}),
            },
        });

        const body = await parseBody(res);

        if (!res.ok) {
            const msg =
                typeof body === "object" && body && "message" in (body as any)
                    ? String((body as any).message)
                    : `Request failed (${res.status})`;
            throw new ApiError(msg, res.status, body);
        }

        return body as T;
    },

    get<T>(path: string) {
        return this.request<T>(path, { method: "GET" });
    },

    post<T>(path: string, data: unknown) {
        return this.request<T>(path, { method: "POST", body: JSON.stringify(data) });
    },
};