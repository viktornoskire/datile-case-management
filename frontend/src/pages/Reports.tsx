import { useEffect, useState } from "react";
import { fetchReports } from "../api/reportsApi";
import {
    fetchAssignees,
    fetchCustomers,
    fetchPriorities,
    fetchStatuses,
} from "../api/LookupsApi";
import { ReportFilterPanel } from "../components/ReportFilterPanel";
import { ReportListRow } from "../components/ReportListRow";
import { ReportPagination } from "../components/ReportPagination";
import {
    createInitialReportFilters,
    type ReportFilters,
    type ReportsResponse,
} from "../types/reports";

type FilterOption = {
    value: number;
    label: string;
};

export default function Reports() {
    const [filters, setFilters] = useState<ReportFilters>(createInitialReportFilters());
    const [data, setData] = useState<ReportsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    const [customerOptions, setCustomerOptions] = useState<FilterOption[]>([]);
    const [assigneeOptions, setAssigneeOptions] = useState<FilterOption[]>([]);
    const [statusOptions, setStatusOptions] = useState<FilterOption[]>([]);
    const [priorityOptions, setPriorityOptions] = useState<FilterOption[]>([]);

    useEffect(() => {
        let alive = true;

        const loadFilterOptions = async () => {
            try {
                const [customers, assignees, statuses, priorities] = await Promise.all([
                    fetchCustomers(),
                    fetchAssignees(),
                    fetchStatuses(),
                    fetchPriorities(),
                ]);

                if (!alive) return;

                setCustomerOptions(
                    customers.map((customer) => ({
                        value: customer.customerId,
                        label: customer.name,
                    })),
                );

                setAssigneeOptions(
                    assignees.map((assignee) => ({
                        value: assignee.assigneeId,
                        label: assignee.name,
                    })),
                );

                setStatusOptions(
                    statuses.map((status) => ({
                        value: status.statusId,
                        label: status.name,
                    })),
                );

                setPriorityOptions(
                    priorities.map((priority) => ({
                        value: priority.priorityId,
                        label: priority.name,
                    })),
                );
            } catch (e) {
                if (!alive) return;
                console.error("Failed to load report filter options", e);
            }
        };

        void loadFilterOptions();

        return () => {
            alive = false;
        };
    }, []);

    useEffect(() => {
        let alive = true;

        const run = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetchReports(filters);

                if (alive) {
                    setData(response);
                }
            } catch (e) {
                if (!alive) return;
                setError(e instanceof Error ? e.message : "Unknown error");
            } finally {
                if (alive) {
                    setLoading(false);
                }
            }
        };

        void run();

        return () => {
            alive = false;
        };
    }, [filters]);

    const toggleExpandedRow = (errandId: number) => {
        setExpandedRows((current) => {
            const next = new Set(current);

            if (next.has(errandId)) {
                next.delete(errandId);
            } else {
                next.add(errandId);
            }

            return next;
        });
    };

    const handleClear = () => {
        setFilters(createInitialReportFilters());
        setExpandedRows(new Set());
    };

    return (
        <div className="min-h-screen bg-stone-100">
            <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 sm:pb-10 sm:pt-16">
                <div className="mb-4 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm backdrop-blur sm:mb-5 sm:p-4">
                    <div className="space-y-0.5">
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                            Rapporter
                        </h1>
                        <p className="text-sm text-slate-500">
                            Filtrera, granska och exportera ärenden.
                        </p>
                    </div>
                </div>

                <div className="mb-6">
                    <ReportFilterPanel
                        filters={filters}
                        onChange={setFilters}
                        onClear={handleClear}
                        customers={customerOptions}
                        assignees={assigneeOptions}
                        statuses={statusOptions}
                        priorities={priorityOptions}
                    />
                </div>

                {loading ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
                        Laddar rapporter…
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
                        Fel: {error}
                    </div>
                ) : !data ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
                        Ingen data hittades.
                    </div>
                ) : (
                    <>
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-sm text-slate-500">
                                {data.totalElements} {data.totalElements === 1 ? "träff" : "träffar"}
                            </p>
                        </div>

                        {data.reports.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-sm">
                                Inga ärenden matchar dina filter.
                            </div>
                        ) : (
                            <>
                                <div className="hidden rounded-t-2xl border border-slate-200 border-b-0 bg-slate-100 px-5 py-3 sm:grid sm:grid-cols-[56px_80px_minmax(0,1.6fr)_160px_130px_130px_90px_110px_130px] sm:gap-3">
                                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                    </div>
                                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                        ID
                                    </div>
                                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                        Ärende / Kundkontakt
                                    </div>
                                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                        Ansvarig
                                    </div>
                                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                        Status
                                    </div>
                                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                        Prioritet
                                    </div>
                                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                        Tidsåtgång
                                    </div>
                                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                        Datum
                                    </div>
                                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                        Överenskommet Pris
                                    </div>
                                </div>

                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-t-none">
                                    {data.reports.map((report) => (
                                        <ReportListRow
                                            key={report.errandId}
                                            report={report}
                                            isExpanded={expandedRows.has(report.errandId)}
                                            onToggleExpand={toggleExpandedRow}
                                        />
                                    ))}
                                </div>

                                <ReportPagination
                                    page={data.page}
                                    totalPages={data.totalPages}
                                    onPageChange={(page) =>
                                        setFilters((current) => ({
                                            ...current,
                                            page,
                                        }))
                                    }
                                />
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}