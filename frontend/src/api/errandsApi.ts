import type { ErrandsResponse, ErrandDetails } from "../types/errands";

export type UpdateErrandRequest = {
    title: string;
    description: string;
    statusId: number;
    priorityId: number;
    assigneeId: number | null;
    customerId: number | null;
    contactId: number | null;
    timeSpent: number | null;
    agreedPrice: number | null;
};

export type AddHistoryEntryRequest = {
    description: string;
};

export const fetchErrandById = async (id: number): Promise<ErrandDetails> => {
    const res = await fetch(`/api/errands/${id}`);

    if (!res.ok) {
        const body = await res.text();
        throw new Error(body || `Request failed (${res.status})`);
    }

    return res.json();
};

export const fetchErrands = async (params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
    statusIds?: number[];
}): Promise<ErrandsResponse> => {
    const url = new URL("/api/errands", window.location.origin);

    url.searchParams.set("page", String(params.page ?? 0));
    url.searchParams.set("size", String(params.size ?? 20));
    url.searchParams.set("sortBy", params.sortBy ?? "date");
    url.searchParams.set("sortDir", params.sortDir ?? "desc");

    if (params.statusIds?.length) {
        url.searchParams.set("statusIds", params.statusIds.join(","));
    }

    const res = await fetch(url.toString());

    if (!res.ok) {
        const body = await res.text();
        throw new Error(body || `Request failed (${res.status})`);
    }

    return res.json();
};

export const updateErrand = async (
    id: number,
    data: UpdateErrandRequest,
): Promise<ErrandDetails> => {
    const res = await fetch(`/api/errands/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(body || `Request failed (${res.status})`);
    }

    return res.json();
};

export const addErrandHistoryEntry = async (
    id: number,
    data: AddHistoryEntryRequest,
): Promise<ErrandDetails> => {
    const res = await fetch(`/api/errands/${id}/history`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(body || `Request failed (${res.status})`);
    }

    return res.json();
};