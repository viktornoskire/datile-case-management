import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
    addErrandHistoryEntry,
    updateErrand,
} from "../api/errandsApi";
import {
    fetchAssignees,
    fetchContacts,
    fetchCustomers,
    fetchPriorities,
    fetchStatuses,
    type AssigneeOption,
    type ContactOption,
    type CustomerOption,
    type PriorityOption,
    type StatusOption,
} from "../api/LookupsApi";
import type { ErrandDetails } from "../types/errands";

type EditErrandFormProps = {
    errand: ErrandDetails;
    onCancel: () => void;
    onSaved: (updatedErrand: ErrandDetails) => void;
};

const formatDate = (iso?: string | null) => {
    if (!iso) return "";
    return new Date(iso).toISOString().slice(0, 10);
};

const formatDateTime = (iso?: string | null) => {
    if (!iso) return "—";

    return new Date(iso).toLocaleString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const parseNullableNumber = (value: string) => {
    const trimmed = value.trim();

    if (trimmed === "") {
        return null;
    }

    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? NaN : parsed;
};

const contactLabel = (contact: ContactOption) =>
    `${contact.firstName} ${contact.lastName}`.trim() ||
    contact.mail ||
    `Kontakt ${contact.contactId}`;

const lookupErrorLabel = (name: string, reason: unknown) => {
    if (reason instanceof Error && reason.message.trim()) {
        return `${name}: ${reason.message}`;
    }

    return `${name}: okänt fel`;
};

export const EditErrandForm = ({
                                   errand,
                                   onCancel,
                                   onSaved,
                               }: EditErrandFormProps) => {
    const [title, setTitle] = useState(errand.title);
    const [description, setDescription] = useState(errand.description ?? "");
    const [statusId, setStatusId] = useState(errand.status.statusId);
    const [priorityId, setPriorityId] = useState(errand.priority.priorityId);
    const [assigneeId, setAssigneeId] = useState<number | "">(
        errand.assignee?.assigneeId ?? "",
    );
    const [customerId, setCustomerId] = useState<number | "">(
        errand.customer?.customerId ?? "",
    );
    const [contactId, setContactId] = useState<number | "">(
        errand.contact?.contactId ?? "",
    );
    const [timeSpent, setTimeSpent] = useState(
        errand.timeSpent != null ? String(errand.timeSpent) : "",
    );
    const [agreedPrice, setAgreedPrice] = useState(
        errand.agreedPrice != null ? String(errand.agreedPrice) : "",
    );

    const [newHistoryEntry, setNewHistoryEntry] = useState("");
    const [isAddingHistory, setIsAddingHistory] = useState(false);
    const [historyItems, setHistoryItems] = useState(errand.history ?? []);

    const [statuses, setStatuses] = useState<StatusOption[]>([]);
    const [priorities, setPriorities] = useState<PriorityOption[]>([]);
    const [assignees, setAssignees] = useState<AssigneeOption[]>([]);
    const [customers, setCustomers] = useState<CustomerOption[]>([]);
    const [contacts, setContacts] = useState<ContactOption[]>([]);

    const [isLoadingLookups, setIsLoadingLookups] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [lookupError, setLookupError] = useState("");
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        setTitle(errand.title);
        setDescription(errand.description ?? "");
        setStatusId(errand.status.statusId);
        setPriorityId(errand.priority.priorityId);
        setAssigneeId(errand.assignee?.assigneeId ?? "");
        setCustomerId(errand.customer?.customerId ?? "");
        setContactId(errand.contact?.contactId ?? "");
        setTimeSpent(errand.timeSpent != null ? String(errand.timeSpent) : "");
        setAgreedPrice(errand.agreedPrice != null ? String(errand.agreedPrice) : "");
        setHistoryItems(errand.history ?? []);
        setNewHistoryEntry("");
        setSubmitError("");
    }, [errand]);

    useEffect(() => {
        let alive = true;

        const run = async () => {
            setIsLoadingLookups(true);
            setLookupError("");

            const results = await Promise.allSettled([
                fetchStatuses(),
                fetchPriorities(),
                fetchAssignees(),
                fetchCustomers(),
                fetchContacts(),
            ]);

            if (!alive) {
                return;
            }

            const [
                statusesResult,
                prioritiesResult,
                assigneesResult,
                customersResult,
                contactsResult,
            ] = results;

            if (statusesResult.status === "fulfilled") {
                setStatuses(statusesResult.value);
            } else {
                setStatuses([]);
            }

            if (prioritiesResult.status === "fulfilled") {
                setPriorities(prioritiesResult.value);
            } else {
                setPriorities([]);
            }

            if (assigneesResult.status === "fulfilled") {
                setAssignees(assigneesResult.value);
            } else {
                setAssignees([]);
            }

            if (customersResult.status === "fulfilled") {
                setCustomers(customersResult.value);
            } else {
                setCustomers([]);
            }

            if (contactsResult.status === "fulfilled") {
                setContacts(contactsResult.value);
            } else {
                setContacts([]);
            }

            const failures: string[] = [];

            if (statusesResult.status === "rejected") {
                failures.push(lookupErrorLabel("Statusar", statusesResult.reason));
            }

            if (prioritiesResult.status === "rejected") {
                failures.push(lookupErrorLabel("Prioriteter", prioritiesResult.reason));
            }

            if (assigneesResult.status === "rejected") {
                failures.push(lookupErrorLabel("Ansvariga", assigneesResult.reason));
            }

            if (customersResult.status === "rejected") {
                failures.push(lookupErrorLabel("Kunder", customersResult.reason));
            }

            if (contactsResult.status === "rejected") {
                failures.push(lookupErrorLabel("Kontakter", contactsResult.reason));
            }

            if (failures.length > 0) {
                setLookupError(`Kunde inte hämta alla valbara listor. ${failures.join(" | ")}`);
            }

            setIsLoadingLookups(false);
        };

        void run();

        return () => {
            alive = false;
        };
    }, []);

    const selectedPriority = useMemo(
        () =>
            priorities.find((priority) => priority.priorityId === priorityId) ??
            errand.priority,
        [priorities, priorityId, errand.priority],
    );

    const handleAddHistoryEntry = async () => {
        setSubmitError("");

        if (!newHistoryEntry.trim()) {
            return;
        }

        try {
            setIsAddingHistory(true);

            const updatedErrand = await addErrandHistoryEntry(errand.errandId, {
                description: newHistoryEntry.trim(),
            });

            setHistoryItems(updatedErrand.history ?? []);
            setNewHistoryEntry("");
        } catch (error) {
            if (error instanceof Error && error.message.trim()) {
                setSubmitError(`Kunde inte lägga till historikrad. ${error.message}`);
            } else {
                setSubmitError("Kunde inte lägga till historikrad.");
            }
        } finally {
            setIsAddingHistory(false);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitError("");

        if (!title.trim()) {
            setSubmitError("Titel måste fyllas i.");
            return;
        }

        const parsedTimeSpent = parseNullableNumber(timeSpent);
        const parsedAgreedPrice = parseNullableNumber(agreedPrice);

        if (parsedTimeSpent !== null && Number.isNaN(parsedTimeSpent)) {
            setSubmitError("Tidsåtgång måste vara ett giltigt nummer.");
            return;
        }

        if (parsedAgreedPrice !== null && Number.isNaN(parsedAgreedPrice)) {
            setSubmitError("Överenskommet pris måste vara ett giltigt nummer.");
            return;
        }

        if (parsedTimeSpent !== null && parsedTimeSpent < 0) {
            setSubmitError("Tidsåtgång kan inte vara negativ.");
            return;
        }

        if (parsedAgreedPrice !== null && parsedAgreedPrice < 0) {
            setSubmitError("Överenskommet pris kan inte vara negativt.");
            return;
        }

        try {
            setIsSaving(true);

            const updatedErrand = await updateErrand(errand.errandId, {
                title: title.trim(),
                description: description.trim(),
                statusId,
                priorityId,
                assigneeId: assigneeId === "" ? null : Number(assigneeId),
                customerId: customerId === "" ? null : Number(customerId),
                contactId: contactId === "" ? null : Number(contactId),
                timeSpent: parsedTimeSpent,
                agreedPrice: parsedAgreedPrice,
            });

            onSaved(updatedErrand);
        } catch (error) {
            if (error instanceof Error && error.message.trim()) {
                setSubmitError(`Kunde inte spara ärendet. ${error.message}`);
            } else {
                setSubmitError("Kunde inte spara ärendet.");
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div>
                    <label
                        htmlFor="customer"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                        Kund
                    </label>
                    <select
                        id="customer"
                        value={customerId}
                        onChange={(event) =>
                            setCustomerId(event.target.value === "" ? "" : Number(event.target.value))
                        }
                        disabled={isLoadingLookups}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
                    >
                        {isLoadingLookups ? (
                            <option value={customerId}>Laddar kunder...</option>
                        ) : (
                            <>
                                <option value="">Ingen vald</option>
                                {customers.map((customer) => (
                                    <option key={customer.customerId} value={customer.customerId}>
                                        {customer.name}
                                    </option>
                                ))}
                            </>
                        )}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="title"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                        Namn
                    </label>
                    <input
                        id="title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                    />
                </div>

                <div>
                    <label
                        htmlFor="assignee"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                        Ansvarig
                    </label>
                    <select
                        id="assignee"
                        value={assigneeId}
                        onChange={(event) =>
                            setAssigneeId(event.target.value === "" ? "" : Number(event.target.value))
                        }
                        disabled={isLoadingLookups}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
                    >
                        {isLoadingLookups ? (
                            <option value={assigneeId}>Laddar ansvariga...</option>
                        ) : (
                            <>
                                <option value="">Ingen vald</option>
                                {assignees.map((assignee) => (
                                    <option key={assignee.assigneeId} value={assignee.assigneeId}>
                                        {assignee.name}
                                    </option>
                                ))}
                            </>
                        )}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="date"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                        Datum
                    </label>
                    <input
                        id="date"
                        value={formatDate(errand.createdAt)}
                        disabled
                        className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400"
                    />
                </div>

                <div>
                    <label
                        htmlFor="status"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                        Status
                    </label>
                    <select
                        id="status"
                        value={statusId}
                        onChange={(event) => setStatusId(Number(event.target.value))}
                        disabled={isLoadingLookups}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
                    >
                        {isLoadingLookups ? (
                            <option value={statusId}>Laddar statusar...</option>
                        ) : statuses.length === 0 ? (
                            <option value={statusId}>Inga statusar hittades</option>
                        ) : (
                            statuses.map((status) => (
                                <option key={status.statusId} value={status.statusId}>
                                    {status.name}
                                </option>
                            ))
                        )}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="priority"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                        Prioritet
                    </label>
                    <select
                        id="priority"
                        value={priorityId}
                        onChange={(event) => setPriorityId(Number(event.target.value))}
                        disabled={isLoadingLookups}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
                    >
                        {isLoadingLookups ? (
                            <option value={priorityId}>Laddar prioriteter...</option>
                        ) : priorities.length === 0 ? (
                            <option value={priorityId}>Inga prioriteter hittades</option>
                        ) : (
                            priorities.map((priority) => (
                                <option key={priority.priorityId} value={priority.priorityId}>
                                    {priority.name}
                                </option>
                            ))
                        )}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="timeSpent"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                        Tidsåtgång
                    </label>
                    <input
                        id="timeSpent"
                        type="number"
                        min="0"
                        step="0.1"
                        value={timeSpent}
                        onChange={(event) => setTimeSpent(event.target.value)}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                    />
                </div>

                <div>
                    <label
                        htmlFor="agreedPrice"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                        Överenskommet pris (SEK)
                    </label>
                    <input
                        id="agreedPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={agreedPrice}
                        onChange={(event) => setAgreedPrice(event.target.value)}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label
                        htmlFor="contact"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                        Kontakt
                    </label>
                    <select
                        id="contact"
                        value={contactId}
                        onChange={(event) =>
                            setContactId(event.target.value === "" ? "" : Number(event.target.value))
                        }
                        disabled={isLoadingLookups}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
                    >
                        {isLoadingLookups ? (
                            <option value={contactId}>Laddar kontakter...</option>
                        ) : (
                            <>
                                <option value="">Ingen vald</option>
                                {contacts.map((contact) => (
                                    <option key={contact.contactId} value={contact.contactId}>
                                        {contactLabel(contact)}
                                    </option>
                                ))}
                            </>
                        )}
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="priorityColorPreview"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                        Prioritet
                    </label>
                    <div className="flex h-[42px] items-center rounded-md border border-slate-200 px-3">
            <span
                className="mr-3 inline-block h-4 w-4 rounded-full border border-slate-300"
                style={{ backgroundColor: selectedPriority?.color ?? "#FFFFFF" }}
            />
                        <span className="text-sm text-slate-700">
              {selectedPriority?.name ?? "Ingen prioritet vald"}
            </span>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                    <label
                        htmlFor="description"
                        className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                        Beskrivning
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                        placeholder="Kort sammanfattning av ärendet"
                    />
                </div>

                <div className="space-y-3">
                    <div className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Historik
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                        <label
                            htmlFor="newHistoryEntry"
                            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                        >
                            Lägg till historikrad
                        </label>

                        <div className="flex gap-3">
              <textarea
                  id="newHistoryEntry"
                  value={newHistoryEntry}
                  onChange={(event) => setNewHistoryEntry(event.target.value)}
                  placeholder="Skriv en ny rad i historiken..."
                  className="min-h-24 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
              />

                            <button
                                type="button"
                                onClick={handleAddHistoryEntry}
                                disabled={isAddingHistory || !newHistoryEntry.trim()}
                                className="self-end rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                            >
                                {isAddingHistory ? "Lägger till..." : "Lägg till"}
                            </button>
                        </div>
                    </div>

                    <div className="min-h-48 rounded-xl border border-slate-200 bg-slate-50 p-3">
                        {historyItems.length === 0 ? (
                            <p className="text-sm text-slate-500">Ingen historik än.</p>
                        ) : (
                            <ul className="space-y-3">
                                {historyItems.map((item, index) => (
                                    <li
                                        key={`${item.createdAt}-${index}`}
                                        className="border-b border-slate-200 pb-2 last:border-b-0"
                                    >
                                        <div className="text-sm font-medium text-slate-800">
                                            {item.description || "—"}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {item.verifiedName || "—"} · {formatDateTime(item.createdAt)}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                    <div className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Inköp
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                        Inköp är ännu inte kopplat till edit-flödet.
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSaving || isAddingHistory}
                        className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                        Avbryt
                    </button>

                    <button
                        type="submit"
                        disabled={isSaving || isAddingHistory}
                        className="rounded-full bg-emerald-300 px-8 py-2.5 text-sm font-semibold text-slate-900 hover:bg-emerald-400 disabled:opacity-50"
                    >
                        {isSaving ? "Sparar..." : "Spara ärende"}
                    </button>
                </div>
            </div>

            {lookupError ? (
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                    {lookupError}
                </div>
            ) : null}

            {submitError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {submitError}
                </div>
            ) : null}
        </form>
    );
};