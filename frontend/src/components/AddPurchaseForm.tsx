import { useState } from "react";
import { addPurchase } from "../api/errandsApi";

type AddPurchaseFormProps = {
    errandId: number;
    onSaved: () => Promise<void> | void;
    onCancel: () => void;
};

export const AddPurchaseForm = ({
                                    errandId,
                                    onSaved,
                                    onCancel,
                                }: AddPurchaseFormProps) => {
    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [purchasePrice, setPurchasePrice] = useState("");
    const [shippingCost, setShippingCost] = useState("0");
    const [salePrice, setSalePrice] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const parsedQuantity = Number(quantity);
    const parsedPurchasePrice = Number(purchasePrice);
    const parsedShippingCost = Number(shippingCost);
    const parsedSalePrice = Number(salePrice);

    const totalPurchaseCost =
        Number.isNaN(parsedQuantity) ||
        Number.isNaN(parsedPurchasePrice) ||
        Number.isNaN(parsedShippingCost)
            ? null
            : parsedQuantity * parsedPurchasePrice + parsedShippingCost;

    const totalSaleValue =
        Number.isNaN(parsedQuantity) || Number.isNaN(parsedSalePrice)
            ? null
            : parsedQuantity * parsedSalePrice;

    const profit =
        totalPurchaseCost === null || totalSaleValue === null
            ? null
            : totalSaleValue - totalPurchaseCost;

    const profitClass =
        profit === null
            ? "text-slate-500"
            : profit > 0
                ? "text-green-700"
                : profit < 0
                    ? "text-red-700"
                    : "text-slate-600";

    const handleSave = async () => {
        setError(null);

        if (!itemName.trim()) {
            setError("Du måste ange vad som köpts.");
            return;
        }

        if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
            setError("Antal måste vara minst 1.");
            return;
        }

        if (Number.isNaN(parsedPurchasePrice) || parsedPurchasePrice < 0) {
            setError("Inköpspris måste vara 0 eller mer.");
            return;
        }

        if (Number.isNaN(parsedShippingCost) || parsedShippingCost < 0) {
            setError("Frakt måste vara 0 eller mer.");
            return;
        }

        if (Number.isNaN(parsedSalePrice) || parsedSalePrice < 0) {
            setError("Utpris måste vara 0 eller mer.");
            return;
        }

        try {
            setLoading(true);

            await addPurchase(errandId, {
                itemName: itemName.trim(),
                quantity: parsedQuantity,
                purchasePrice: parsedPurchasePrice,
                shippingCost: parsedShippingCost,
                salePrice: parsedSalePrice,
            });

            await onSaved();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Kunde inte spara inköpet.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                Nytt inköp
            </h3>

            <div className="space-y-4">
                <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Vad som köpts
                    </label>
                    <input
                        type="text"
                        value={itemName}
                        onChange={(event) => setItemName(event.target.value)}
                        placeholder="Ex. HDMI-kabel"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Antal
                    </label>
                    <input
                        type="number"
                        min="1"
                        step="1"
                        value={quantity}
                        onChange={(event) => setQuantity(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Inköpspris
                    </label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={purchasePrice}
                        onChange={(event) => setPurchasePrice(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Frakt
                    </label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={shippingCost}
                        onChange={(event) => setShippingCost(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Utpris
                    </label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={salePrice}
                        onChange={(event) => setSalePrice(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                    />
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                    <div className="flex items-center justify-between">
                        <span>Total kostnad</span>
                        <span>
                            {totalPurchaseCost === null ? "—" : `${totalPurchaseCost.toFixed(2)} kr`}
                        </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between">
                        <span>Totalt utpris</span>
                        <span>
                            {totalSaleValue === null ? "—" : `${totalSaleValue.toFixed(2)} kr`}
                        </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between font-semibold">
                        <span>Resultat</span>
                        <span className={profitClass}>
                            {profit === null ? "—" : `${profit > 0 ? "+" : ""}${profit.toFixed(2)} kr`}
                        </span>
                    </div>
                </div>

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        type="button"
                        disabled={loading}
                        onClick={handleSave}
                        className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Sparar..." : "Spara inköp"}
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Avbryt
                    </button>
                </div>
            </div>
        </section>
    );
};