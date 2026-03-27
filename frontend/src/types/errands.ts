export type CreateErrandPurchaseRequest = {
    itemName: string;
    quantity: number;
    purchasePrice: number;
    shippingCost: number;
    salePrice: number;
};

export type CreateErrandRequest = {
    title: string;
    description: string;
    customerId: number;
    contactId: number;
    assigneeId: number;
    statusId: number;
    priorityId: number;
    timeSpent: number;
    agreedPrice: number;
    purchases: CreateErrandPurchaseRequest[];
};

export type CreateErrandResponse = {
    errandId: number;
    createdAt: string;
    title: string;
    assignee: ErrandAssignee | null;
    customer: ErrandCustomer | null;
    contact: ErrandContact | null;
};

export type AddErrandHistoryRequest = {
    description: string;
};


export type ErrandsResponse = {
    errands: ErrandListItem[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
};

export type ErrandHistoryItem = {
    description: string;
    historyId: number;
    verifiedName: string;
    createdAt: string;
};

export type ErrandStatus = {
    statusId: number;
    name: string;
};

export type ErrandPriority = {
    priorityId: number;
    name: string;
    color: string;
    isDefault: boolean;
};

export type ErrandAssignee = {
    assigneeId: number;
    name: string;
};

export type ErrandCustomer = {
    customerId: number;
    name: string;
    isActive: boolean;
};

export type ErrandContact = {
    customerId: number;
    contactId: number;
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
    mail: string | null;
};

export type ErrandListItem = {
    errandId: number;
    createdAt: string;
    title: string;
    description: string | null;
    status: ErrandStatus;
    priority: ErrandPriority;
    historyPreview: ErrandHistoryItem[];
    assignee: ErrandAssignee | null;
    customer: ErrandCustomer | null;
    contact: ErrandContact | null;
};

export type ErrandDetails = {
    errandId: number;
    createdAt: string;
    title: string;
    description: string | null;
    status: ErrandStatus;
    priority: ErrandPriority;
    history: ErrandHistoryItem[];
    purchases: ErrandPurchase[];
    assignee: ErrandAssignee | null;
    customer: ErrandCustomer | null;
    contact: ErrandContact | null;
    timeSpent: number | null;
    agreedPrice: number | null;
};

export type ErrandPurchase = {
    purchaseId: number;
    itemName: string;
    quantity: number;
    purchasePrice: number;
    shippingCost: number;
    salePrice: number;
    totalPurchaseCost: number;
    totalSaleValue: number;
    profit: number;
};

export type ErrandFilters = {
    sortBy: string;
    statuses: string[];
    priorities: string[];
    assigneeId: string;
    customerId: string;
    q: string;
    page: number;
    size: number;
};

export const initialErrandFilters: ErrandFilters = {
    sortBy: "date",
    statuses: [],
    priorities: [],
    assigneeId: "",
    customerId: "",
    q: "",
    page: 0,
    size: 20,
};

const ERRAND_FILTERS_STORAGE_KEY = "datile:errand-filters";

const allowedErrandSortValues = ["date", "title", "timeSpent"] as const;

export const errandStatusOptions = [
    { label: "Nytt", value: "Nytt" },
    { label: "Pågående", value: "Pågående" },
    { label: "Väntar", value: "Väntar" },
    { label: "Beställt", value: "Beställt" },
    { label: "Planerat", value: "Planerat" },
    { label: "Väntar på fakturering", value: "Väntar på fakturering" },
    { label: "Klar ej fakt.", value: "Klar ej fakt." },
    { label: "Stängt", value: "Stängt" },
    { label: "Bevakning", value: "Bevakning" },
];

export const errandPriorityOptions = [
    { label: "PANIK", value: "PANIK HÖG" },
    { label: "Hög", value: "HÖG" },
    { label: "Normal", value: "Normal" },
    { label: "Låg", value: "Låg" },
    { label: "Bevakning", value: "BEVAKNING" },
];

const isValidErrandSortBy = (value: unknown): value is ErrandFilters["sortBy"] => {
    return (
        typeof value === "string" &&
        allowedErrandSortValues.includes(value as (typeof allowedErrandSortValues)[number])
    );
};

const isValidString = (value: unknown): value is string => {
    return typeof value === "string";
};

const isValidStringArray = (value: unknown): value is string[] => {
    return Array.isArray(value) && value.every((item) => typeof item === "string");
};

export const sanitizeStoredErrandFilters = (value: unknown): ErrandFilters => {
    const fallback = initialErrandFilters;

    if (!value || typeof value !== "object") {
        return fallback;
    }

    const raw = value as Partial<ErrandFilters>;

    return {
        sortBy: isValidErrandSortBy(raw.sortBy) ? raw.sortBy : fallback.sortBy,
        statuses: isValidStringArray(raw.statuses) ? raw.statuses : [],
        priorities: isValidStringArray(raw.priorities) ? raw.priorities : [],
        assigneeId: isValidString(raw.assigneeId) ? raw.assigneeId : "",
        customerId: isValidString(raw.customerId) ? raw.customerId : "",
        q: isValidString(raw.q) ? raw.q : "",
        page:
            typeof raw.page === "number" && Number.isInteger(raw.page) && raw.page >= 0
                ? raw.page
                : fallback.page,
        size:
            typeof raw.size === "number" && Number.isInteger(raw.size) && raw.size > 0
                ? raw.size
                : fallback.size,
    };
};

export const loadSavedErrandFilters = (): ErrandFilters => {
    try {
        const raw = localStorage.getItem(ERRAND_FILTERS_STORAGE_KEY);

        if (!raw) {
            return initialErrandFilters;
        }

        return sanitizeStoredErrandFilters(JSON.parse(raw));
    } catch {
        return initialErrandFilters;
    }
};

export const saveErrandFilters = (filters: ErrandFilters) => {
    try {
        localStorage.setItem(ERRAND_FILTERS_STORAGE_KEY, JSON.stringify(filters));
    } catch {
        // ignore storage errors
    }
};

export const clearSavedErrandFilters = () => {
    try {
        localStorage.removeItem(ERRAND_FILTERS_STORAGE_KEY);
    } catch {
        // ignore storage errors
    }
};

export const buildErrandFilterParams = (filters: ErrandFilters) => {
    const params: Record<string, string | number> = {};

    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.statuses.length > 0) params.status = filters.statuses.join(",");
    if (filters.priorities.length > 0) params.priority = filters.priorities.join(",");
    if (filters.assigneeId) params.assigneeId = filters.assigneeId;
    if (filters.customerId) params.customerId = filters.customerId;
    if (filters.q.trim()) params.q = filters.q.trim();
    params.page = filters.page;
    params.size = filters.size;

    return params;
};