import type { CustomerListItem } from "../api/customersApi";
import type { Dispatch, SetStateAction } from "react";
import type { CustomerDraft } from "../types/customers";

type CustomerRowProps = {
    customer: CustomerListItem;
    isEditing: boolean;
    draft: CustomerDraft;
    onDraftChange: Dispatch<SetStateAction<CustomerDraft>>;
    onStartEdit: (customer: CustomerListItem) => void;
    onCancelEdit: () => void;
    onSave: () => void;
    onDelete: () => void;
    isSaving: boolean;
    isDeleting: boolean;
};

export function CustomerRow({
                                customer,
                                isEditing,
                                draft,
                                onDraftChange,
                                onStartEdit,
                                onCancelEdit,
                                onSave,
                                onDelete,
                                isSaving,
                                isDeleting,
                            }: CustomerRowProps) {
    return (
        <tr className="bg-slate-50 text-sm text-slate-800">
            <td className="rounded-l-xl px-4 py-3 font-medium">
                {isEditing ? (
                    <input
                        type="text"
                        value={draft.name}
                        onChange={(event) =>
                            onDraftChange((prev) => ({
                                ...prev,
                                name: event.target.value,
                            }))
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#99D0B6] focus:ring-2 focus:ring-[#99D0B6]/30"
                    />
                ) : (
                    customer.name
                )}
            </td>

            <td className="px-4 py-3">
                {isEditing ? (
                    <input
                        type="text"
                        value={draft.customerNumber}
                        onChange={(event) =>
                            onDraftChange((prev) => ({
                                ...prev,
                                customerNumber: event.target.value,
                            }))
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#99D0B6] focus:ring-2 focus:ring-[#99D0B6]/30"
                    />
                ) : (
                    customer.customerNumber
                )}
            </td>

            <td className="rounded-r-xl px-4 py-3">
                <div className="flex justify-end gap-2">
                    {isEditing ? (
                        <>
                            <button
                                type="button"
                                onClick={onSave}
                                disabled={isSaving}
                                className="rounded-full bg-[#99D0B6] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#86c4a4] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSaving ? "Sparar..." : "Spara"}
                            </button>

                            <button
                                type="button"
                                onClick={onCancelEdit}
                                disabled={isSaving}
                                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Avbryt
                            </button>

                            <button
                                type="button"
                                onClick={onDelete}
                                disabled={isDeleting}
                                className="rounded-full px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isDeleting ? "Tar bort..." : "Ta bort"}
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => onStartEdit(customer)}
                            className="rounded-full border border-[#99D0B6] px-4 py-1.5 text-sm font-medium text-[#99D0B6] transition hover:bg-[#99D0B6]/10"
                        >
                            Redigera
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
}