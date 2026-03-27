import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchErrands } from "../api/errandsApi";
import {
    fetchAssignees,
    fetchCustomerLookups,
    type CustomerLookup,
} from "../api/LookupsApi";
import { ErrandCard } from "../components/ErrandCard";
import { ErrandListRow } from "../components/ErrandListRow";
import { ErrandDetailsModal } from "../components/ErrandDetailsModal";
import { FilterPanel } from "../components/FilterPanel";
import {
    buildErrandFilterParams,
    clearSavedErrandFilters,
    errandPriorityOptions,
    errandStatusOptions,
    initialErrandFilters,
    loadSavedErrandFilters,
    saveErrandFilters,
    type ErrandAssignee,
    type ErrandDetails,
    type ErrandFilters,
    type ErrandsResponse,
} from "../types/errands";

/* React component for an errand page */

export default function Errands() {
    const [data, setData] = useState<ErrandsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [view, setView] = useState<"cards" | "list">("cards");
    const [selectedErrandId, setSelectedErrandId] = useState<number | null>(null);
    const [modalMode, setModalMode] = useState<"view" | "edit">("view");

    const [filters, setFilters] = useState<ErrandFilters>(() => loadSavedErrandFilters());
    const [debouncedQ, setDebouncedQ] = useState(filters.q);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    const [customers, setCustomers] = useState<CustomerLookup[]>([]);
    const [assignees, setAssignees] = useState<ErrandAssignee[]>([]);

    const navigate = useNavigate();

    const totalPages = data?.totalPages ?? 0;

    const openModal = (errandId: number) => {
        setModalMode("view");
        setSelectedErrandId(errandId);
    };

    const openEditModal = (errandId: number) => {
        setModalMode("edit");
        setSelectedErrandId(errandId);
    };

    const closeModal = () => {
        setSelectedErrandId(null);
        setModalMode("view");
    };

    const handleErrandUpdated = (updatedErrand: ErrandDetails) => {
        setData((current) => {
            if (!current) return current;

            return {
                ...current,
                errands: current.errands.map((errand) =>
                    errand.errandId === updatedErrand.errandId
                        ? {
                            ...errand,
                            title: updatedErrand.title,
                            description: updatedErrand.description,
                            status: updatedErrand.status,
                            priority: updatedErrand.priority,
                            assignee: updatedErrand.assignee,
                            customer: updatedErrand.customer,
                            contact: updatedErrand.contact,
                            historyPreview: updatedErrand.history?.slice(0, 2) ?? [],
                        }
                        : errand,
                ),
            };
        });
    };

    const getVisiblePages = (): (number | "...")[] => {
        const pages: (number | "...")[] = [];
        const total = totalPages;
        const current = filters.page;

        if (total <= 7) {
            return Array.from({ length: total }, (_, i) => i);
        }

        pages.push(0);

        if (current > 3) {
            pages.push("...");
        }

        const start = Math.max(1, current - 1);
        const end = Math.min(total - 2, current + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (current < total - 3) {
            pages.push("...");
        }

        pages.push(total - 1);

        return pages;
    };

    useEffect(() => {
        saveErrandFilters(filters);
    }, [filters]);

    useEffect(() => {
        let alive = true;

        const loadFilterOptions = async () => {
            try {
                const [customerData, assigneeData] = await Promise.all([
                    fetchCustomerLookups(),
                    fetchAssignees(),
                ]);

                if (!alive) return;

                setCustomers(customerData);
                setAssignees(assigneeData);
            } catch (e) {
                if (!alive) return;
                console.error("Failed to load errand filter options", e);
            }
        };

        void loadFilterOptions();

        return () => {
            alive = false;
        };
    }, []);

    useEffect(() => {
        const allowedStatuses = new Set(errandStatusOptions.map((option) => option.value));
        const allowedPriorities = new Set(errandPriorityOptions.map((option) => option.value));

        setFilters((current) => {
            const nextCustomerId =
                current.customerId !== "" &&
                customers.some((customer) => String(customer.customerId) === current.customerId)
                    ? current.customerId
                    : "";

            const nextAssigneeId =
                current.assigneeId !== "" &&
                assignees.some((assignee) => String(assignee.assigneeId) === current.assigneeId)
                    ? current.assigneeId
                    : "";

            const nextStatuses = current.statuses.filter((status) => allowedStatuses.has(status));
            const nextPriorities = current.priorities.filter((priority) =>
                allowedPriorities.has(priority),
            );

            const hasChanged =
                nextCustomerId !== current.customerId ||
                nextAssigneeId !== current.assigneeId ||
                nextStatuses.length !== current.statuses.length ||
                nextPriorities.length !== current.priorities.length;

            if (!hasChanged) {
                return current;
            }

            return {
                ...current,
                customerId: nextCustomerId,
                assigneeId: nextAssigneeId,
                statuses: nextStatuses,
                priorities: nextPriorities,
                page: 0,
            };
        });
    }, [customers, assignees]);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setDebouncedQ(filters.q);
        }, 400);

        return () => window.clearTimeout(timeoutId);
    }, [filters.q]);

    useEffect(() => {
        let alive = true;

        const run = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetchErrands({
                    ...buildErrandFilterParams({
                        ...filters,
                        q: debouncedQ,
                    }),
                    sortBy: filters.sortBy,
                    sortDir: "desc",
                });

                if (alive) {
                    setData(res);
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
    }, [
        filters.page,
        filters.size,
        filters.sortBy,
        filters.statuses,
        filters.priorities,
        filters.assigneeId,
        filters.customerId,
        debouncedQ,
    ]);

    if (loading) {
        return (
            <div className="min-h-screen bg-stone-100">
                <div className="mx-auto max-w-7xl px-4 pb-8 pt-20 sm:px-6 sm:pb-10 sm:pt-24">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
                        Laddar ärenden…
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-stone-100">
                <div className="mx-auto max-w-7xl px-4 pb-8 pt-20 sm:px-6 sm:pb-10 sm:pt-24">
                    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
                        Fel: {error}
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-stone-100">
                <div className="mx-auto max-w-7xl px-4 pb-8 pt-20 sm:px-6 sm:pb-10 sm:pt-24">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
                        Inga ärenden hittades.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-100">
            <div className="mx-auto max-w-7xl px-4 pb-28 pt-14 sm:px-6 sm:pt-10">
                <div className="mb-4 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm backdrop-blur sm:mb-5 sm:p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-0.5">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                                Ärenden
                            </h1>
                            <p className="text-sm text-slate-500">
                                Granska, filtrera och öppna ärenden.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                            <button
                                type="button"
                                onClick={() => navigate("/errands/new")}
                                className="inline-flex w-full items-center justify-center rounded-full bg-[#0A1633] px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(10,22,51,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#13224A] hover:shadow-[0_10px_24px_rgba(10,22,51,0.35)] sm:w-auto"
                            >
                                Skapa ärende
                            </button>

                            <div className="grid w-full grid-cols-2 rounded-full border border-slate-300 bg-slate-50 p-1 shadow-sm sm:w-auto sm:min-w-[220px]">
                                <button
                                    type="button"
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                        view === "list"
                                            ? "bg-slate-900 text-white shadow-sm"
                                            : "text-slate-700 hover:bg-white"
                                    }`}
                                    onClick={() => setView("list")}
                                >
                                    Lista
                                </button>

                                <button
                                    type="button"
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                        view === "cards"
                                            ? "bg-slate-900 text-white shadow-sm"
                                            : "text-slate-700 hover:bg-white"
                                    }`}
                                    onClick={() => setView("cards")}
                                >
                                    Kort
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {isFilterPanelOpen ? (
                    <div className="mb-6">
                        <FilterPanel
                            filters={filters}
                            onChange={setFilters}
                            onClear={() => {
                                clearSavedErrandFilters();
                                setFilters(initialErrandFilters);
                            }}
                            onClose={() => setIsFilterPanelOpen(false)}
                            customers={customers}
                            assignees={assignees}
                        />
                    </div>
                ) : (
                    <div className="mb-6 rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setFilters((current) => ({
                                        ...current,
                                        q: "",
                                        page: 0,
                                    }));
                                    setIsFilterPanelOpen(true);
                                }}
                                className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                            >
                                Visa filter
                            </button>

                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={filters.q}
                                    onChange={(event) =>
                                        setFilters((current) => ({
                                            ...current,
                                            q: event.target.value,
                                            page: 0,
                                        }))
                                    }
                                    placeholder="Sök ärende..."
                                    className="w-full rounded-full border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        {data.totalElements} {data.totalElements === 1 ? "ärende" : "ärenden"}
                    </p>
                </div>

                {data.errands.length === 0 ? (
                    <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 shadow-sm">
                        Inga ärenden matchar sökningen
                    </div>
                ) : view === "cards" ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {data.errands.map((e) => (
                            <ErrandCard
                                key={e.errandId}
                                errand={e}
                                onOpen={openModal}
                                onEdit={openEditModal}
                            />
                        ))}
                    </div>
                ) : (
                    <div>
                        <div className="hidden sm:grid sm:grid-cols-[90px_minmax(0,2fr)_140px_140px_120px_120px_110px_110px] sm:items-center sm:gap-3 sm:rounded-t-2xl sm:border sm:border-slate-200 sm:border-b-0 sm:bg-slate-100 sm:px-5 sm:py-3">
                            <div className="text-[14px] font-semibold uppercase tracking-wide text-slate-500">
                                ID
                            </div>
                            <div className="text-[14px] font-semibold uppercase tracking-wide text-slate-500">
                                Rubrik
                            </div>
                            <div className="text-[14px] font-semibold uppercase tracking-wide text-slate-500">
                                Kund
                            </div>
                            <div className="text-[14px] font-semibold uppercase tracking-wide text-slate-500">
                                Ansvarig
                            </div>
                            <div className="text-[14px] font-semibold uppercase tracking-wide text-slate-500">
                                Status
                            </div>
                            <div className="text-[14px] font-semibold uppercase tracking-wide text-slate-500">
                                Prioritet
                            </div>
                            <div className="text-[14px] font-semibold uppercase tracking-wide text-slate-500">
                                Datum
                            </div>
                            <div className="text-[14px] font-semibold text-right uppercase tracking-wide text-slate-500">
                                Åtgärd
                            </div>
                        </div>

                        <ul className="m-0 list-none space-y-3 p-0">
                            {data.errands.map((e) => (
                                <li key={e.errandId}>
                                    <ErrandListRow
                                        errand={e}
                                        onOpen={openModal}
                                        onEdit={openEditModal}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setFilters((current) => ({
                                    ...current,
                                    page: Math.max(0, current.page - 1),
                                }))
                            }
                            disabled={filters.page === 0}
                            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Föregående
                        </button>

                        <div className="flex flex-wrap items-center gap-2">
                            {getVisiblePages().map((item: number | "...", index: number) =>
                                item === "..." ? (
                                    <span key={`dots-${index}`} className="px-2 text-slate-500">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() =>
                                            setFilters((current) => ({
                                                ...current,
                                                page: item,
                                            }))
                                        }
                                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                            filters.page === item
                                                ? "bg-[#022B4F] text-white"
                                                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                        }`}
                                    >
                                        {item + 1}
                                    </button>
                                ),
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setFilters((current) => ({
                                    ...current,
                                    page: Math.min(totalPages - 1, current.page + 1),
                                }))
                            }
                            disabled={filters.page >= totalPages - 1}
                            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Nästa
                        </button>
                    </div>
                )}

                {selectedErrandId !== null && (
                    <ErrandDetailsModal
                        errandId={selectedErrandId}
                        mode={modalMode}
                        onClose={closeModal}
                        onErrandUpdated={handleErrandUpdated}
                    />
                )}
            </div>
        </div>
    );
}