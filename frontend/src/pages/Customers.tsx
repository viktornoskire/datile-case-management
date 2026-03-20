import {useEffect, useState} from "react";
import {
    createCustomer,
    deleteCustomer,
    fetchCustomers,
    updateCustomer,
    type CustomerListItem,
    type CustomersResponse,
} from "../api/customersApi";
import {CustomerTable} from "../components/CustomerTable";
import {NewCustomerForm} from "../components/NewCustomerForm";
import type {CustomerDraft} from "../types/customers";
import Contacts from "../components/ContactsSection.tsx";

const emptyDraft: CustomerDraft = {
    name: "",
    customerNumber: "",
};

export default function Customers() {
    const [data, setData] = useState<CustomersResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(0);
    const [pageSize] = useState(10);
    const [query, setQuery] = useState("");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    const [editingCustomerId, setEditingCustomerId] = useState<number | null>(null);
    const [draft, setDraft] = useState<CustomerDraft>(emptyDraft);

    const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
    const [newCustomerDraft, setNewCustomerDraft] = useState<CustomerDraft>(emptyDraft);

    const [isSaving, setIsSaving] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const loadCustomers = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetchCustomers({
                page,
                size: pageSize,
                sortBy: "name",
                sortDir,
                q: query,
            });

            setData(response);
        } catch (err) {
            console.error(err);
            setError("Kunde inte hämta kunder.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadCustomers();
    }, [page, query, sortDir]);

    const customers = data?.items ?? [];
    const totalPages = data?.totalPages ?? 0;

    const startEdit = (customer: CustomerListItem) => {
        setEditingCustomerId(customer.customerId);
        setDraft({
            name: customer.name,
            customerNumber: customer.customerNumber,
        });
    };

    const cancelEdit = () => {
        setEditingCustomerId(null);
        setDraft(emptyDraft);
    };

    const handleSaveCustomer = async (customerId: number) => {
        if (!draft.name.trim() || !draft.customerNumber.trim()) {
            setError("Kundnamn och kundnummer måste fyllas i.");
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            await updateCustomer(customerId, {
                name: draft.name.trim(),
                customerNumber: draft.customerNumber.trim(),
            });

            setEditingCustomerId(null);
            setDraft(emptyDraft);
            await loadCustomers();
        } catch (err) {
            console.error(err);
            setError("Kunde inte spara kunden.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCreateCustomer = async () => {
        if (!newCustomerDraft.name.trim() || !newCustomerDraft.customerNumber.trim()) {
            setError("Kundnamn och kundnummer måste fyllas i.");
            return;
        }

        setIsCreating(true);
        setError(null);

        try {
            await createCustomer({
                name: newCustomerDraft.name.trim(),
                customerNumber: newCustomerDraft.customerNumber.trim(),
            });

            setNewCustomerDraft(emptyDraft);
            setShowNewCustomerForm(false);
            setPage(0);
            await loadCustomers();
        } catch (err) {
            console.error(err);
            setError("Kunde inte skapa kunden.");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteCustomer = async (customerId: number) => {
        const confirmed = window.confirm("Är du säker på att du vill ta bort kunden?");
        if (!confirmed) return;

        setIsDeleting(customerId);
        setError(null);

        try {
            await deleteCustomer(customerId);

            if (customers.length === 1 && page > 0) {
                setPage((current) => current - 1);
            } else {
                await loadCustomers();
            }

            if (editingCustomerId === customerId) {
                cancelEdit();
            }
        } catch (err) {
            console.error(err);
            setError("Kunde inte ta bort kunden.");
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Kunder</h1>
                        <p className="text-sm text-slate-500">
                            Kunder med tillhörande Fortnox kundnummer
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowNewCustomerForm((prev) => !prev)}
                        className="rounded-full bg-[#022B4F] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                        {showNewCustomerForm ? "Stäng" : "Ny kund"}
                    </button>
                </div>
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                        type="text"
                        value={query}
                        onChange={(event) => {
                            setQuery(event.target.value);
                            setPage(0);
                        }}
                        placeholder="Sök kundnamn..."
                        className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm outline-none focus:border-[#99D0B6] focus:ring-2 focus:ring-[#99D0B6]/30"
                    />

                    <button
                        type="button"
                        onClick={() => {
                            setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
                            setPage(0);
                        }}
                        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        {sortDir === "asc" ? "Sortering: A–Ö" : "Sortering: Ö–A"}
                    </button>
                </div>

                {showNewCustomerForm && (
                    <NewCustomerForm
                        value={newCustomerDraft}
                        onChange={setNewCustomerDraft}
                        onSave={() => void handleCreateCustomer()}
                        onCancel={() => {
                            setShowNewCustomerForm(false);
                            setNewCustomerDraft(emptyDraft);
                        }}
                        isCreating={isCreating}
                    />
                )}

                {loading && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                        Laddar kunder...
                    </div>
                )}

                {error && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {!loading && !error && customers.length === 0 && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                        Inga kunder hittades.
                    </div>
                )}

                {!loading && customers.length > 0 && (
                    <CustomerTable
                        customers={customers}
                        editingCustomerId={editingCustomerId}
                        draft={draft}
                        onDraftChange={setDraft}
                        onStartEdit={startEdit}
                        onCancelEdit={cancelEdit}
                        onSaveCustomer={(customerId) => void handleSaveCustomer(customerId)}
                        onDeleteCustomer={(customerId) => void handleDeleteCustomer(customerId)}
                        isSaving={isSaving}
                        isDeleting={isDeleting}
                    />
                )}

                {totalPages > 1 && !loading && (
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
                        <button
                            type="button"
                            onClick={() => setPage((current) => Math.max(0, current - 1))}
                            disabled={page === 0}
                            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Föregående
                        </button>

                        <div className="flex flex-wrap items-center gap-2">
                            {Array.from({length: totalPages}, (_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setPage(index)}
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                        page === index
                                            ? "bg-[#022B4F] text-white"
                                            : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setPage((current) =>
                                    totalPages > 0 ? Math.min(totalPages - 1, current + 1) : current,
                                )
                            }
                            disabled={page >= totalPages - 1}
                            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Nästa
                        </button>
                    </div>
                )}
            </section>
            <Contacts customerQuery={query}/>
        </main>
    );
}