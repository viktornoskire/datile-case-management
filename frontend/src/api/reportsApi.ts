import { apiClient } from "../services/apiClient";
import type { ReportFilters, ReportsResponse } from "../types/reports";

export const buildReportParams = (filters: ReportFilters) => {
    const params: Record<string, string | number | boolean | null | undefined> = {
        sortBy: filters.sortBy,
        page: filters.page,
        size: filters.size,
    };

    if (filters.dateFrom) {
        params.dateFrom = filters.dateFrom;
    }

    if (filters.dateTo) {
        params.dateTo = filters.dateTo;
    }

    if (typeof filters.customerId === "number") {
        params.customerId = filters.customerId;
    }

    if (typeof filters.assigneeId === "number") {
        params.assigneeId = filters.assigneeId;
    }

    if (filters.statusIds.length > 0) {
        params.statusIds = filters.statusIds.join(",");
    }

    if (filters.priorityIds.length > 0) {
        params.priorityIds = filters.priorityIds.join(",");
    }

    return params;
};

export const fetchReports = async (filters: ReportFilters) =>
    apiClient.get<ReportsResponse>("/api/reports", {
        params: buildReportParams(filters),
    });

export const exportReportsCsv = async (filters: ReportFilters): Promise<Blob> => {
    const params = new URLSearchParams();

    Object.entries(buildReportParams(filters)).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            params.set(key, String(value));
        }
    });

    const response = await fetch(`/api/reports/export/csv?${params.toString()}`);

    if (!response.ok) {
        const body = await response.text();
        throw new Error(body || `Export failed (${response.status})`);
    }

    return response.blob();
};