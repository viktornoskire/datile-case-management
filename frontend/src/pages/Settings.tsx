import { useEffect, useState } from "react";
import { apiClient } from "../services/apiClient";
import { NewStatusForm, NewPriorityForm } from "../components";

type Status = {
    statusId: number;
    name: string;
};

type Priority = {
    priorityId: number;
    name: string;
    color: string;
    bold: boolean;
};

export default function Settings() {
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [priorities, setPriorities] = useState<Priority[]>([]);
    const [statusDrawerOpen, setStatusDrawerOpen] = useState(false);
    const [editingStatus, setEditingStatus] = useState<Status | null>(null);
    const [priorityDrawerOpen, setPriorityDrawerOpen] = useState(false);
    const [editingPriority, setEditingPriority] = useState<Priority | null>(null);

    useEffect(() => {
        apiClient.get<Status[]>("/api/statuses").then(setStatuses);
    }, [statusDrawerOpen]);

    useEffect(() => {
        apiClient.get<Priority[]>("/api/priorities").then(setPriorities);
    }, [priorityDrawerOpen]);

    return (
        <div className="min-h-screen bg-stone-100 px-4 py-8 space-y-8">

            {/* STATUS */}
            <div className="max-w-6xl mx-auto">

                {/* HEADER CARD */}
                <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Status</h2>
                        <p className="text-sm text-slate-500">
                            Status används för att beskriva var ärendet befinner sig.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setEditingStatus(null);
                            setStatusDrawerOpen(true);
                        }}
                        className="rounded-full bg-[#0A1633] px-5 py-2 text-sm font-semibold text-white hover:bg-[#13224A]"
                    >
                        Ny status
                    </button>
                </div>

                {/* LIST CARD */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <ul className="divide-y divide-slate-200">
                        {statuses.map((status) => (
                            <li
                                key={status.statusId}
                                className="flex items-center justify-between px-6 py-4"
                            >
                                <span className="font-medium text-slate-800">
                                    {status.name}
                                </span>

                                <button
                                    onClick={() => {
                                        setEditingStatus(status);
                                        setStatusDrawerOpen(true);
                                    }}
                                    className="rounded-full border px-4 py-1.5 text-sm hover:bg-slate-100"
                                >
                                    Redigera
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* PRIORITIES */}
            <div className="max-w-6xl mx-auto">

                {/* HEADER CARD */}
                <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Prioritet</h2>
                        <p className="text-sm text-slate-500">
                            Prioritet används för att visa hur brådskande ett ärende är.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setEditingPriority(null);
                            setPriorityDrawerOpen(true);
                        }}
                        className="rounded-full bg-[#0A1633] px-5 py-2 text-sm font-semibold text-white hover:bg-[#13224A]"
                    >
                        Ny prioritet
                    </button>
                </div>

                {/* TABLE CARD */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

                    {/* HEADER ROW */}
                    <div className="grid grid-cols-[2fr_1fr_1fr_120px] gap-4 bg-slate-100 px-6 py-3 text-[11px] font-semibold uppercase text-slate-500 border-b border-slate-200">
                        <div>Namn</div>
                        <div>Färg</div>
                        <div>Fetstil</div>
                        <div className="text-right">Åtgärd</div>
                    </div>

                    <ul className="divide-y divide-slate-200">
                        {priorities.map((p) => (
                            <li
                                key={p.priorityId}
                                className="grid grid-cols-[2fr_1fr_1fr_120px] gap-4 items-center px-6 py-4"
                            >
                                {/* NAME */}
                                <div
                                    className={`text-slate-800 ${
                                        p.bold ? "font-bold" : "font-medium"
                                    }`}
                                >
                                    {p.name}
                                </div>

                                {/* COLOR BADGE */}
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

                                {/* BOLD */}
                                <div className="text-base font-medium text-slate-800">
                                    {p.bold ? "Ja" : "Nej"}
                                </div>

                                {/* ACTION */}
                                <div className="text-right">
                                    <button
                                        onClick={() => {
                                            setEditingPriority(p);
                                            setPriorityDrawerOpen(true);
                                        }}
                                        className="rounded-full border px-4 py-1.5 text-sm hover:bg-slate-100"
                                    >
                                        Redigera
                                    </button>
                                </div>
                            </li>

                        ))}
                    </ul>
                </div>
            </div>
            {statusDrawerOpen && (
                <div className="fixed inset-0 z-40 flex">

                    {/* BACKDROP */}
                    <div
                        onClick={() => setStatusDrawerOpen(false)}
                        className="flex-1 bg-black/30"
                    />

                    {/* DRAWER */}
                    <NewStatusForm
                        setDrawerOpen={setStatusDrawerOpen}
                        status={editingStatus}
                    />
                </div>
            )}
            {priorityDrawerOpen && (
                <div className="fixed inset-0 z-40 flex">

                    {/* BACKDROP */}
                    <div
                        onClick={() => setPriorityDrawerOpen(false)}
                        className="flex-1 bg-black/30"
                    />

                    {/* DRAWER */}
                    <NewPriorityForm
                        setDrawerOpen={setPriorityDrawerOpen}
                        priority={editingPriority}
                    />
                </div>
            )}
        </div>
    );
}