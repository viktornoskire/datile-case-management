import { useEffect, useState } from "react";
import { createContact, fetchContacts, type ContactListItem } from "../api/contactsApi";
import { fetchCustomerLookups, type CustomerLookup } from "../api/customersApi";

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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+\-\s()]{7,20}$/;

const isValidEmail = (value: string) =>
    value.trim() === "" || emailPattern.test(value.trim());

const isValidPhoneNumber = (value: string) =>
    value.trim() === "" || phonePattern.test(value.trim());

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

        if (!isValidEmail(draft.mail)) {
            setError("Ange en giltig e-postadress.");
            return;
        }

        if (!isValidPhoneNumber(draft.phoneNumber)) {
            setError("Ange ett giltigt telefonnummer.");
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
                (contact.customerName ?? "").toLowerCase().includes(normalizedCustomerQuery)
            );

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                        Kontakter
                    </h2>
                    <p className="text-sm text-slate-500">
                        Kontakter kopplade till kunder
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setShowNewContactForm((prev) => !prev);
                        setError(null);
                    }}
                    className="w-full rounded-full bg-[#022B4F] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto"
                >
                    {showNewContactForm ? "Stäng" : "Ny kontakt"}
                </button>
            </div>

            {showNewContactForm && (
                <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:mb-6 sm:p-6">
                    <div className="mb-4">
                        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                            Ny kontakt
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Fyll i uppgifter för att skapa en ny kontakt.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="flex flex-col gap-1 text-sm text-slate-700">
                            <span className="font-medium text-slate-700">Kund</span>
                            <select
                                value={draft.customerId}
                                onChange={(event) =>
                                    setDraft((current) => ({
                                        ...current,
                                        customerId: event.target.value,
                                    }))
                                }
                                className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-400"
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
                            <span className="font-medium text-slate-700">Förnamn</span>
                            <input
                                type="text"
                                value={draft.firstName}
                                onChange={(event) =>
                                    setDraft((current) => ({
                                        ...current,
                                        firstName: event.target.value,
                                    }))
                                }
                                className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-400"
                            />
                        </label>

                        <label className="flex flex-col gap-1 text-sm text-slate-700">
                            <span className="font-medium text-slate-700">Efternamn</span>
                            <input
                                type="text"
                                value={draft.lastName}
                                onChange={(event) =>
                                    setDraft((current) => ({
                                        ...current,
                                        lastName: event.target.value,
                                    }))
                                }
                                maxLength={50}
                                className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-400"
                            />
                        </label>

                        <label className="flex flex-col gap-1 text-sm text-slate-700">
                            <span className="font-medium text-slate-700">Telefon</span>
                            <input
                                type="tel"
                                inputMode="tel"
                                value={draft.phoneNumber}
                                onChange={(event) =>
                                    setDraft((current) => ({
                                        ...current,
                                        phoneNumber: event.target.value.replace(
                                            /[^0-9+\-\s()]/g,
                                            ""
                                        ),
                                    }))
                                }
                                pattern="[0-9+\-\s()]{7,20}"
                                maxLength={20}
                                placeholder="070-123 45 67"
                                className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-400"
                            />
                        </label>

                        <label className="flex flex-col gap-1 text-sm text-slate-700 md:col-span-2">
                            <span className="font-medium text-slate-700">E-post</span>
                            <input
                                type="email"
                                value={draft.mail}
                                onChange={(event) =>
                                    setDraft((current) => ({
                                        ...current,
                                        mail: event.target.value,
                                    }))
                                }
                                maxLength={100}
                                placeholder="namn@foretag.se"
                                className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-400"
                            />
                        </label>
                    </div>

                    <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() => {
                                setShowNewContactForm(false);
                                setDraft(emptyDraft);
                                setError(null);
                            }}
                            className="w-full rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:w-auto"
                        >
                            Avbryt
                        </button>

                        <button
                            type="button"
                            onClick={() => void handleCreateContact()}
                            disabled={isCreating}
                            className="w-full rounded-full bg-[#99D0B6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#86c4a4] disabled:opacity-50 sm:w-auto"
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
                <>
                    <div className="space-y-3 md:hidden">
                        {filteredContacts.map((contact) => (
                            <article
                                key={contact.contactId}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                            >
                                <div className="flex flex-col gap-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Kontakt
                                        </p>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {contact.firstName} {contact.lastName}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Kund
                                        </p>
                                        <p className="text-sm text-slate-700">
                                            {contact.customerName ?? "—"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            E-post
                                        </p>
                                        <p className="break-words text-sm text-slate-700">
                                            {contact.mail || "—"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                            Telefon
                                        </p>
                                        <p className="text-sm text-slate-700">
                                            {contact.phoneNumber || "—"}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="hidden overflow-x-auto rounded-xl border border-slate-200 md:block">
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
                </>
            )}
        </section>
    );
}