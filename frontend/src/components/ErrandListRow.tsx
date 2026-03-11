import type {ErrandListItem} from "../types/errands";
import {getPriorityStyles} from "../utils/priorityStyles";

/* React component to show errands in the list view */

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });

const safe = (value?: string | null) =>
    value && value.trim().length > 0 ? value : "—";

export const ErrandListRow = ({
                                  errand,
                                  onOpen,
                              }: {
    errand: ErrandListItem;
    onOpen: (errandId: number) => void;
}) => {
    const {name: priorityName, accentStyle, badgeStyle, valueStyle} =
        getPriorityStyles(errand.priority);

    const customerName = errand.customer?.name ?? "—";
    const assigneeName = errand.assignee?.name ?? "—";
    const statusName = errand.status?.name ?? "—";

    const latestHistory =
        errand.historyPreview?.reduce((latest, current) => {
            if (!latest) return current;

            return new Date(current.createdAt).getTime() >
            new Date(latest.createdAt).getTime()
                ? current
                : latest;
        }, undefined as (typeof errand.historyPreview)[number] | undefined) ?? null;

    return (
        <article
            role="button"
            tabIndex={0}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm cursor-pointer"
            onClick={() => onOpen(errand.errandId)}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onOpen(errand.errandId);
                }
            }}
        >
            <div className="h-1 w-full" style={accentStyle}/>

            <div className="grid gap-4 p-2 lg:grid-cols-[minmax(0,1.6fr)_160px_160px_120px_auto] lg:items-center">
                <div className="min-w-0">
                    <div className="truncate text-base font-semibold text-slate-900">
                        <span className="text-slate-500">Ärende: </span>
                        <span style={valueStyle}>{safe(errand.title)}</span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
                        <span>
                            <span className="font-semibold text-slate-500">Prioritet: </span>
                            <span
                                className="inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                                style={badgeStyle}
                            >
                                {priorityName}
                            </span>
                        </span>

                        <span>
                            <span className="font-semibold text-slate-500">Status: </span>
                            {safe(statusName)}
                        </span>
                    </div>

                    <div className="mt-2 truncate text-xs text-slate-500">
                        <span className="font-semibold">Senaste historik: </span>
                        {latestHistory
                            ? `${safe(latestHistory.description)} · ${safe(
                                latestHistory.verifiedName,
                            )} · ${formatDateTime(latestHistory.createdAt)}`
                            : "Ingen historik än."}
                    </div>
                </div>

                <div className="min-w-0 text-sm">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Kund
                    </div>
                    <div className="truncate font-medium text-slate-900">
                        {safe(customerName)}
                    </div>
                </div>

                <div className="min-w-0 text-sm">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Ansvarig
                    </div>
                    <div className="truncate font-medium text-slate-900">
                        {safe(assigneeName)}
                    </div>
                </div>

                <div className="text-sm">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Datum
                    </div>
                    <div className="font-medium text-slate-900">
                        {formatDate(errand.createdAt)}
                    </div>
                </div>

                <div className="flex h-full min-w-[110px] flex-col items-end justify-between gap-3">
                    <div className="text-right text-sm">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Ärende ID
                        </div>
                        <div className="font-semibold text-slate-900">
                            {String(errand.errandId).padStart(3, "0")}
                        </div>
                    </div>

                    <button
                        type="button"
                        className="rounded-full bg-[#0A1633] px-4 py-0.5 text-sm font-semibold text-white transition hover:bg-[#13224A]"
                        onClick={(event) => {
                            event.stopPropagation();
                            onOpen(errand.errandId);
                        }}
                    >
                        Visa mer
                    </button>
                </div>
            </div>
        </article>
    );
};