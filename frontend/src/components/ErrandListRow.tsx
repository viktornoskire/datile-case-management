import {useNavigate} from "react-router-dom";
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

export const ErrandListRow = ({errand}: { errand: ErrandListItem }) => {
    const navigate = useNavigate();
    const {name: priorityName, cardStyle, badgeStyle, valueStyle} =
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
            className="rounded-2xl p-4 shadow-sm transition-shadow hover:shadow-md"
            style={cardStyle}
        >
            <div
                className="grid gap-4 lg:grid-cols-[90px_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-start">
                <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                        Ärende ID
                    </div>
                    <div className="font-semibold text-slate-900">
                        {String(errand.errandId).padStart(3, "0")}
                    </div>
                </div>

                <div className="min-w-0">
                    <div className="truncate">
                        <span className="font-semibold text-slate-900">Titel: </span>
                        <span className="font-semibold" style={valueStyle}>
    {safe(errand.title)}
  </span>
                    </div>

                    <div className="mt-3 text-sm">
                        <div className="font-semibold text-slate-900">Senaste historik</div>

                        {latestHistory ? (
                            <div className="mt-1 rounded-xl bg-white/60 p-2">
                                <div className="text-slate-900">
                                    {safe(latestHistory.description)}
                                </div>
                                <div className="mt-1 text-xs text-slate-700">
                                    ✓ {safe(latestHistory.verifiedName)} ·{" "}
                                    {formatDateTime(latestHistory.createdAt)}
                                </div>
                            </div>
                        ) : (
                            <div className="mt-1 text-xs text-slate-700">
                                Ingen historik än.
                            </div>
                        )}
                    </div>
                </div>

                <div className="min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                        Kund
                    </div>
                    <div className="truncate font-medium text-slate-900">
                        {safe(customerName)}
                    </div>

                    <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-700">
                        Status
                    </div>
                    <div className="font-medium text-slate-900">{safe(statusName)}</div>
                </div>

                <div className="min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                        Ansvarig
                    </div>
                    <div className="truncate font-medium text-slate-900">
                        {safe(assigneeName)}
                    </div>

                    <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-700">
                        Datum
                    </div>
                    <div className="font-medium text-slate-900">
                        {formatDate(errand.createdAt)}
                    </div>
                </div>

                <div className="flex h-full flex-col items-end gap-3">
  <span
      className="rounded-full border px-3 py-1 text-sm font-semibold"
      style={badgeStyle}
  >
    {priorityName}
  </span>

                    <button
                        type="button"
                        className="mt-auto rounded-full bg-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-950 shadow-sm hover:bg-emerald-400"
                        onClick={() => navigate(`/errands/${errand.errandId}`)}
                    >
                        Visa mer
                    </button>
                </div>
            </div>
        </article>
    );
};