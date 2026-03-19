import { useState, useEffect } from "react";
import { apiClient } from "../services/apiClient";
import * as React from "react";
import {ApiError} from "../services/apiError.ts";

type Priority = {
    priorityId: number;
    name: string;
    color: string;
    isDefault: boolean;
};

export default function NewPriorityForm({
                                            setDrawerOpen,
                                            priority,
                                        }: {
    setDrawerOpen: (open: boolean) => void;
    priority?: Priority | null;
}) {
    const [name, setName] = useState(priority?.name ?? "");
    const [color, setColor] = useState(priority?.color ?? "#000000");
    const [isDefault, setIsDefault] = useState(priority?.isDefault ?? false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setName(priority?.name ?? "");
        setColor(priority?.color ?? "#000000");
        setIsDefault(priority?.isDefault ?? false);
    }, [priority]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!name.trim()) {
            setError("Ange giltig information...");
            return;
        }

        setError(null);

        try {
            if (priority) {
                await apiClient.put(`/api/priorities/${priority.priorityId}`, {
                    name: name.trim(),
                    color,
                    isDefault,
                });
            } else {
                await apiClient.post("/api/priorities", {
                    name: name.trim(),
                    color,
                    isDefault,
                });
            }

            setDrawerOpen(false);

        }  catch (err: unknown) {
            if (err instanceof ApiError) {
                if (err.status === 409) {
                    setError("Prioritet finns redan...");
                } else if (err.status === 400) {
                    setError("Ogiltigt namn...");
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
                    {priority ? "Redigera prioritet" : "Ny prioritet"}
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

                {/* COLOR */}
                <div>
                    <label className="text-sm text-slate-600">
                        Färg
                    </label>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="mt-1 w-full h-10 rounded border border-[#d2d2d2]"
                    />
                </div>

                {/* BOLD TOGGLE */}
                <div className="flex items-center justify-between">
                    <label className="text-sm text-slate-600">
                        Standard
                    </label>

                    <button
                        type="button"
                        onClick={() => setIsDefault(!isDefault)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                            isDefault ? "bg-[#0A1633]" : "bg-slate-300"
                        }`}
                    >
        <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                isDefault ? "translate-x-6" : "translate-x-1"
            }`}
        />
                    </button>
                </div>

                {/* PREVIEW (nice touch 🔥) */}
                <div className="text-sm">
                    <span
                        className={`px-2 py-1 rounded ${
                            isDefault ? "font-bold" : ""
                        }`}
                        style={{
                            backgroundColor: `${color}20`,
                            color: color,
                        }}
                    >
                        {name || "Förhandsvisning"}
                    </span>
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