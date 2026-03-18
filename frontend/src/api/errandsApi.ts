import type {
    ErrandsResponse, ErrandDetails, CreateErrandRequest,
    CreateErrandResponse,
} from "../types/errands";

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

export type AddPurchaseRequest = {
    itemName: string;
    quantity: number;
    purchasePrice: number;
    shippingCost: number;
    salePrice: number;
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
    status?: string;
    priority?: string;
    assigneeId?: string | number;
    customerId?: string | number;
    q?: string;
}): Promise<ErrandsResponse> => {
    const url = new URL("/api/errands", window.location.origin);

    url.searchParams.set("page", String(params.page ?? 0));
    url.searchParams.set("size", String(params.size ?? 20));
    url.searchParams.set("sortBy", params.sortBy ?? "date");
    url.searchParams.set("sortDir", params.sortDir ?? "desc");

    if (params.status) {
        url.searchParams.set("status", String(params.status));
    }

    if (params.priority) {
        url.searchParams.set("priority", String(params.priority));
    }

    if (params.assigneeId !== undefined && params.assigneeId !== "") {
        url.searchParams.set("assigneeId", String(params.assigneeId));
    }

    if (params.customerId !== undefined && params.customerId !== "") {
        url.searchParams.set("customerId", String(params.customerId));
    }

    if (params.q && params.q.trim()) {
        url.searchParams.set("q", params.q.trim());
    }

    const res = await fetch(url.toString());

    if (!res.ok) {
        const body = await res.text();
        throw new Error(body || `Request failed (${res.status})`);
    }

    return res.json();
};

export const createErrand = async (
    data: CreateErrandRequest,
): Promise<CreateErrandResponse> => {
    const res = await fetch("/api/errands", {
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

export const addPurchase = async (
    id: number,
    data: AddPurchaseRequest,
) => {
    const res = await fetch(`/api/errands/${id}/purchases`, {
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
export type UpdatePurchaseRequest = {
    itemName: string;
    quantity: number;
    purchasePrice: number;
    shippingCost: number;
    salePrice: number;
};

export const updatePurchase = async (
    purchaseId: number,
    payload: UpdatePurchaseRequest,
) => {
    const response = await fetch(`/api/purchases/${purchaseId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const body = await response.text();
        throw new Error(body || `Request failed (${response.status})`);
    }

    return response.json();
};

export const deletePurchase = async (purchaseId: number): Promise<void> => {
    const res = await fetch(`/api/purchases/${purchaseId}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(body || `Request failed (${res.status})`);
    }
};