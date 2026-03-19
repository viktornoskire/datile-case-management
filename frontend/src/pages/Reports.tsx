import {useEffect, useState} from "react";
import {exportReportsCsv, fetchReports} from "../api/reportsApi";
import {
    fetchAssignees,
    fetchCustomerLookups,
    fetchPriorities,
    fetchStatuses,
} from "../api/LookupsApi";
import {ErrandDetailsModal} from "../components/ErrandDetailsModal";
import {ReportFilterPanel} from "../components/ReportFilterPanel";
import {ReportListRow} from "../components/ReportListRow";
import {ReportPagination} from "../components/ReportPagination";
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
    const [exporting, setExporting] = useState(false);

    const [customerOptions, setCustomerOptions] = useState<FilterOption[]>([]);
    const [assigneeOptions, setAssigneeOptions] = useState<FilterOption[]>([]);
    const [statusOptions, setStatusOptions] = useState<FilterOption[]>([]);
    const [priorityOptions, setPriorityOptions] = useState<FilterOption[]>([]);

    const [editingErrandId, setEditingErrandId] = useState<number | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [startWithPurchaseFormOpen, setStartWithPurchaseFormOpen] = useState(false);


    const openEditModal = (errandId: number) => {
        setEditingErrandId(errandId);
        setStartWithPurchaseFormOpen(false);
        setIsEditModalOpen(true);
    };

    const openPurchaseModal = (errandId: number) => {
        setEditingErrandId(errandId);
        setStartWithPurchaseFormOpen(true);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditingErrandId(null);
        setIsEditModalOpen(false);
        setStartWithPurchaseFormOpen(false);
    };

    useEffect(() => {
        let alive = true;

        const loadFilterOptions = async () => {
            try {
                const [customers, assignees, statuses, priorities] = await Promise.all([
                    fetchCustomerLookups(),
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

    const handleExportCsv = async () => {
        try {
            setExporting(true);
            setError(null);

            const blob = await exportReportsCsv(filters);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "reports.csv";

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Export failed");
        } finally {
            setExporting(false);
        }
    };

    const handleErrandUpdated = async (_updatedErrand: unknown) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetchReports(filters);
            setData(response);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoading(false);
            closeEditModal();
        }
    };

    return (
        <div className="min-h-screen bg-stone-100">
            <div className="mx-auto max-w-7xl px-4 pb-28 pt-14 sm:px-6 sm:pt-10">
                <div
                    className="mb-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur sm:mb-5 sm:p-5 lg:rounded-3xl lg:p-6">
                    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Rapporter
                            </h1>
                            <p className="max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                                Filtrera, granska och exportera ärenden
                            </p>
                        </div>

                        {!loading && !error && data && (
                            <div
                                className="inline-flex w-fit items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                                {data.totalElements}{" "}
                                {data.totalElements === 1 ? "träff" : "träffar"}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-6 lg:mb-8">
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
                    <div
                        className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm sm:p-6 sm:text-base">
                        Laddar rapporter…
                    </div>
                ) : error ? (
                    <div
                        className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 shadow-sm sm:p-6 sm:text-base">
                        Fel: {error}
                    </div>
                ) : !data ? (
                    <div
                        className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm sm:p-6 sm:text-base">
                        Ingen data hittades.
                    </div>
                ) : (
                    <>
                        {data.reports.length === 0 ? (
                            <div
                                className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-sm sm:p-10">
                                Inga ärenden matchar dina filter.
                            </div>
                        ) : (
                            <>
                                <div
                                    className="hidden xl:grid rounded-t-2xl border border-slate-200 border-b-0 bg-slate-100 px-6 py-3 grid-cols-[56px_72px_minmax(180px,1.6fr)_minmax(110px,0.9fr)_minmax(100px,0.8fr)_110px_80px_100px_130px_120px] gap-3">
                                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500"/>
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
                                        Tid
                                    </div>
                                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                        Datum
                                    </div>
                                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                        Överenskommet Pris
                                    </div>
                                </div>

                                <div
                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:rounded-t-none">
                                    {data.reports.map((report) => (
                                        <ReportListRow
                                            key={report.errandId}
                                            report={report}
                                            isExpanded={expandedRows.has(report.errandId)}
                                            onToggleExpand={toggleExpandedRow}
                                            onEdit={openEditModal}
                                            onQuickAddPurchase={openPurchaseModal}
                                        />
                                    ))}
                                </div>

                                <div className="mt-6 lg:mt-8">
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="order-2 lg:order-2">
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
                                        </div>

                                        <div className="order-1 flex w-full justify-start lg:order-1 lg:w-auto">
                                            <button
                                                type="button"
                                                onClick={handleExportCsv}
                                                disabled={exporting}
                                                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[220px] lg:rounded-full"
                                            >
                                                {exporting ? "Exporterar..." : "Exportera .CSV"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}

                {isEditModalOpen && editingErrandId !== null && (
                    <ErrandDetailsModal
                        errandId={editingErrandId}
                        mode="edit"
                        onClose={closeEditModal}
                        onErrandUpdated={handleErrandUpdated}
                        startWithPurchaseFormOpen={startWithPurchaseFormOpen}
                    />
                )}
            </div>
        </div>
    );
}