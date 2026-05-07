import { apiClient } from "../services/apiClient";

export type ContactListItem = {
    contactId: number;
    firstName: string;
    lastName: string;
    mail: string | null;
    phoneNumber: string | null;
    customerId: number;
    customerName: string | null;
};

export type CreateContactPayload = {
    firstName: string;
    lastName: string;
    mail: string;
    phoneNumber: string;
    customerId: number;
};

export type UpdateContactPayload = {
    firstName: string;
    lastName: string;
    mail: string;
    phoneNumber: string;
    customerId: number;
};

export const fetchContacts = async (): Promise<ContactListItem[]> => {
    return apiClient.get<ContactListItem[]>("/api/contacts");
};

export const createContact = async (
    payload: CreateContactPayload,
): Promise<ContactListItem> => {
    return apiClient.post<ContactListItem>(
        "/api/contacts",
        payload
    );
};

export const updateContact = async (
    contactId: number,
    payload: UpdateContactPayload,
): Promise<ContactListItem> => {
    return apiClient.put<ContactListItem>(
        `/api/contacts/${contactId}`,
        payload
    );
};

export const deleteContact = async (
    contactId: number,
): Promise<void> => {
    return apiClient.delete<void>(
        `/api/contacts/${contactId}`
    );
};