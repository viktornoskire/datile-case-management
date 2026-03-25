import { useEffect, useState } from "react";
import { apiClient } from "../services/apiClient";
import type { Assignee } from "../types/users";
import * as React from "react";
import {ApiError} from "../services/apiError.ts";

export default function NewAssigneeForm({
                                            setDrawerOpen,
                                            assignee,
                                        }: {
    setDrawerOpen: (open: boolean) => void;
    assignee?: Assignee | null;
}) {
    const [name, setName] = useState(assignee?.name ?? "");
    const [error, setError] = useState<string | null>(null);

    // sync when editing different assignees
    useEffect(() => {
        setName(assignee?.name ?? "");
    }, [assignee]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!name.trim()) {
            setError("Ange giltig information...");
            return;
        }

        setError(null);

        try {
            if (assignee) {
                await apiClient.put(
                    `/api/assignees/${assignee.assigneeId}`,
                    {
                        name: name.trim().toLowerCase()
                    }
                );
            } else {
                await apiClient.post("/api/assignees", {
                    name: name.trim().toLowerCase(),
                });
            }

            setDrawerOpen(false);

        } catch (error: unknown) {
            if (error instanceof ApiError) {
                if (error.status === 409) {
                    setError("Ansvarig finns redan...");
                } else if (error.status === 400) {
                    setError("Ogiltigt namn...");
                } else if (error.status === 403) {
                    setError("Du har inte rätt behörigheter...")
                } else if (error.status === 404) {
                    setError("Kunde inte hitta ansvarig...")
                } else {
                    setError("Serverfel...");
                }
            } else {
                setError("Något gick fel...");
            }
        }
    }

    return (
        <div className="w-[400px] bg-white p-6 shadow-xl">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">
                    {assignee ? "Redigera ansvarig" : "Ny ansvarig"}
                </h2>

                <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="text-slate-500 hover:text-slate-800 text-lg"
                >
                    ✕
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* ERROR */}
                <p className="text-red-600 font-semibold text-xs">
                    {error}
                </p>

                {/* NAME */}
                <div>
                    <label className="text-sm text-slate-600">
                        Namn
                    </label>
                    <input
                        value={name}
                        onChange={(e) => {
                            setError(null);
                            setName(e.target.value);
                        }}
                        className="mt-1 w-full rounded-full border border-[#d2d2d2] px-3 py-2 text-sm"
                    />
                </div>

                {/* SAVE */}
                <button
                    type="submit"
                    className="mt-6 w-full rounded-full bg-[#99D0B6] py-2 text-white font-semibold hover:bg-[#85bfa7]"
                >
                    Spara
                </button>
                {assignee && (
                    <button
                        type="button"
                        onClick={async () => {
                            if (!confirm("Är du säker på att du vill ta bort ansvarig?")) return;

                            try {
                                await apiClient.delete(`/api/assignees/${assignee.assigneeId}`);
                                setDrawerOpen(false);
                            } catch (err) {
                                setError("Kunde inte ta bort ansvarig...");
                            }
                        }}
                        className="w-full mt-2 text-red-600 text-sm font-semibold hover:underline"
                    >
                        Ta bort ansvarig
                    </button>
                )}

            </form>
        </div>
    );
}