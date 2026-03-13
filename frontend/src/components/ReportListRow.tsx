import type { ReportListItem } from "../types/reports";
import { getPriorityStyles } from "../utils/priorityStyles";

const safe = (value?: string | null) =>
    value && value.trim().length > 0 ? value : "—";

const formatMoney = (value?: number | null) => {
    if (value === null || value === undefined) return "—";

    return new Intl.NumberFormat("sv-SE", {
        style: "currency",
        currency: "SEK",
        maximumFractionDigits: 0,
    }).format(value);
};

const formatDate = (iso?: string | null) => {
    if (!iso) return "—";

    return new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

type ReportListRowProps = {
    report: ReportListItem;
    isExpanded: boolean;
    onToggleExpand: (errandId: number) => void;
};

export const ReportListRow = ({
                                  report,
                                  isExpanded,
                                  onToggleExpand,
                              }: ReportListRowProps) => {
    const priority = getPriorityStyles(report.priority);

    const contactName = report.contact
        ? `${report.contact.firstName} ${report.contact.lastName}`
        : "—";

    const purchases = report.purchases ?? [];

    return (
        <article className="border-b border-slate-300 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)] last:border-b-0">
            <div className="px-4 py-3 sm:px-5">
                <div className="sm:hidden">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                            <button
                                type="button"
                                onClick={() => onToggleExpand(report.errandId)}
                                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                                aria-label={isExpanded ? "Dölj inköp" : "Visa inköp"}
                            >
                                {isExpanded ? "−" : "+"}
                            </button>

                            <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-semibold text-slate-900">
                                    {safe(report.title)}
                                </div>
                                <div className="mt-0.5 text-xs text-slate-500">
                                    Ärende #{String(report.errandId).padStart(3, "0")} · {safe(report.customer?.name)}
                                </div>
                            </div>
                        </div>

                        <span
                            className="inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                            style={priority.badgeStyle}
                        >
                            {priority.name}
                        </span>
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                        {safe(contactName)}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
                        <span>{safe(report.status?.name)}</span>
                        <span className="text-slate-400">•</span>
                        <span>{safe(report.assignee?.name)}</span>
                        <span className="text-slate-400">•</span>
                        <span>{report.timeSpent ?? 0} h</span>
                        <span className="text-slate-400">•</span>
                        <span>{formatDate(report.createdAt)}</span>
                    </div>

                    <div className="mt-3 text-sm">
                        <div className="text-xs font-medium text-slate-500">Överenskommet Pris</div>
                        <div className="font-semibold text-slate-900">
                            {formatMoney(report.totalOutprice)}
                        </div>
                    </div>

                    {isExpanded && (
                        <div className="mt-4 rounded-2xl border border-emerald-300 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 p-5 shadow-sm">
                            <div className="mt-4 rounded-2xl border border-emerald-300 bg-emerald-50 p-4">
                                Inköp
                            </div>

                            {purchases.length === 0 ? (
                                <div className="text-sm text-slate-500">
                                    Inga inköp kopplade till ärendet.
                                </div>
                            ) : (
                                <ul className="space-y-3">
                                    {purchases.map((purchase) => (
                                        <li
                                            key={purchase.purchaseId}
                                            className="rounded-xl border border-slate-200 bg-white p-3"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <div className="text-sm font-semibold text-slate-900">
                                                        {safe(purchase.purchase)}
                                                    </div>
                                                    <div className="mt-1 text-xs text-slate-500">
                                                        {purchase.quantity} st × {formatMoney(purchase.outprice)}
                                                    </div>
                                                </div>

                                                <div className="text-sm font-semibold text-slate-900">
                                                    {formatMoney(
                                                        (purchase.quantity ?? 0) * (purchase.outprice ?? 0),
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                <div className="hidden sm:block">
                    <div className="grid grid-cols-[56px_80px_minmax(0,1.6fr)_160px_130px_130px_90px_110px_130px] items-center gap-3">
                        <div>
                            <button
                                type="button"
                                onClick={() => onToggleExpand(report.errandId)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                                aria-label={isExpanded ? "Dölj inköp" : "Visa inköp"}
                            >
                                {isExpanded ? "−" : "+"}
                            </button>
                        </div>

                        <div className="text-sm font-semibold text-slate-900">
                            {String(report.errandId).padStart(3, "0")}
                        </div>

                        <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-slate-900">
                                {safe(report.title)}
                            </div>
                            <div className="truncate text-xs text-slate-500">
                                {safe(report.customer?.name)} · {safe(contactName)}
                            </div>
                        </div>

                        <div className="truncate text-sm text-slate-800">
                            {safe(report.assignee?.name)}
                        </div>

                        <div className="truncate text-sm text-slate-800">
                            {safe(report.status?.name)}
                        </div>

                        <div>
                            <span
                                className="inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                                style={priority.badgeStyle}
                            >
                                {priority.name}
                            </span>
                        </div>

                        <div className="text-sm text-slate-800">
                            {report.timeSpent ?? 0} h
                        </div>

                        <div className="text-sm text-slate-800">
                            {formatDate(report.createdAt)}
                        </div>

                        <div className="text-sm font-medium text-slate-900">
                            {formatMoney(report.totalOutprice)}
                        </div>
                    </div>

                    {isExpanded && (
                        <div className="mt-4 rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-100 p-5 shadow-sm">
                            <div className="inline-flex items-center rounded-full bg-sky-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
                                Inköp för ärende #{String(report.errandId).padStart(3, "0")}
                            </div>

                            {purchases.length === 0 ? (
                                <div className="text-sm text-slate-500">
                                    Inga inköp kopplade till ärendet.
                                </div>
                            ) : (
                                <ul className="space-y-3">
                                    {purchases.map((purchase) => (
                                        <li
                                            key={purchase.purchaseId}
                                            className="rounded-xl border border-slate-200 bg-white p-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <div className="text-sm font-semibold text-slate-900">
                                                        {safe(purchase.purchase)}
                                                    </div>
                                                    <div className="mt-1 text-sm text-slate-600">
                                                        {purchase.quantity} st × {formatMoney(purchase.outprice)}
                                                    </div>
                                                </div>

                                                <div className="text-sm font-semibold text-slate-900">
                                                    {formatMoney(
                                                        (purchase.quantity ?? 0) * (purchase.outprice ?? 0),
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
};