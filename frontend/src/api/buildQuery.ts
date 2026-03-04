export type QueryValue =
    | string
    | number
    | boolean
    | null
    | undefined
    | Array<string | number | boolean | null | undefined>;

export const buildQuery = (params?: Record<string, QueryValue>): string => {
    if (!params) return "";

    const parts: string[] = [];

    for (const [key, raw] of Object.entries(params)) {
        if (raw === undefined || raw === null) continue;

        // Arrays: comma-separated, filter out empty/null/undefined
        if (Array.isArray(raw)) {
            const cleaned = raw
                .filter((v) => v !== undefined && v !== null && `${v}`.trim() !== "")
                .map((v) => `${v}`);

            if (cleaned.length === 0) continue;

            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(cleaned.join(","))}`);
            continue;
        }

        // Strings: skip empty
        if (typeof raw === "string" && raw.trim() === "") continue;

        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(raw))}`);
    }

    return parts.length > 0 ? `?${parts.join("&")}` : "";
};