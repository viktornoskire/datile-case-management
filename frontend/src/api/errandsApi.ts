import type {
    ErrandsResponse,
    ErrandDetails,
    CreateErrandRequest,
    CreateErrandResponse,
} from "../types/errands";
import {apiClient} from "../services/apiClient.ts";

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
    name: string | null;
};

export type AddPurchaseRequest = {
    itemName: string;
    quantity: number;
    purchasePrice: number;
    shippingCost: number;
    salePrice: number;
};

export type UpdatePurchaseRequest = {
    itemName: string;
    quantity: number;
    purchasePrice: number;
    shippingCost: number;
    salePrice: number;
};

export const fetchErrandById = (id: number) =>
    apiClient.get<ErrandDetails>(`/api/errands/${id}`);

export const fetchErrands = (params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
    status?: string;
    priority?: string;
    assigneeId?: string | number;
    customerId?: string | number;
    q?: string;
}) => {
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

    if (params.q?.trim()) {
        url.searchParams.set("q", params.q.trim());
    }

    return apiClient.get<ErrandsResponse>(url.pathname + url.search);
};

export const createErrand = (data: CreateErrandRequest) =>
    apiClient.post<CreateErrandResponse>("/api/errands", data);

export const updateErrand = (id: number, data: {
    title: string;
    description: string;
    statusId: number;
    priorityId: number;
    assigneeId: null | number;
    customerId: null | number;
    contactId: null | number;
    timeSpent: null | number;
    agreedPrice: null | number;
    createdAt: string | undefined
}) =>
    apiClient.put<ErrandDetails>(`/api/errands/${id}`, data);

export const addErrandHistoryEntry = (
    id: number,
    data: AddHistoryEntryRequest,
) => apiClient.post<ErrandDetails>(`/api/errands/${id}/history`, data);

export const addPurchase = (id: number, data: AddPurchaseRequest) =>
    apiClient.post(`/api/errands/${id}/purchases`, data);

export const updatePurchase = (
    purchaseId: number,
    payload: UpdatePurchaseRequest,
) => apiClient.put(`/api/purchases/${purchaseId}`, payload);

export const deletePurchase = (purchaseId: number) =>
    apiClient.delete(`/api/purchases/${purchaseId}`);