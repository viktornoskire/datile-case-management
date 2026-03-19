import { useState, useEffect } from "react";
import { apiClient } from "../services/apiClient";
import * as React from "react";
import axios from "axios";

type Status = {
    statusId: number;
    name: string;
};

export default function NewStatusForm({
                                          setDrawerOpen,
                                          status,
                                      }: {
    setDrawerOpen: (open: boolean) => void;
    status?: Status | null;
}) {
    const [name, setName] = useState(status?.name ?? "");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setName(status?.name ?? "");
    }, [status]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!name.trim()) {
            setError("Ange giltig information...");
            return;
        }

        setError(null);

        try {
            if (status) {
                await apiClient.put(`/api/statuses/${status.statusId}`, {
                    name: name.trim(),
                });
            } else {
                await apiClient.post("/api/statuses", {
                    name: name.trim(),
                });
            }

            setDrawerOpen(false);

        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const status = err.response?.status;

                if (status === 409) {
                    setError("Status finns redan...");
                } else if (status === 400) {
                    setError("Ogiltigt namn...");
                } else if (status === 404) {
                    setError("Status hittades inte...");
                } else {
                    setError("Serverfel...");
                }
            } else {
                setError("Något gick fel...");
            }
        }
    }

    return (
        <div className="w-full sm:w-[380px] bg-white border-l border-slate-200 shadow-xl p-6 overflow-y-auto">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">
                    {status ? "Redigera status" : "Ny status"}
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

            </form>
        </div>
    );
}