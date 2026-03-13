import type {ErrandListItem} from "../types/errands";
import {getPriorityStyles} from "../utils/priorityStyles";

/* React component to show errands in the card view */

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

export const ErrandCard = ({
                               errand,
                               onOpen,
                               onEdit,
                           }: {
    errand: ErrandListItem;
    onOpen: (errandId: number) => void;
    onEdit: (errandId: number) => void;
}) => {
    const prio = getPriorityStyles(errand.priority);
    const {name: priorityName, color, valueStyle, badgeStyle} = prio;

    const customerName = errand.customer?.name ?? "—";
    const assigneeName = errand.assignee?.name ?? "—";
    const contactName = errand.contact
        ? `${errand.contact.firstName} ${errand.contact.lastName}`
        : "—";
    const phone = errand.contact?.phoneNumber ?? "—";
    const mail = errand.contact?.mail ?? "—";

    const history = errand.historyPreview?.slice(0, 2) ?? [];
    const accentColor = color.toLowerCase() === "#ffffff" ? "#E2E8F0" : color;

    return (
        <article
            role="button"
            tabIndex={0}
            className="flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            onClick={() => onOpen(errand.errandId)}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onOpen(errand.errandId);
                }
            }}
        >
            <div className="h-1 w-full" style={{backgroundColor: accentColor}}/>

            <div className="flex h-full flex-col p-3">
                <div className="mb-3 flex items-start justify-between gap-2 border-b border-slate-200 pb-2">
                    <div className="min-w-0">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                            Ärende
                        </div>

                        <h3 className="mt-1 line-clamp-2 text-base font-bold leading-5 text-slate-900">
                            {safe(errand.title)}
                        </h3>
                    </div>

                    <span
                        className="shrink-0 rounded-full border px-3 py-1 text-sm font-semibold"
                        style={badgeStyle}
                    >
                        {priorityName}
                    </span>
                </div>

                <div className="grid flex-1 gap-2 lg:grid-cols-[1fr_0.52fr]">
                    <div className="space-y-2">
                        <section className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                            <div className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                                Översikt
                            </div>

                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="font-semibold text-slate-500">Beskrivning: </span>
                                    <span className="font-medium text-slate-900">
                                        {safe(errand.description)}
                                    </span>
                                </div>

                                <div>
                                    <span className="font-semibold text-slate-500">Ansvarig: </span>
                                    <span className="font-medium" style={valueStyle}>
                                        {safe(assigneeName)}
                                    </span>
                                </div>

                                <div>
                                    <span className="font-semibold text-slate-500">Kund: </span>
                                    <span className="font-medium" style={valueStyle}>
                                        {safe(customerName)}
                                    </span>
                                </div>

                                <div>
                                    <span className="font-semibold text-slate-500">Namn: </span>
                                    <span className="font-medium text-slate-900">
                                        {safe(contactName)}
                                    </span>
                                </div>

                                <div>
                                    <span className="font-semibold text-slate-500">Telefonnummer: </span>
                                    <span className="font-medium text-slate-900">
                                        {safe(phone)}
                                    </span>
                                </div>

                                <div>
                                    <span className="font-semibold text-slate-500">E-post: </span>
                                    {mail === "—" ? (
                                        <span className="font-medium text-slate-900">—</span>
                                    ) : (
                                        <a
                                            className="font-medium underline decoration-slate-300 underline-offset-2"
                                            href={`mailto:${mail}`}
                                            style={valueStyle}
                                        >
                                            {mail}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className="rounded-xl border border-slate-200 bg-white p-2">
                            <div className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                                Historik
                            </div>

                            {history.length === 0 ? (
                                <div className="text-sm text-slate-500">Ingen historik än.</div>
                            ) : (
                                <ul className="space-y-2">
                                    {history.map((h, index) => (
                                        <li
                                            key={index}
                                            className="rounded-xl border border-slate-200 bg-slate-50 p-2"
                                        >
                                            <div className="text-sm font-semibold text-slate-900">
                                                {h.description}
                                            </div>
                                            <div className="mt-1 text-xs text-slate-500">
                                                {h.verifiedName} · {formatDateTime(h.createdAt)}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </div>

                    <div className="space-y-2">
                        <section className="rounded-xl border border-slate-200 bg-slate-50 p-2">
                            <div className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                                Ärende info
                            </div>

                            <div className="space-y-3 text-sm">
                                <div>
                                    <div className="font-semibold text-slate-500">Datum</div>
                                    <div className="font-medium text-slate-900">
                                        {formatDate(errand.createdAt)}
                                    </div>
                                </div>

                                <div>
                                    <div className="font-semibold text-slate-500">Ärende ID</div>
                                    <div className="font-medium text-slate-900">
                                        {String(errand.errandId).padStart(3, "0")}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                <div className="mt-auto flex justify-end">
                    <button
                        type="button"
                        className="rounded-full border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
                        onClick={(event) => {
                            event.stopPropagation();
                            onEdit(errand.errandId);
                        }}
                    >
                        Redigera
                    </button>
                </div>
            </div>
        </article>
    );
};