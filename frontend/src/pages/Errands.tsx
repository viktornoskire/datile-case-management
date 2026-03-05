import { useEffect, useState } from "react";
import { fetchErrands } from "../api/errandsApi";
import { ErrandCard } from "../components/ErrandCard";
import type { ErrandsResponse } from "../types/errands";

/* Representation component for an errand card */

export default function Errands() {
    const [data, setData] = useState<ErrandsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [view, setView] = useState<"cards" | "list">("cards");

    useEffect(() => {
        let alive = true;

        const run = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetchErrands({
                    page: 0,
                    size: 20,
                    sortBy: "date",
                    sortDir: "desc",
                    statusIds: [1, 2],
                });

                if (alive) setData(res);
            } catch (e) {
                if (!alive) return;
                setError(e instanceof Error ? e.message : "Unknown error");
            } finally {
                if (alive) setLoading(false);
            }
        };

        void run();
        return () => {
            alive = false;
        };
    }, []);

    if (loading) return <div className="p-6">Laddar ärenden…</div>;
    if (error) return <div className="p-6 text-red-600">Fel: {error}</div>;
    if (!data || data.errands.length === 0) return <div className="p-6">Inga ärenden hittades.</div>;

    return (
        <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-xl font-bold">Ärenden</h1>

                <div className="inline-flex rounded-full border bg-white p-1 shadow-sm">
                    <button
                        className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                            view === "list" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                        }`}
                        onClick={() => setView("list")}
                    >
                        Lista
                    </button>
                    <button
                        className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                            view === "cards" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                        }`}
                        onClick={() => setView("cards")}
                    >
                        Kort
                    </button>
                </div>
            </div>

            {view === "cards" ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {data.errands.map((e) => (
                        <ErrandCard key={e.errandId} errand={e} />
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {data.errands.map((e) => (
                        <div key={e.errandId} className="rounded-xl border bg-white p-3 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="font-semibold">{e.title}</div>
                                <div className="text-sm text-slate-600">{e.status.name}</div>
                            </div>
                            <div className="mt-1 text-xs text-slate-500">ID #{e.errandId}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}