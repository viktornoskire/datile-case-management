import type { Dispatch, SetStateAction } from "react";
import type { CustomerDraft } from "../types/customers";

type NewCustomerFormProps = {
    value: CustomerDraft;
    onChange: Dispatch<SetStateAction<CustomerDraft>>;
    onSave: () => void;
    onCancel: () => void;
    isCreating: boolean;
};

export function NewCustomerForm({
                                    value,
                                    onChange,
                                    onSave,
                                    onCancel,
                                    isCreating,
                                }: NewCustomerFormProps) {
    return (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_auto] md:items-end">
                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-slate-700">Kund</span>
                    <input
                        type="text"
                        value={value.name}
                        onChange={(event) =>
                            onChange((prev) => ({
                                ...prev,
                                name: event.target.value,
                            }))
                        }
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#99D0B6] focus:ring-2 focus:ring-[#99D0B6]/30"
                        placeholder="Ange kundnamn"
                    />
                </label>

                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-slate-700">Kundnr.</span>
                    <input
                        type="text"
                        value={value.customerNumber}
                        onChange={(event) =>
                            onChange((prev) => ({
                                ...prev,
                                customerNumber: event.target.value,
                            }))
                        }
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#99D0B6] focus:ring-2 focus:ring-[#99D0B6]/30"
                        placeholder="XX-XXX"
                    />
                </label>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={isCreating}
                        className="rounded-full bg-[#99D0B6] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#86c4a4] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isCreating ? "Sparar..." : "Spara"}
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Avbryt
                    </button>
                </div>
            </div>
        </div>
    );
}