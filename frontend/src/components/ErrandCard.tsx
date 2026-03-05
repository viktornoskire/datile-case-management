import type {ErrandListItem} from "../types/errands";
import {useNavigate} from "react-router-dom";
import { getPriorityStyles } from "../utils/priorityStyles";

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {year: "numeric", month: "2-digit", day: "2-digit"});

const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });

const safe = (v?: string | null) => (v && v.trim().length > 0 ? v : "—");

export const ErrandCard = ({errand}: { errand: ErrandListItem }) => {
    const navigate = useNavigate();
    const prio = getPriorityStyles(errand.priority);
    const { name: priorityName, cardStyle, valueStyle, badgeStyle } = prio;

    const customerName = errand.customer?.name ?? "—";
    const assigneeName = errand.assignee?.name ?? "—";
    const contactName = errand.contact ? `${errand.contact.firstName} ${errand.contact.lastName}` : "—";
    const phone = errand.contact?.phoneNumber ?? "—";
    const mail = errand.contact?.mail ?? "—";

    const history = errand.historyPreview?.slice(0, 2) ?? [];

    return (
        <article className="rounded-2xl shadow-sm p-4 text-base" style={cardStyle}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <div className="space-y-2">
                    <div>
                        <span className="font-semibold text-slate-900">Titel: </span>
                        <span className="font-semibold" style={valueStyle}>{safe(errand.title)}</span>
                    </div>

                    <div>
                        <span className="font-semibold text-slate-900">Beskrivning: </span>
                        <span className="font-semibold" style={valueStyle}>{safe(errand.description)}</span>
                    </div>

                    <div>
                        <span className="font-semibold text-slate-900">Ansvarig: </span>
                        <span className="font-semibold" style={valueStyle}>
              {safe(assigneeName)}
            </span>
                    </div>

                    <div>
                        <span className="font-semibold text-slate-900">Kund: </span>
                        <span className="font-semibold" style={valueStyle}>
              {safe(customerName)}
            </span>
                    </div>

                    <div>
                        <span className="font-semibold text-slate-900">Namn: </span>
                        <span className="font-semibold" style={valueStyle}>
              {safe(contactName)}
            </span>
                    </div>

                    <div>
                        <span className="font-semibold text-slate-900">Telefonnummer: </span>
                        <span className="font-semibold" style={valueStyle}>
              {safe(phone)}
            </span>
                    </div>

                    <div>
                        <span className="font-semibold text-slate-900">E-post: </span>
                        {mail === "—" ? (
                            <span className="font-semibold" style={valueStyle}>
                —
              </span>
                        ) : (
                            <a className="font-semibold underline" style={valueStyle} href={`mailto:${mail}`}>
                                {mail}
                            </a>
                        )}
                    </div>
                </div>

                <div className="space-y-2 text-right">
                    <div>
                        <span className="font-semibold text-slate-900">Datum: </span>
                        <span className="font-semibold text-slate-900">{formatDate(errand.createdAt)}</span>
                    </div>

                    <div>
                        <span className="font-semibold text-slate-900">Ärende ID: </span>
                        <span className="font-semibold text-slate-900">{String(errand.errandId).padStart(3, "0")}</span>
                    </div>

                    <div className="mt-2 flex justify-end">
            <span className="rounded-full border px-3 py-1 text-sm font-semibold" style={badgeStyle}>
              {priorityName}
            </span>
                    </div>
                </div>
            </div>

            <div className="mt-3">
                <div className="text-base font-semibold text-slate-900 underline">Historik</div>

                <div className="mt-2 rounded-xl bg-white/70 p-3 shadow-inner">
                    {history.length === 0 ? (
                        <div className="text-sm text-slate-700">Ingen historik än.</div>
                    ) : (
                        <ul className="space-y-2 text-sm text-slate-900">
                            {history.map((h, i) => (
                                <li key={i}>
                                    <div>– {h.description}</div>
                                    <div className="text-slate-700">
                                        ✓ {h.verifiedName} <span className="ml-2">{formatDateTime(h.createdAt)}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="mt-4 flex justify-end">
                <button
                    className="rounded-full bg-emerald-300 px-6 py-2 text-sm font-semibold text-emerald-950 shadow-sm hover:bg-emerald-400"
                    onClick={() => navigate(`/errands/${errand.errandId}`)}
                >
                    Visa mer
                </button>
            </div>
        </article>
    );
};