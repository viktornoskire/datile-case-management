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
    purchase: string;
    quantity: number;
    price: number;
    shipping: number;
    outprice: number;
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
    totalOutprice: number;
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

export const reportSortOptions: Array<{ value: ReportSortBy; label: string }> = [
    { value: "customer", label: "Kund" },
    { value: "contact", label: "Namn" },
    { value: "title", label: "Rubrik" },
    { value: "status", label: "Status" },
    { value: "priority", label: "Prioritet" },
    { value: "timeSpent", label: "Tidsåtgång" },
    { value: "assignee", label: "Ansvarig" },
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