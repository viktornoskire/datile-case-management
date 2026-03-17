export type Role = "ADMIN" | "USER";

export type Permissions = {
    createErrand: boolean;
    createReport: boolean;
    customers: boolean;
    contacts: boolean;
    users: boolean;
    settings: boolean;
};

export type User = {
    id: number;
    name: string;
    email: string;
    role: Role;
};

export type Assignee = {
    assigneeId: number;
    name: string;
};
