export type StatusOption = {
    statusId: number;
    name: string;
};

export type PriorityOption = {
    priorityId: number;
    name: string;
    color: string;
};

export type AssigneeOption = {
    assigneeId: number;
    name: string;
};

export type CustomerOption = {
    customerId: number;
    name: string;
};

export type ContactOption = {
    contactId: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    mail: string;
};

const handleResponse = async <T>(res: Response): Promise<T> => {
    if (!res.ok) {
        const body = await res.text();
        throw new Error(body || `Request failed (${res.status})`);
    }

    return res.json();
};

export const fetchStatuses = async (): Promise<StatusOption[]> => {
    return handleResponse(await fetch("/api/statuses"));
};

export const fetchPriorities = async (): Promise<PriorityOption[]> => {
    return handleResponse(await fetch("/api/priorities"));
};

export const fetchAssignees = async (): Promise<AssigneeOption[]> => {
    return handleResponse(await fetch("/api/assignees"));
};

export const fetchCustomers = async (): Promise<CustomerOption[]> => {
    return handleResponse(await fetch("/api/customers"));
};

export const fetchContacts = async (): Promise<ContactOption[]> => {
    return handleResponse(await fetch("/api/contacts"));
};