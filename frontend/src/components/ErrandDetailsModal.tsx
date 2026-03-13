import {useEffect, useMemo, useRef, useState} from "react";
import type {CSSProperties, ReactNode} from "react";
import {fetchErrandById} from "../api/errandsApi";
import {EditErrandForm} from "./EditErrandForm";
import type {ErrandDetails} from "../types/errands";
import {AddPurchaseForm} from "./AddPurchaseForm";

type ErrandDetailsModalProps = {
    errandId: number;
    mode: "view" | "edit";
    onClose: () => void;
    onErrandUpdated: (updatedErrand: ErrandDetails) => void;
};

const formatDate = (iso?: string | null) => {
    if (!iso) return "—";

    return new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
};

const formatDateTime = (iso?: string | null) => {
    if (!iso) return "—";

    return new Date(iso).toLocaleString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const safe = (value?: string | null) =>
    value && value.trim().length > 0 ? value : "—";

const formatMoney = (value?: number | null) => {
    if (value === null || value === undefined) return "—";

    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "SEK",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

const formatHours = (value?: number | null) => {
    if (value === null || value === undefined) return "—";
    return `${value} h`;
};

const hexToRgba = (hex: string, alpha: number) => {
    const normalized = hex.replace("#", "");

    if (!/^[0-9A-Fa-f]{6}$/.test(normalized)) {
        return `rgba(148, 163, 184, ${alpha})`;
    }

    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getPriorityTone = (priority?: ErrandDetails["priority"] | null) => {
    const name = priority?.name ?? "Bevakning";
    const color = priority?.color ?? "#FFFFFF";
    const isWhitePriority = color.toLowerCase() === "#ffffff";

    return {
        name,
        accentStyle: {
            backgroundColor: isWhitePriority ? "#E2E8F0" : color,
        } as CSSProperties,
        badgeStyle: {
            backgroundColor: isWhitePriority ? "#FFFFFF" : hexToRgba(color, 0.12),
            borderColor: isWhitePriority ? "#CBD5E1" : hexToRgba(color, 0.45),
            color: isWhitePriority ? "#0F172A" : color,
        } as CSSProperties,
        valueStyle: {
            color: isWhitePriority ? "#0F172A" : color,
        } as CSSProperties,
        panelStyle: {
            backgroundColor: isWhitePriority ? "#F8FAFC" : hexToRgba(color, 0.06),
        } as CSSProperties,
    };
};

const getProfitTone = (value?: number | null) => {
    const profit = Number(value ?? 0);

    if (profit > 0) {
        return "border-green-200 bg-green-50 text-green-700";
    }

    if (profit < 0) {
        return "border-red-200 bg-red-50 text-red-700";
    }

    return "border-slate-200 bg-slate-50 text-slate-600";
};

const Field = ({
                   label,
                   value,
                   valueStyle,
               }: {
    label: string;
    value: ReactNode;
    valueStyle?: CSSProperties;
}) => (
    <div className="space-y-1">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
        </div>
        <div className="text-sm font-medium text-slate-900" style={valueStyle}>
            {value}
        </div>
    </div>
);

export const ErrandDetailsModal = ({
                                       errandId,
                                       mode,
                                       onClose,
                                       onErrandUpdated,
                                   }: ErrandDetailsModalProps) => {
    const [data, setData] = useState<ErrandDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(mode === "edit");
    const [isAddingPurchase, setIsAddingPurchase] = useState(false);

    const dialogRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setIsEditing(mode === "edit");
    }, [mode, errandId]);

    useEffect(() => {
        let alive = true;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        setIsAddingPurchase(false);

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        const run = async () => {
            try {
                setLoading(true);
                setError(null);

                const result = await fetchErrandById(errandId);

                if (alive) {
                    setData(result);
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
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [errandId, onClose]);

    useEffect(() => {
        dialogRef.current?.focus();
    }, []);

    const priorityUi = useMemo(() => getPriorityTone(data?.priority), [data?.priority]);

    const contactName = data?.contact
        ? `${data.contact.firstName ?? ""} ${data.contact.lastName ?? ""}`.trim()
        : "—";

    const phone = data?.contact?.phoneNumber ?? "—";
    const mail = data?.contact?.mail ?? "—";
    const history = data?.history ?? [];
    const purchases = data?.purchases ?? [];

    const handleSaved = (updatedErrand: ErrandDetails) => {
        setData(updatedErrand);
        setIsEditing(false);
        onErrandUpdated(updatedErrand);
    };

    const reloadErrand = async () => {
        const updated = await fetchErrandById(errandId);
        setData(updated);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
            onClick={onClose}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                tabIndex={-1}
                className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl outline-none"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="h-2 rounded-t-3xl" style={priorityUi.accentStyle}/>

                <div className="p-6 sm:p-8">
                    <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                {isEditing ? "Redigera ärende" : "Ärendedetaljer"}
                            </div>
                            <h2 className="mt-2 text-3xl font-bold text-slate-900">
                                {loading
                                    ? "Laddar ärende..."
                                    : isEditing
                                        ? "Ärenden › Redigera ärende"
                                        : safe(data?.title)}
                            </h2>
                        </div>

                        <button
                            type="button"
                            aria-label="Stäng modal"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-xl text-slate-500 shadow-sm hover:bg-slate-50 hover:text-slate-900"
                            onClick={onClose}
                        >
                            ×
                        </button>
                    </div>

                    {loading ? (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-600">
                            Hämtar detaljer...
                        </div>
                    ) : error ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                            Kunde inte hämta ärendet: {error}
                        </div>
                    ) : !data ? (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-600">
                            Ingen data hittades.
                        </div>
                    ) : isEditing ? (
                        <EditErrandForm
                            errand={data}
                            onCancel={() => setIsEditing(false)}
                            onSaved={handleSaved}
                        />
                    ) : (
                        <div className="space-y-6">
                            <div
                                className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-2 lg:grid-cols-4">
                                <Field label="Datum" value={formatDate(data.createdAt)}/>
                                <Field
                                    label="Ärende ID"
                                    value={String(data.errandId).padStart(3, "0")}
                                />
                                <Field label="Status" value={safe(data.status?.name)}/>
                                <div className="space-y-1">
                                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Prioritet
                                    </div>
                                    <span
                                        className="inline-flex rounded-full border px-3 py-1 text-sm font-semibold"
                                        style={priorityUi.badgeStyle}
                                    >
                                        {priorityUi.name}
                                    </span>
                                </div>
                            </div>

                            <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
                                <div className="space-y-6">
                                    <section
                                        className="rounded-2xl border border-slate-200 p-5"
                                        style={priorityUi.panelStyle}
                                    >
                                        <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                                            Översikt
                                        </h3>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <Field
                                                label="Ansvarig"
                                                value={safe(data.assignee?.name)}
                                                valueStyle={priorityUi.valueStyle}
                                            />
                                            <Field
                                                label="Kund"
                                                value={safe(data.customer?.name)}
                                                valueStyle={priorityUi.valueStyle}
                                            />
                                            <Field label="Namn" value={safe(contactName)}/>
                                            <Field label="Telefonnummer" value={safe(phone)}/>
                                            <Field
                                                label="E-post"
                                                value={
                                                    mail === "—" ? (
                                                        "—"
                                                    ) : (
                                                        <a className="underline" href={`mailto:${mail}`}>
                                                            {mail}
                                                        </a>
                                                    )
                                                }
                                            />
                                        </div>
                                    </section>

                                    <section className="rounded-2xl border border-slate-200 bg-white p-5">
                                        <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                                            Beskrivning
                                        </h3>

                                        <div className="whitespace-pre-wrap text-sm leading-7 text-slate-800">
                                            {safe(data.description)}
                                        </div>
                                    </section>

                                    <section className="rounded-2xl border border-slate-200 bg-white p-5">
                                        <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                                            Inköp
                                        </h3>

                                        {purchases.length === 0 ? (
                                            <div className="text-sm text-slate-500">Inga inköp än.</div>
                                        ) : (
                                            <ul className="space-y-3">
                                                {purchases.map((purchase) => {
                                                    const profit = Number(purchase.profit ?? 0);
                                                    const profitTone = getProfitTone(profit);

                                                    return (
                                                        <li
                                                            key={purchase.purchaseId}
                                                            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                                        >
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div className="min-w-0">
                                                                    <div
                                                                        className="text-sm font-semibold text-slate-900">
                                                                        {safe(purchase.itemName)}
                                                                    </div>
                                                                    <div className="mt-1 text-xs text-slate-500">
                                                                        {purchase.quantity} st
                                                                    </div>
                                                                </div>

                                                                <span
                                                                    className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${profitTone}`}
                                                                >
                                                                    {profit > 0 ? "+" : ""}
                                                                    {formatMoney(profit)}
                                                                </span>
                                                            </div>

                                                            <div
                                                                className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                                                                <div>
                                                                    Inköpspris: {formatMoney(purchase.purchasePrice)}
                                                                </div>
                                                                <div>
                                                                    Frakt: {formatMoney(purchase.shippingCost)}
                                                                </div>
                                                                <div
                                                                    className="font-semibold">Utpris: {formatMoney(purchase.salePrice)}</div>
                                                                <div>
                                                                    Total
                                                                    kostnad: {formatMoney(purchase.totalPurchaseCost)}
                                                                </div>
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </section>

                                    <section className="rounded-2xl border border-slate-200 bg-white p-5">
                                        <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                                            Historik
                                        </h3>

                                        {history.length === 0 ? (
                                            <div className="text-sm text-slate-500">Ingen historik än.</div>
                                        ) : (
                                            <ul className="space-y-4">
                                                {history.map((item, index) => (
                                                    <li
                                                        key={`${item.createdAt}-${index}`}
                                                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                                    >
                                                        <div className="text-sm font-semibold text-slate-900">
                                                            {safe(item.description)}
                                                        </div>
                                                        <div className="mt-2 text-xs text-slate-500">
                                                            {safe(item.verifiedName)} · {formatDateTime(item.createdAt)}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </section>
                                </div>

                                <div className="space-y-6">
                                    <section
                                        className="rounded-2xl border border-slate-200 p-5"
                                        style={priorityUi.panelStyle}
                                    >
                                        <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                                            Ärendeinfo
                                        </h3>

                                        <div className="grid gap-4">
                                            <Field label="Tidsåtgång" value={formatHours(data.timeSpent)}/>
                                            <Field
                                                label="Överenskommet pris"
                                                value={formatMoney(data.agreedPrice)}
                                            />
                                        </div>
                                    </section>

                                    <section className="rounded-2xl border border-slate-200 bg-white p-5">
                                        <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                                            Åtgärder
                                        </h3>

                                        <div className="flex flex-col gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsAddingPurchase((current) => !current)}
                                                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-semibold text-[#E85D5D] shadow-[0_2px_6px_rgba(15,23,42,0.12)] transition hover:bg-slate-50"
                                            >
                                                <span className="mr-2 text-base leading-none text-slate-700">
                                                    {isAddingPurchase ? "–" : "+"}
                                                </span>
                                                {isAddingPurchase ? "Lägg till inköp" : "Lägg till inköp"}
                                            </button>

                                            {isAddingPurchase ? (
                                                <AddPurchaseForm
                                                    errandId={errandId}
                                                    onSaved={async () => {
                                                        await reloadErrand();
                                                        setIsAddingPurchase(false);
                                                    }}
                                                    onCancel={() => setIsAddingPurchase(false)}
                                                />
                                            ) : null}

                                            <button
                                                type="button"
                                                className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                                                onClick={() => setIsEditing(true)}
                                            >
                                                Redigera
                                            </button>

                                            <button
                                                type="button"
                                                className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                                onClick={onClose}
                                            >
                                                Stäng
                                            </button>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};