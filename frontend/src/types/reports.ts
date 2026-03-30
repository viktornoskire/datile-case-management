export type ReportSortBy =
    | "customer"
    | "contact"
    | "title"
    | "status"
    | "priority"
    | "assignee"
    | "timeSpent";

export type ReportCustomer = {
    customerId: number;
    name: string;
};

export type ReportContact = {
    contactId: number;
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
    mail: string | null;
};

export type ReportStatus = {
    statusId: number;
    name: string;
};

export type ReportPriority = {
    priorityId: number;
    name: string;
    color: string;
};

export type ReportAssignee = {
    assigneeId: number;
    name: string;
};

export type ReportPurchase = {
    purchaseId: number;
    itemName: string;
    quantity: number;
    salePrice: number;
};

export type ReportListItem = {
    errandId: number;
    createdAt: string;
    title: string;
    customer: ReportCustomer | null;
    contact: ReportContact | null;
    status: ReportStatus | null;
    priority: ReportPriority | null;
    timeSpent: number | null;
    assignee: ReportAssignee | null;
    purchases: ReportPurchase[];
    agreedPrice: number;
};

export type ReportsResponse = {
    reports: ReportListItem[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
};

export type ReportFilters = {
    dateFrom: string;
    dateTo: string;
    customerId?: number;
    assigneeId?: number;
    statusIds: number[];
    priorityIds: number[];
    sortBy: ReportSortBy;
    page: number;
    size: number;
};

const REPORT_FILTERS_STORAGE_KEY = "datile:report-filters";

const allowedSortValues: ReportSortBy[] = [
    "customer",
    "contact",
    "title",
    "status",
    "priority",
    "assignee",
    "timeSpent",
];

export const reportSortOptions: Array<{ value: ReportSortBy; label: string }> = [
    {value: "customer", label: "Kund"},
    {value: "contact", label: "Namn"},
    {value: "title", label: "Rubrik"},
    {value: "status", label: "Status"},
    {value: "priority", label: "Prioritet"},
    {value: "timeSpent", label: "Tidsåtgång"},
    {value: "assignee", label: "Ansvarig"},
];

const toDateInputValue = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");

    return `${year}-${month}-${day}`;
};

export const createInitialReportFilters = (): ReportFilters => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return {
        dateFrom: toDateInputValue(firstDayOfMonth),
        dateTo: toDateInputValue(today),
        statusIds: [],
        priorityIds: [],
        sortBy: "customer",
        page: 0,
        size: 20,
    };
};

const isValidSortBy = (value: unknown): value is ReportSortBy => {
    return typeof value === "string" && allowedSortValues.includes(value as ReportSortBy);
};

const isValidNumber = (value: unknown): value is number => {
    return typeof value === "number" && Number.isFinite(value);
};

const isValidNumberArray = (value: unknown): value is number[] => {
    return Array.isArray(value) && value.every((item) => isValidNumber(item));
};

const isValidDateString = (value: unknown): value is string => {
    if (typeof value !== "string") {
        return false;
    }

    return /^\d{4}-\d{2}-\d{2}$/.test(value);
};

export const sanitizeStoredReportFilters = (value: unknown): ReportFilters => {
    const fallback = createInitialReportFilters();

    if (!value || typeof value !== "object") {
        return fallback;
    }

    const raw = value as Partial<ReportFilters>;

    return {
        dateFrom: isValidDateString(raw.dateFrom) ? raw.dateFrom : fallback.dateFrom,
        dateTo: isValidDateString(raw.dateTo) ? raw.dateTo : fallback.dateTo,
        customerId: isValidNumber(raw.customerId) ? raw.customerId : undefined,
        assigneeId: isValidNumber(raw.assigneeId) ? raw.assigneeId : undefined,
        statusIds: isValidNumberArray(raw.statusIds) ? raw.statusIds : [],
        priorityIds: isValidNumberArray(raw.priorityIds) ? raw.priorityIds : [],
        sortBy: isValidSortBy(raw.sortBy) ? raw.sortBy : fallback.sortBy,
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

export const loadSavedReportFilters = (): ReportFilters => {
    try {
        const raw = localStorage.getItem(REPORT_FILTERS_STORAGE_KEY);

        if (!raw) {
            return createInitialReportFilters();
        }

        return sanitizeStoredReportFilters(JSON.parse(raw));
    } catch {
        return createInitialReportFilters();
    }
};

export const saveReportFilters = (filters: ReportFilters) => {
    try {
        localStorage.setItem(REPORT_FILTERS_STORAGE_KEY, JSON.stringify(filters));
    } catch {
        // ignore storage errors
    }
};

export const clearSavedReportFilters = () => {
    try {
        localStorage.removeItem(REPORT_FILTERS_STORAGE_KEY);
    } catch {
        // ignore storage errors
    }
};