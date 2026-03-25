import {useContext, useEffect, useState} from "react";
import { apiClient } from "../services/apiClient";
import { NewStatusForm, NewPriorityForm } from "../components";
import {AuthContext} from "../components/AuthProvider.tsx";

type Status = {
    statusId: number;
    name: string;
};

type Priority = {
    priorityId: number;
    name: string;
    color: string;
    isDefault: boolean;
};

export default function Settings() {
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [priorities, setPriorities] = useState<Priority[]>([]);

    const [statusLoading, setStatusLoading] = useState(true);
    const [priorityLoading, setPriorityLoading] = useState(true);

    const [statusError, setStatusError] = useState<string | null>(null);
    const [priorityError, setPriorityError] = useState<string | null>(null);

    const [statusDrawerOpen, setStatusDrawerOpen] = useState(false);
    const [editingStatus, setEditingStatus] = useState<Status | null>(null);

    const [priorityDrawerOpen, setPriorityDrawerOpen] = useState(false);
    const [editingPriority, setEditingPriority] = useState<Priority | null>(null);

    // STATUS FETCH
    useEffect(() => {
        async function loadStatuses() {
            setStatusLoading(true);
            setStatusError(null);

            try {
                const res = await apiClient.get<Status[]>("/api/statuses");
                setStatuses(res);
            } catch (err) {
                setStatusError("Kunde inte hämta statusar.");
            } finally {
                setStatusLoading(false);
            }
        }

        loadStatuses();
    }, [statusDrawerOpen]);

    // PRIORITY FETCH
    useEffect(() => {
        async function loadPriorities() {
            setPriorityLoading(true);
            setPriorityError(null);

            try {
                const res = await apiClient.get<Priority[]>("/api/priorities");
                setPriorities(res);
            } catch (err) {
                setPriorityError("Kunde inte hämta prioriteter.");
            } finally {
                setPriorityLoading(false);
            }
        }

        loadPriorities();
    }, [priorityDrawerOpen]);

    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const authContext = useContext(AuthContext);

    useEffect(() => {
        if (authContext?.role === "ADMIN") {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, []);

    return (
        <div className="min-h-screen bg-stone-100 px-4 py-8 space-y-8">

            {/* STATUS */}
            <div className="max-w-6xl mx-auto">

                <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Status</h2>
                        <p className="text-sm text-slate-500">
                            Status används för att beskriva var ärendet befinner sig.
                        </p>
                    </div>


                    {isAdmin && (
                        <button
                            onClick={() => {
                                setEditingStatus(null);
                                setStatusDrawerOpen(true);
                            }}
                            className="rounded-full bg-[#0A1633] px-5 py-2 text-sm font-semibold text-white hover:bg-[#13224A]"
                        >
                            Ny status
                        </button>
                    )}

                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    {statusLoading ? (
                        <div className="px-6 py-8 text-center text-slate-500">
                            Laddar statusar...
                        </div>
                    ) : statusError ? (
                        <div className="px-6 py-8 text-center text-red-600 font-medium">
                            {statusError}
                        </div>
                    ) : statuses.length === 0 ? (
                        <div className="px-6 py-8 text-center text-slate-500">
                            Inga statusar hittades.
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-200">
                            {statuses.map((status) => (
                                <li
                                    key={status.statusId}
                                    className="flex items-center justify-between px-6 py-4"
                                >
                                    <span className="font-medium text-slate-800">
                                        {status.name}
                                    </span>

                                    {isAdmin && (
                                        <button
                                            onClick={() => {
                                                setEditingStatus(status);
                                                setStatusDrawerOpen(true);
                                            }}
                                            className="rounded-full border px-4 py-1.5 text-sm hover:bg-slate-100"
                                        >
                                            Redigera
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* PRIORITIES */}
            <div className="max-w-6xl mx-auto">

                <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Prioritet</h2>
                        <p className="text-sm text-slate-500">
                            Prioritet används för att visa hur brådskande ett ärende är.
                        </p>
                    </div>

                    {isAdmin && (
                        <button
                            onClick={() => {
                                setEditingPriority(null);
                                setPriorityDrawerOpen(true);
                            }}
                            className="rounded-full bg-[#0A1633] px-5 py-2 text-sm font-semibold text-white hover:bg-[#13224A]"
                        >
                            Ny prioritet
                        </button>
                    )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

                    {priorityLoading ? (
                        <div className="px-6 py-8 text-center text-slate-500">
                            Laddar prioriteter...
                        </div>
                    ) : priorityError ? (
                        <div className="px-6 py-8 text-center text-red-600 font-medium">
                            {priorityError}
                        </div>
                    ) : priorities.length === 0 ? (
                        <div className="px-6 py-8 text-center text-slate-500">
                            Inga prioriteter hittades.
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-[2fr_1fr_1fr_120px] gap-4 bg-slate-100 px-6 py-3 text-[11px] font-semibold uppercase text-slate-500 border-b border-slate-200">
                                <div>Namn</div>
                                <div>Färg</div>
                                <div>Standard</div>
                                <div className="text-right">Åtgärd</div>
                            </div>

                            <ul className="divide-y divide-slate-200">
                                {priorities.map((p) => (
                                    <li
                                        key={p.priorityId}
                                        className="grid grid-cols-[2fr_1fr_1fr_120px] gap-4 items-center px-6 py-4"
                                    >
                                        <div className={`text-slate-800 ${p.isDefault ? "font-bold" : "font-medium"}`}>
                                            {p.name}
                                        </div>

                                        <div>
                                            <span
                                                className="text-sm font-semibold px-3 py-1.5 rounded-full"
                                                style={{
                                                    backgroundColor: `${p.color}20`,
                                                    color: p.color,
                                                }}
                                            >
                                                {p.color}
                                            </span>
                                        </div>

                                        <div className="text-base font-medium text-slate-800">
                                            {p.isDefault ? "Ja" : "Nej"}
                                        </div>

                                        <div className="text-right">
                                            {isAdmin && (
                                                <button
                                                    onClick={() => {
                                                        setEditingPriority(p);
                                                        setPriorityDrawerOpen(true);
                                                    }}
                                                    className="rounded-full border px-4 py-1.5 text-sm hover:bg-slate-100"
                                                >
                                                    Redigera
                                                </button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>

            {/* DRAWERS (unchanged) */}
            {statusDrawerOpen && (
                <div className="fixed inset-0 z-40 flex">
                    <div
                        onClick={() => setStatusDrawerOpen(false)}
                        className="flex-1 bg-black/30"
                    />
                    <NewStatusForm
                        setDrawerOpen={setStatusDrawerOpen}
                        status={editingStatus}
                    />
                </div>
            )}

            {priorityDrawerOpen && (
                <div className="fixed inset-0 z-40 flex">
                    <div
                        onClick={() => setPriorityDrawerOpen(false)}
                        className="flex-1 bg-black/30"
                    />
                    <NewPriorityForm
                        setDrawerOpen={setPriorityDrawerOpen}
                        priority={editingPriority}
                    />
                </div>
            )}
        </div>
    );
}