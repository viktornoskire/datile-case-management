export type StatusOption = {
    statusId: number;
    name: string;
};

export const fetchStatuses = async (): Promise<StatusOption[]> => {
    const res = await fetch("/api/statuses");

    if (!res.ok) {
        const body = await res.text();
        throw new Error(body || `Request failed (${res.status})`);
    }

    return res.json();
};