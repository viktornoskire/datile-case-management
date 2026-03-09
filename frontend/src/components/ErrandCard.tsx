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
                           }: {
    errand: ErrandListItem;
    onOpen: (errandId: number) => void;
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
            className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="h-1.5 w-full" style={{backgroundColor: accentColor}}/>

            <div className="flex h-full flex-col p-5">
                <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
                    <div className="min-w-0">
                        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                            Ärende
                        </div>

                        <h3 className="mt-2 line-clamp-2 text-lg font-bold text-slate-900">
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

                <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-4">
                        <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
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

                        <section className="rounded-xl border border-slate-200 bg-white p-4">
                            <div className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                                Historik
                            </div>

                            {history.length === 0 ? (
                                <div className="text-sm text-slate-500">Ingen historik än.</div>
                            ) : (
                                <ul className="space-y-3">
                                    {history.map((h, index) => (
                                        <li
                                            key={index}
                                            className="rounded-xl border border-slate-200 bg-slate-50 p-3"
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

                    <div className="space-y-4">
                        <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
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

                <div className="mt-auto flex justify-end pt-5">
                    <button
                        type="button"
                        className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                        onClick={() => onOpen(errand.errandId)}
                    >
                        Visa mer
                    </button>
                </div>
            </div>
        </article>
    );
};