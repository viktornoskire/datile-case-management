import { apiClient } from "../services/apiClient";

// exports

export type CustomerListItem = {
    customerId: number;
    name: string;
    customerNumber: string;
};

export type CustomersResponse = {
    items: CustomerListItem[];
    pageNumber: number;
    totalPages: number;
    totalElements: number;
};

export type CreateCustomerRequest = {
    name: string;
    customerNumber: string;
};

export type UpdateCustomerRequest = {
    name: string;
    customerNumber: string;
};

type FetchCustomersParams = {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
    q?: string;
};

export const fetchCustomers = async (
    params: FetchCustomersParams = {},
): Promise<CustomersResponse> => {
    const searchParams = new URLSearchParams();

    searchParams.set("page", String(params.page ?? 0));
    searchParams.set("size", String(params.size ?? 10));
    searchParams.set("sortBy", params.sortBy ?? "name");
    searchParams.set("sortDir", params.sortDir ?? "asc");

    if (params.q && params.q.trim()) {
        searchParams.set("q", params.q.trim());
    }

    return apiClient.get<CustomersResponse>(`/api/customers?${searchParams.toString()}`);
};

// exported functions

export const createCustomer = async (
    data: CreateCustomerRequest,
): Promise<CustomerListItem> => {
    return apiClient.post<CustomerListItem>("/api/customers", data);
};

export const updateCustomer = async (
    customerId: number,
    data: UpdateCustomerRequest,
): Promise<CustomerListItem> => {
    return apiClient.put<CustomerListItem>(`/api/customers/${customerId}`, data);
};

export const deleteCustomer = async (customerId: number): Promise<void> => {
    return apiClient.delete<void>(`/api/customers/${customerId}`);
};

export type CustomerLookup = {
    customerId: number;
    name: string;
};

export const fetchCustomerLookups = async (): Promise<CustomerLookup[]> => {
    return apiClient.get<CustomerLookup[]>("/api/lookups/customers");
};