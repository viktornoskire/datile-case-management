import {useEffect, useState} from "react";
import {createContact, fetchContacts, type ContactListItem} from "../api/contactsApi";
import {fetchCustomerLookups, type CustomerLookup} from "../api/customersApi";

type ContactDraft = {
    customerId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    mail: string;
};

const emptyDraft: ContactDraft = {
    customerId: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    mail: "",
};

type ContactsSectionProps = {
    customerQuery: string;
};

export default function ContactsSection({ customerQuery }: ContactsSectionProps) {
    const [contacts, setContacts] = useState<ContactListItem[]>([]);
    const [customers, setCustomers] = useState<CustomerLookup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showNewContactForm, setShowNewContactForm] = useState(false);
    const [draft, setDraft] = useState<ContactDraft>(emptyDraft);
    const [isCreating, setIsCreating] = useState(false);

    const loadContacts = async () => {
        const response = await fetchContacts();
        setContacts(response);
    };

    const loadCustomers = async () => {
        const response = await fetchCustomerLookups();
        setCustomers(response);
    };

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            await Promise.all([loadContacts(), loadCustomers()]);
        } catch (err) {
            console.error("Failed to load contacts section:", err);
            setError("Kunde inte hämta kontakter.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadData();
    }, []);

    const handleCreateContact = async () => {
        if (!draft.customerId || !draft.firstName.trim() || !draft.lastName.trim()) {
            setError("Kund, förnamn och efternamn måste fyllas i.");
            return;
        }

        setIsCreating(true);
        setError(null);

        try {
            await createContact({
                customerId: Number(draft.customerId),
                firstName: draft.firstName.trim(),
                lastName: draft.lastName.trim(),
                phoneNumber: draft.phoneNumber.trim(),
                mail: draft.mail.trim(),
            });

            setDraft(emptyDraft);
            setShowNewContactForm(false);
            await loadContacts();
        } catch (err) {
            console.error("createContact failed:", err);
            setError("Kunde inte skapa kontakten.");
        } finally {
            setIsCreating(false);
        }
    };

    const normalizedCustomerQuery = customerQuery.trim().toLowerCase();

    const filteredContacts =
        normalizedCustomerQuery.length === 0
            ? contacts
            : contacts.filter((contact) =>
                (contact.customerName ?? "").toLowerCase().includes(normalizedCustomerQuery),
            );

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900">Kontakter</h2>
                    <p className="text-sm text-slate-500">
                        Kontakter kopplade till kunder
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setShowNewContactForm((prev) => !prev)}
                    className="rounded-full bg-[#022B4F] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                >
                    {showNewContactForm ? "Stäng" : "Ny kontakt"}
                </button>
            </div>

            {showNewContactForm && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="grid gap-3 md:grid-cols-2">
                        <label className="flex flex-col gap-1 text-sm text-slate-700">
                            Kund
                            <select
                                value={draft.customerId}
                                onChange={(event) =>
                                    setDraft((current) => ({
                                        ...current,
                                        customerId: event.target.value,
                                    }))
                                }
                                className="rounded-xl border border-slate-300 px-3 py-2"
                            >
                                <option value="">Välj kund</option>
                                {customers.map((customer) => (
                                    <option key={customer.customerId} value={customer.customerId}>
                                        {customer.name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="flex flex-col gap-1 text-sm text-slate-700">
                            Förnamn
                            <input
                                type="text"
                                value={draft.firstName}
                                onChange={(event) =>
                                    setDraft((current) => ({
                                        ...current,
                                        firstName: event.target.value,
                                    }))
                                }
                                className="rounded-xl border border-slate-300 px-3 py-2"
                            />
                        </label>

                        <label className="flex flex-col gap-1 text-sm text-slate-700">
                            Efternamn
                            <input
                                type="text"
                                value={draft.lastName}
                                onChange={(event) =>
                                    setDraft((current) => ({
                                        ...current,
                                        lastName: event.target.value,
                                    }))
                                }
                                className="rounded-xl border border-slate-300 px-3 py-2"
                            />
                        </label>

                        <label className="flex flex-col gap-1 text-sm text-slate-700">
                            Telefon
                            <input
                                type="text"
                                value={draft.phoneNumber}
                                onChange={(event) =>
                                    setDraft((current) => ({
                                        ...current,
                                        phoneNumber: event.target.value,
                                    }))
                                }
                                className="rounded-xl border border-slate-300 px-3 py-2"
                            />
                        </label>

                        <label className="flex flex-col gap-1 text-sm text-slate-700 md:col-span-2">
                            E-post
                            <input
                                type="email"
                                value={draft.mail}
                                onChange={(event) =>
                                    setDraft((current) => ({
                                        ...current,
                                        mail: event.target.value,
                                    }))
                                }
                                className="rounded-xl border border-slate-300 px-3 py-2"
                            />
                        </label>
                    </div>

                    <div className="mt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setShowNewContactForm(false);
                                setDraft(emptyDraft);
                            }}
                            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                            Avbryt
                        </button>

                        <button
                            type="button"
                            onClick={() => void handleCreateContact()}
                            disabled={isCreating}
                            className="rounded-full bg-[#99D0B6] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#86c4a4] disabled:opacity-50"
                        >
                            {isCreating ? "Sparar..." : "Spara kontakt"}
                        </button>
                    </div>
                </div>
            )}
            {loading && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    Laddar kontakter...
                </div>
            )}

            {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {!loading && !error && filteredContacts.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    Inga kontakter hittades.
                </div>
            )}

            {!loading && !error && filteredContacts.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Kontakt
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Kund
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                E-post
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Telefon
                            </th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-200 bg-white">
                        {filteredContacts.map((contact) => (
                            <tr key={contact.contactId} className="hover:bg-slate-50">
                                <td className="px-4 py-3 text-sm text-slate-900">
                                    {contact.firstName} {contact.lastName}
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-700">
                                    {contact.customerName ?? "—"}
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-700">
                                    {contact.mail || "—"}
                                </td>
                                <td className="px-4 py-3 text-sm text-slate-700">
                                    {contact.phoneNumber || "—"}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}