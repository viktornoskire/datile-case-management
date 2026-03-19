import { apiClient } from "../services/apiClient";

export type StatusLookup = {
    statusId: number;
    name: string;
};

export type PriorityLookup = {
    priorityId: number;
    name: string;
    color: string;
    isDefault: boolean;
};

export type AssigneeLookup = {
    assigneeId: number;
    name: string;
};

export type CustomerLookup = {
    customerId: number;
    name: string;
};

export type ContactLookup = {
    contactId: number;
    customerId: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    mail: string;
};

export const fetchStatuses = async (): Promise<StatusLookup[]> =>
    apiClient.get<StatusLookup[]>("/api/statuses");

export const fetchPriorities = async (): Promise<PriorityLookup[]> =>
    apiClient.get<PriorityLookup[]>("/api/priorities");

export const fetchAssignees = async (): Promise<AssigneeLookup[]> =>
    apiClient.get<AssigneeLookup[]>("/api/assignees");

export const fetchCustomerLookups = async (): Promise<CustomerLookup[]> =>
    apiClient.get<CustomerLookup[]>("/api/lookups/customers");

export const fetchContacts = async (): Promise<ContactLookup[]> =>
    apiClient.get<ContactLookup[]>("/api/contacts");