import { useEffect, useRef, useState } from "react";
import { addPurchase, updatePurchase } from "../api/errandsApi";
import type { ErrandDetails } from "../types/errands";

type PurchaseItem = NonNullable<ErrandDetails["purchases"]>[number];

type AddPurchaseFormProps = {
    errandId: number;
    onSaved: () => Promise<void> | void;
    onCancel: () => void;
    purchaseToEdit?: PurchaseItem | null;
};

const formatMoney = (value: number | null) => {
    if (value === null || Number.isNaN(value)) return "—";
    return `${value.toFixed(2)} kr`;
};

export const AddPurchaseForm = ({
                                    errandId,
                                    onSaved,
                                    onCancel,
                                    purchaseToEdit = null,
                                }: AddPurchaseFormProps) => {
    const isEditMode = purchaseToEdit !== null;

    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [unitPurchasePrice, setUnitPurchasePrice] = useState("");
    const [shippingCost, setShippingCost] = useState("0");
    const [unitCustomerPrice, setUnitCustomerPrice] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isHighlighted, setIsHighlighted] = useState(true);

    const containerRef = useRef<HTMLElement | null>(null);
    const firstInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (purchaseToEdit) {
            setItemName(purchaseToEdit.itemName ?? "");
            setQuantity(String(purchaseToEdit.quantity ?? 1));
            setUnitPurchasePrice(
                purchaseToEdit.purchasePrice != null
                    ? String(purchaseToEdit.purchasePrice)
                    : "",
            );
            setShippingCost(
                purchaseToEdit.shippingCost != null
                    ? String(purchaseToEdit.shippingCost)
                    : "0",
            );
            setUnitCustomerPrice(
                purchaseToEdit.salePrice != null
                    ? String(purchaseToEdit.salePrice)
                    : "",
            );
        } else {
            setItemName("");
            setQuantity("1");
            setUnitPurchasePrice("");
            setShippingCost("0");
            setUnitCustomerPrice("");
        }
    }, [purchaseToEdit]);

    useEffect(() => {
        containerRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
        });

        const focusTimer = window.setTimeout(() => {
            firstInputRef.current?.focus();
        }, 250);

        const highlightTimer = window.setTimeout(() => {
            setIsHighlighted(false);
        }, 1800);

        return () => {
            window.clearTimeout(focusTimer);
            window.clearTimeout(highlightTimer);
        };
    }, []);

    const parsedQuantity = Number(quantity);
    const parsedUnitPurchasePrice = Number(unitPurchasePrice);
    const parsedShippingCost = Number(shippingCost);
    const parsedUnitCustomerPrice = Number(unitCustomerPrice);

    const isValidQuantity =
        Number.isInteger(parsedQuantity) && parsedQuantity > 0;

    const isValidUnitPurchasePrice =
        !Number.isNaN(parsedUnitPurchasePrice) && parsedUnitPurchasePrice >= 0;

    const isValidShippingCost =
        !Number.isNaN(parsedShippingCost) && parsedShippingCost >= 0;

    const isValidUnitCustomerPrice =
        !Number.isNaN(parsedUnitCustomerPrice) && parsedUnitCustomerPrice >= 0;

    const totalPurchaseAmount =
        isValidQuantity && isValidUnitPurchasePrice
            ? parsedUnitPurchasePrice * parsedQuantity
            : null;

    const totalCostForUs =
        totalPurchaseAmount !== null && isValidShippingCost
            ? totalPurchaseAmount + parsedShippingCost
            : null;

    const totalPriceForCustomer =
        isValidQuantity && isValidUnitCustomerPrice
            ? parsedUnitCustomerPrice * parsedQuantity
            : null;

    const profit =
        totalCostForUs !== null && totalPriceForCustomer !== null
            ? totalPriceForCustomer - totalCostForUs
            : null;

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

        if (!isValidQuantity) {
            setError("Antal måste vara minst 1.");
            return;
        }

        if (!isValidUnitPurchasePrice) {
            setError("Kostnad per styck måste vara 0 eller mer.");
            return;
        }

        if (!isValidShippingCost) {
            setError("Frakt måste vara 0 eller mer.");
            return;
        }

        if (!isValidUnitCustomerPrice) {
            setError("Pris till kund per styck måste vara 0 eller mer.");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                itemName: itemName.trim(),
                quantity: parsedQuantity,
                purchasePrice: parsedUnitPurchasePrice,
                shippingCost: parsedShippingCost,
                salePrice: parsedUnitCustomerPrice,
            };

            if (isEditMode && purchaseToEdit) {
                await updatePurchase(purchaseToEdit.purchaseId, payload);
            } else {
                await addPurchase(errandId, payload);
            }

            await onSaved();
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : isEditMode
                        ? "Kunde inte uppdatera inköpet."
                        : "Kunde inte spara inköpet.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            ref={containerRef}
            className={[
                "rounded-2xl bg-white p-5 transition-all duration-500",
                isHighlighted
                    ? "border border-[#99D0B6] ring-4 ring-[#99D0B6]/25 shadow-sm"
                    : "border border-slate-200",
            ].join(" ")}
        >
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                {isEditMode ? "Redigera inköp" : "Nytt inköp"}
            </h3>

            <div className="space-y-4">
                <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Ange inköp
                    </label>
                    <input
                        ref={firstInputRef}
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
                        Kostnad per styck
                    </label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={unitPurchasePrice}
                        onChange={(event) => setUnitPurchasePrice(event.target.value)}
                        placeholder="Ex. 450"
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
                        Pris till kund per styck
                    </label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={unitCustomerPrice}
                        onChange={(event) => setUnitCustomerPrice(event.target.value)}
                        placeholder="Ex. 799"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                    />
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                    <div className="mt-1 flex items-center justify-between">
                        <span>Total kostnad:</span>
                        <span>{formatMoney(totalCostForUs)}</span>
                    </div>

                    <div className="flex items-center justify-between font-light">
                        <span>Kostnad/st:</span>
                        <span>
                            {isValidUnitPurchasePrice
                                ? formatMoney(parsedUnitPurchasePrice)
                                : "—"}
                        </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between font-light">
                        <span>Totalpris till kund:</span>
                        <span>{formatMoney(totalPriceForCustomer)}</span>
                    </div>

                    <div className="mt-1 flex items-center justify-between font-semibold">
                        <span>Resultat</span>
                        <span className={profitClass}>
                            {profit === null
                                ? "—"
                                : `${profit > 0 ? "+" : ""}${profit.toFixed(2)} kr`}
                        </span>
                    </div>
                </div>

                {error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {error}
                    </div>
                ) : null}

                <div className="flex gap-3">
                    <button
                        type="button"
                        disabled={loading}
                        onClick={handleSave}
                        className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? isEditMode
                                ? "Sparar ändringar..."
                                : "Sparar..."
                            : isEditMode
                                ? "Spara ändringar"
                                : "Spara inköp"}
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