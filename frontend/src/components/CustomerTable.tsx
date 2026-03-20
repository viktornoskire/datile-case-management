import type { CustomerListItem } from "../api/customersApi";
import { CustomerRow } from "./CustomerRow";
import type { Dispatch, SetStateAction } from "react";
import type { CustomerDraft } from "../types/customers";

type CustomerTableProps = {
    customers: CustomerListItem[];
    editingCustomerId: number | null;
    draft: CustomerDraft;
    onDraftChange: Dispatch<SetStateAction<CustomerDraft>>;
    onStartEdit: (customer: CustomerListItem) => void;
    onCancelEdit: () => void;
    onSaveCustomer: (customerId: number) => void;
    onDeleteCustomer: (customerId: number) => void;
    isSaving: boolean;
    isDeleting: number | null;
};

export function CustomerTable({
                                  customers,
                                  editingCustomerId,
                                  draft,
                                  onDraftChange,
                                  onStartEdit,
                                  onCancelEdit,
                                  onSaveCustomer,
                                  onDeleteCustomer,
                                  isSaving,
                                  isDeleting,
                              }: CustomerTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-1.5">
                <thead>
                <tr className="text-left text-sm text-slate-500">
                    <th className="px-4 py-2 font-medium">Kund</th>
                    <th className="px-4 py-2 font-medium">Kundnr.</th>
                    <th className="px-4 py-2 font-medium text-right">Åtgärd</th>
                </tr>
                </thead>

                <tbody>
                {customers.map((customer) => (
                    <CustomerRow
                        key={customer.customerId}
                        customer={customer}
                        isEditing={editingCustomerId === customer.customerId}
                        draft={draft}
                        onDraftChange={onDraftChange}
                        onStartEdit={onStartEdit}
                        onCancelEdit={onCancelEdit}
                        onSave={() => onSaveCustomer(customer.customerId)}
                        onDelete={() => onDeleteCustomer(customer.customerId)}
                        isSaving={isSaving}
                        isDeleting={isDeleting === customer.customerId}
                    />
                ))}
                </tbody>
            </table>
        </div>
    );
}