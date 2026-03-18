import type {ReportListItem} from "../types/reports";
import {getPriorityStyles} from "../utils/priorityStyles";

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

    return new Date(iso).toLocaleDateString("sv-SE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

type ReportListRowProps = {
    report: ReportListItem;
    isExpanded: boolean;
    onToggleExpand: (errandId: number) => void;
    onEdit: (errandId: number) => void;
    onQuickAddPurchase: (errandId: number) => void;
};

export const ReportListRow = ({
                                  report,
                                  isExpanded,
                                  onToggleExpand,
                                  onEdit,
                                  onQuickAddPurchase,
                              }: ReportListRowProps) => {
    const priority = getPriorityStyles(report.priority);

    const contactName = report.contact
        ? `${report.contact.firstName} ${report.contact.lastName}`
        : "—";

    const purchases = report.purchases ?? [];

    return (
        <article className="border-b border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)] last:border-b-0">
            <div className="px-4 py-4 sm:px-5 lg:px-6">
                {/* Mobile */}
                <div className="md:hidden">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                            <button
                                type="button"
                                onClick={() => onToggleExpand(report.errandId)}
                                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-base text-slate-700 transition hover:bg-slate-50"
                                aria-label={isExpanded ? "Dölj inköp" : "Visa inköp"}
                                title={isExpanded ? "Dölj inköp" : "Visa inköp"}
                            >
                                🛒
                            </button>

                            <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-semibold text-slate-900">
                                    {safe(report.title)}
                                </div>
                                <div className="mt-0.5 text-xs text-slate-500">
                                    Ärende #{String(report.errandId).padStart(3, "0")} ·{" "}
                                    {safe(report.customer?.name)}
                                </div>
                                <div className="mt-1 text-xs text-slate-500">
                                    {safe(contactName)}
                                </div>
                            </div>
                        </div>

                        <span
                            className="inline-flex shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold"
                            style={priority.badgeStyle}
                        >
                            {priority.name}
                        </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
                        <span>{safe(report.status?.name)}</span>
                        <span className="text-slate-400">•</span>
                        <span>{safe(report.assignee?.name)}</span>
                        <span className="text-slate-400">•</span>
                        <span>{report.timeSpent ?? 0} h</span>
                        <span className="text-slate-400">•</span>
                        <span>{formatDate(report.createdAt)}</span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 xs:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => onEdit(report.errandId)}
                            className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Redigera ärende
                        </button>
                    </div>

                    {isExpanded && (
                        <div
                            className="mt-4 rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-100 p-4 shadow-sm">
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="inline-flex items-center rounded-full bg-sky-700 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                                        Inköp för ärende #{String(report.errandId).padStart(3, "0")}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => onQuickAddPurchase(report.errandId)}
                                        className="inline-flex items-center rounded-full border border-sky-300 bg-white px-3 py-1 text-[11px] font-semibold text-sky-800 transition hover:bg-sky-50"
                                    >
                                        🛒 Lägg till / ändra
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => onToggleExpand(report.errandId)}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-base font-semibold text-slate-700 transition hover:bg-slate-50"
                                    aria-label="Stäng inköp"
                                    title="Stäng inköp"
                                >
                                    ×
                                </button>
                            </div>

                            {purchases.length === 0 ? (
                                <div className="text-sm text-slate-500">
                                    Inga inköp i ärendet.
                                </div>
                            ) : (
                                <ul className="space-y-3">
                                    {purchases.map((purchase) => (
                                        <li
                                            key={purchase.purchaseId}
                                            className="rounded-xl border border-slate-200 bg-white p-3"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-sm font-semibold text-slate-900">
                                                        {safe(purchase.itemName)}
                                                    </div>
                                                    <div className="mt-1 text-xs text-slate-500">
                                                        {purchase.quantity} st ×{" "}
                                                        {formatMoney(purchase.salePrice)}
                                                    </div>
                                                </div>

                                                <div className="shrink-0 text-right">
                                                    <div
                                                        className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                        pris
                                                    </div>
                                                    <div className="mt-1 text-sm font-semibold text-slate-900">
                                                        {formatMoney(
                                                            (purchase.quantity ?? 0) *
                                                            (purchase.salePrice ?? 0),
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                {/* Ipad */}
                <div className="hidden md:block xl:hidden">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 flex-1 items-start gap-3">
                                <button
                                    type="button"
                                    onClick={() => onToggleExpand(report.errandId)}
                                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-base text-slate-700 transition hover:bg-slate-50"
                                    aria-label={isExpanded ? "Dölj inköp" : "Visa inköp"}
                                    title={isExpanded ? "Dölj inköp" : "Visa inköp"}
                                >
                                    🛒
                                </button>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="text-sm font-semibold text-slate-900">
                                            #{String(report.errandId).padStart(3, "0")}
                                        </div>
                                        <span
                                            className="inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold"
                                            style={priority.badgeStyle}
                                        >
                                            {priority.name}
                                        </span>
                                    </div>

                                    <div className="mt-1 truncate text-base font-semibold text-slate-900">
                                        {safe(report.title)}
                                    </div>

                                    <div className="mt-1 text-sm text-slate-600">
                                        {safe(report.customer?.name)} · {safe(contactName)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                            <InfoCard label="Ansvarig" value={safe(report.assignee?.name)}/>
                            <InfoCard label="Status" value={safe(report.status?.name)}/>
                            <InfoCard label="Tid" value={`${report.timeSpent ?? 0} h`}/>
                            <InfoCard label="Skapad" value={formatDate(report.createdAt)}/>
                            <InfoCard
                                label="Överenskommet pris"
                                value={formatMoney(report.agreedPrice)}
                                valueClassName="font-semibold text-slate-900"
                            />
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={() => onEdit(report.errandId)}
                                className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Redigera
                            </button>
                        </div>
                    </div>

                    {isExpanded && (
                        <div
                            className="mt-4 rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-100 p-5 shadow-sm">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="inline-flex items-center rounded-full bg-sky-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
                                        Inköp för ärende #{String(report.errandId).padStart(3, "0")}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => onQuickAddPurchase(report.errandId)}
                                        className="inline-flex items-center rounded-full border border-sky-300 bg-white px-3 py-1 text-xs font-semibold text-sky-800 transition hover:bg-sky-50"
                                    >
                                        🛒 Lägg till / ändra
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => onToggleExpand(report.errandId)}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-lg font-semibold text-slate-700 transition hover:bg-slate-50"
                                    aria-label="Stäng inköp"
                                    title="Stäng inköp"
                                >
                                    ×
                                </button>
                            </div>

                            {purchases.length === 0 ? (
                                <div className="text-sm text-slate-500">
                                    Inga inköp i ärendet
                                </div>
                            ) : (
                                <ul className="grid gap-3 sm:grid-cols-2">
                                    {purchases.map((purchase) => (
                                        <li
                                            key={purchase.purchaseId}
                                            className="rounded-xl border border-slate-200 bg-white p-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-sm font-semibold text-slate-900">
                                                        {safe(purchase.itemName)}
                                                    </div>
                                                    <div className="mt-1 text-sm text-slate-600">
                                                        {purchase.quantity} st ×{" "}
                                                        {formatMoney(purchase.salePrice)}
                                                    </div>
                                                </div>

                                                <div className="shrink-0 text-right">
                                                    <div
                                                        className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                        pris
                                                    </div>
                                                    <div className="mt-1 text-sm font-semibold text-slate-900">
                                                        {formatMoney(
                                                            (purchase.quantity ?? 0) *
                                                            (purchase.salePrice ?? 0),
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                {/* Desktop */}
                <div className="hidden xl:block">
                    <div
                        className="grid grid-cols-[56px_72px_minmax(180px,1.6fr)_minmax(110px,0.9fr)_minmax(100px,0.8fr)_110px_80px_100px_130px_120px] items-center gap-3">
                        <div>
                            <button
                                type="button"
                                onClick={() => onToggleExpand(report.errandId)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-base text-slate-700 transition hover:bg-slate-50"
                                aria-label={isExpanded ? "Dölj inköp" : "Visa inköp"}
                                title={isExpanded ? "Dölj inköp" : "Visa inköp"}
                            >
                                🛒
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
                            {formatMoney(report.agreedPrice)}
                        </div>

                        <div className="flex items-center justify-end">
                            <button
                                type="button"
                                onClick={() => onEdit(report.errandId)}
                                className="inline-flex min-w-[96px] items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Redigera
                            </button>
                        </div>
                    </div>

                    {isExpanded && (
                        <div
                            className="mt-4 rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-100 p-5 shadow-sm">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="inline-flex items-center rounded-full bg-sky-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
                                        Inköp för ärende #{String(report.errandId).padStart(3, "0")}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => onQuickAddPurchase(report.errandId)}
                                        className="inline-flex items-center rounded-full border border-sky-300 bg-white px-3 py-1 text-xs font-semibold text-sky-800 transition hover:bg-sky-50"
                                    >
                                        🛒 Lägg till / ändra
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => onToggleExpand(report.errandId)}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-lg font-semibold text-slate-700 transition hover:bg-slate-50"
                                    aria-label="Stäng inköp"
                                    title="Stäng inköp"
                                >
                                    ×
                                </button>
                            </div>

                            {purchases.length === 0 ? (
                                <div className="text-sm text-slate-500">
                                    Inga inköp i ärendet
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
                                                        {safe(purchase.itemName)}
                                                    </div>
                                                    <div className="mt-1 text-sm text-slate-600">
                                                        {purchase.quantity} st ×{" "}
                                                        {formatMoney(purchase.salePrice)}
                                                    </div>
                                                </div>

                                                <div className="shrink-0 text-right">
                                                    <div
                                                        className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                        Pris
                                                    </div>
                                                    <div className="mt-1 text-sm font-semibold text-slate-900">
                                                        {formatMoney(
                                                            (purchase.quantity ?? 0) *
                                                            (purchase.salePrice ?? 0),
                                                        )}
                                                    </div>
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

type InfoCardProps = {
    label: string;
    value: string;
    valueClassName?: string;
};

const InfoCard = ({label, value, valueClassName = ""}: InfoCardProps) => (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
        <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            {label}
        </div>
        <div className={`mt-1 text-sm text-slate-800 ${valueClassName}`}>{value}</div>
    </div>
);