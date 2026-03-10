import {useEffect, useState} from "react";
import {fetchErrands} from "../api/errandsApi";
import {ErrandCard} from "../components/ErrandCard";
import type {ErrandsResponse, ErrandDetails} from "../types/errands";
import {ErrandListRow} from "../components/ErrandListRow";
import {ErrandDetailsModal} from "../components/ErrandDetailsModal";

/* React component for an errand card */

export default function Errands() {
    const [data, setData] = useState<ErrandsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<"cards" | "list">("cards");
    const [selectedErrandId, setSelectedErrandId] = useState<number | null>(null);
    const openModal = (errandId: number) => {
        setSelectedErrandId(errandId);
    };

    const closeModal = () => {
        setSelectedErrandId(null);
    };

    const handleErrandUpdated = (updatedErrand: ErrandDetails) => {
        setData((current) => {
            if (!current) return current;

            return {
                ...current,
                errands: current.errands.map((errand) =>
                    errand.errandId === updatedErrand.errandId
                        ? {
                            ...errand,
                            title: updatedErrand.title,
                            description: updatedErrand.description,
                            status: updatedErrand.status,
                            priority: updatedErrand.priority,
                            assignee: updatedErrand.assignee,
                            customer: updatedErrand.customer,
                            contact: updatedErrand.contact,
                            historyPreview: updatedErrand.history?.slice(0, 2) ?? [],
                        }
                        : errand,
                ),
            };
        });
    };

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
        <div className="min-h-screen bg-stone-100 p-6">
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
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                    {data.errands.map((e) => (
                        <ErrandCard key={e.errandId} errand={e} onOpen={openModal}/>
                    ))}
                </div>
            ) : (
                <ul className="m-0 list-none space-y-3 p-0">
                    {data.errands.map((e) => (
                        <li key={e.errandId}>
                            <ErrandListRow errand={e} onOpen={openModal}/>
                        </li>
                    ))}
                </ul>
            )}

            {selectedErrandId !== null && (
                <ErrandDetailsModal
                    errandId={selectedErrandId}
                    onClose={closeModal}
                    onErrandUpdated={handleErrandUpdated}
                />
            )}
        </div>
    );
}