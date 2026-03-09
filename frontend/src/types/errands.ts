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
    assignee: ErrandAssignee | null;
    customer: ErrandCustomer | null;
    contact: ErrandContact | null;
    timeSpent: number | null;
    agreedPrice: number | null;
};