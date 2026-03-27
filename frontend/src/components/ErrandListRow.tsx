import type { ErrandListItem } from "../types/errands";
import { getPriorityStyles } from "../utils/priorityStyles";

/* React component to show errands in a compact responsive list row */

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
                                  onEdit,
                              }: {
    errand: ErrandListItem;
    onOpen: (errandId: number) => void;
    onEdit: (errandId: number) => void;
}) => {
    const { name: priorityName, accentStyle, badgeStyle } = getPriorityStyles(errand.priority);

    const customerName = errand.customer?.name ?? "—";
    const contactName = errand.contact
        ? `${errand.contact.firstName} ${errand.contact.lastName}`
        : "—";
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
            className="group relative border-b border-slate-200 bg-white transition hover:bg-slate-50"
            onClick={() => onOpen(errand.errandId)}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onOpen(errand.errandId);
                }
            }}
        >
            <div className="absolute inset-y-0 left-0 w-1" style={accentStyle} />

            <div className="px-4 py-3 pl-5">
                <div className="sm:hidden">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold text-slate-900">
                                {safe(errand.title)}
                            </div>

                            <div className="mt-0.5 text-xs text-slate-500">
                                #{String(errand.errandId).padStart(3, "0")} · {safe(customerName)}
                            </div>

                            <div className="mt-1 text-xs text-slate-400">
                                Kontakt: {safe(contactName)}
                            </div>
                        </div>

                        <button
                            type="button"
                            className="shrink-0 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
                            onClick={(event) => {
                                event.stopPropagation();
                                onOpen(errand.errandId);
                            }}
                        >
                            Visa
                        </button>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                            className="inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                            style={badgeStyle}
                        >
                            {priorityName}
                        </span>

                        <span className="text-xs text-slate-600">{safe(statusName)}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-600">{safe(assigneeName)}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-600">{formatDate(errand.createdAt)}</span>
                    </div>

                    <div className="mt-2 truncate text-xs text-slate-500">
                        {latestHistory
                            ? `${safe(latestHistory.description)} · ${safe(
                                latestHistory.verifiedName,
                            )} · ${formatDateTime(latestHistory.createdAt)}`
                            : "Ingen historik än."}
                    </div>
                </div>

                <div className="hidden sm:grid sm:grid-cols-[72px_minmax(0,2.8fr)_minmax(0,1.8fr)_minmax(0,1.2fr)_minmax(0,1.1fr)_110px_110px_96px] sm:items-center sm:gap-4">
                    <div className="text-sm font-semibold text-slate-900">
                        #{String(errand.errandId).padStart(3, "0")}
                    </div>

                    <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">
                            {safe(errand.title)}
                        </div>

                        <div className="mt-1 truncate text-xs text-slate-500">
                            {latestHistory
                                ? `${safe(latestHistory.description)} · ${safe(
                                    latestHistory.verifiedName,
                                )} · ${formatDateTime(latestHistory.createdAt)}`
                                : "Ingen historik än."}
                        </div>
                    </div>

                    <div className="min-w-0">
                        <div className="truncate text-sm text-slate-800">{safe(customerName)}</div>
                        <div className="mt-0.5 truncate text-[11px] text-slate-500">
                            Kontakt: {safe(contactName)}
                        </div>
                    </div>

                    <div className="truncate text-sm text-slate-800">
                        {safe(assigneeName)}
                    </div>

                    <div className="truncate text-sm text-slate-800">
                        {safe(statusName)}
                    </div>

                    <div>
                        <span
                            className="inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                            style={badgeStyle}
                        >
                            {priorityName}
                        </span>
                    </div>

                    <div className="text-sm text-slate-800">
                        {formatDate(errand.createdAt)}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
                            onClick={(event) => {
                                event.stopPropagation();
                                onEdit(errand.errandId);
                            }}
                        >
                            Redigera
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};