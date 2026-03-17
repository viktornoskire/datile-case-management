import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { addErrandHistoryEntry, createErrand } from "../api/errandsApi";
import {
    fetchAssignees,
    fetchContacts,
    fetchCustomers,
    fetchPriorities,
    fetchStatuses,
    type AssigneeLookup,
    type ContactLookup,
    type CustomerLookup,
    type PriorityLookup,
    type StatusLookup,
} from "../api/LookupsApi";

type PurchaseFormValue = {
    itemName: string;
    quantity: string;
    purchasePrice: string;
    shippingCost: string;
    salePrice: string;
};

type FormValues = {
    title: string;
    description: string;
    statusId: string;
    priorityId: string;
    assigneeId: string;
    customerId: string;
    contactId: string;
    timeSpent: string;
    agreedPrice: string;
    initialHistoryNote: string;
    purchases: PurchaseFormValue[];
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
    title: "",
    description: "",
    statusId: "",
    priorityId: "",
    assigneeId: "",
    customerId: "",
    contactId: "",
    timeSpent: "0",
    agreedPrice: "0",
    initialHistoryNote: "",
    purchases: [],
};

const emptyPurchase = (): PurchaseFormValue => ({
    itemName: "",
    quantity: "1",
    purchasePrice: "0",
    shippingCost: "0",
    salePrice: "0",
});

const isNonNegativeNumber = (value: string) => {
    if (value.trim() === "") return false;
    const parsed = Number(value);
    return !Number.isNaN(parsed) && parsed >= 0;
};

const isPositiveInteger = (value: string) => {
    if (value.trim() === "") return false;
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0;
};

const contactLabel = (contact: ContactLookup) =>
    `${contact.firstName} ${contact.lastName}`.trim() ||
    contact.mail ||
    `Kontakt ${contact.contactId}`;

const lookupErrorLabel = (name: string, reason: unknown) => {
    if (reason instanceof Error && reason.message.trim()) {
        return `${name}: ${reason.message}`;
    }

    return `${name}: okänt fel`;
};

const validateForm = (values: FormValues): FormErrors => {
    const errors: FormErrors = {};

    if (!values.title.trim()) {
        errors.title = "Titel är obligatorisk";
    }

    if (!values.description.trim()) {
        errors.description = "Beskrivning är obligatorisk";
    }

    if (!values.customerId.trim()) {
        errors.customerId = "Kund måste väljas";
    }

    if (!values.contactId.trim()) {
        errors.contactId = "Kontaktperson måste väljas";
    }

    if (!values.assigneeId.trim()) {
        errors.assigneeId = "Ansvarig måste väljas";
    }

    if (!values.statusId.trim()) {
        errors.statusId = "Status måste väljas";
    }

    if (!values.priorityId.trim()) {
        errors.priorityId = "Prioritet måste väljas";
    }

    if (!isNonNegativeNumber(values.timeSpent)) {
        errors.timeSpent = "Tidsåtgång måste vara 0 eller mer";
    }

    if (!isNonNegativeNumber(values.agreedPrice)) {
        errors.agreedPrice = "Överenskommet pris måste vara 0 eller mer";
    }

    for (const purchase of values.purchases) {
        if (!purchase.itemName.trim()) {
            errors.purchases = "Alla inköp måste ha namn";
            break;
        }

        if (!isPositiveInteger(purchase.quantity)) {
            errors.purchases = "Antal måste vara ett heltal större än 0";
            break;
        }

        if (!isNonNegativeNumber(purchase.purchasePrice)) {
            errors.purchases = "Inköpspris måste vara 0 eller mer";
            break;
        }

        if (!isNonNegativeNumber(purchase.shippingCost)) {
            errors.purchases = "Frakt måste vara 0 eller mer";
            break;
        }

        if (!isNonNegativeNumber(purchase.salePrice)) {
            errors.purchases = "Utpris måste vara 0 eller mer";
            break;
        }
    }

    return errors;
};

export default function CreateErrandPage() {
    const navigate = useNavigate();

    const [values, setValues] = useState<FormValues>(initialValues);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitWarning, setSubmitWarning] = useState<string | null>(null);

    const [statuses, setStatuses] = useState<StatusLookup[]>([]);
    const [priorities, setPriorities] = useState<PriorityLookup[]>([]);
    const [assignees, setAssignees] = useState<AssigneeLookup[]>([]);
    const [customers, setCustomers] = useState<CustomerLookup[]>([]);
    const [contacts, setContacts] = useState<ContactLookup[]>([]);

    const [isLoadingLookups, setIsLoadingLookups] = useState(true);
    const [lookupError, setLookupError] = useState("");

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

            if (!alive) return;

            const [
                statusesResult,
                prioritiesResult,
                assigneesResult,
                customersResult,
                contactsResult,
            ] = results;

            const loadedStatuses =
                statusesResult.status === "fulfilled"
                    ? (statusesResult.value as StatusLookup[])
                    : [];

            const loadedPriorities =
                prioritiesResult.status === "fulfilled"
                    ? (prioritiesResult.value as PriorityLookup[])
                    : [];

            const loadedAssignees =
                assigneesResult.status === "fulfilled"
                    ? (assigneesResult.value as AssigneeLookup[])
                    : [];

            const loadedCustomers =
                customersResult.status === "fulfilled"
                    ? (customersResult.value as CustomerLookup[])
                    : [];

            const loadedContacts =
                contactsResult.status === "fulfilled"
                    ? (contactsResult.value as ContactLookup[])
                    : [];

            setStatuses(loadedStatuses);
            setPriorities(loadedPriorities);
            setAssignees(loadedAssignees);
            setCustomers(loadedCustomers);
            setContacts(loadedContacts);

            const defaultPriority = loadedPriorities.find(
                (priority) => priority.name.trim().toLowerCase() === "normal",
            );

            setValues((current) => ({
                ...current,
                statusId:
                    current.statusId ||
                    (loadedStatuses[0] ? String(loadedStatuses[0].statusId) : ""),
                priorityId:
                    current.priorityId ||
                    (defaultPriority ? String(defaultPriority.priorityId) : ""),
            }));

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
                setLookupError(
                    `Kunde inte hämta alla valbara listor. ${failures.join(" | ")}`,
                );
            }

            setIsLoadingLookups(false);
        };

        void run();

        return () => {
            alive = false;
        };
    }, []);

    const filteredContacts = useMemo(() => {
        if (!values.customerId) {
            return [];
        }

        const selectedCustomerId = Number(values.customerId);

        return contacts.filter((contact) => contact.customerId === selectedCustomerId);
    }, [contacts, values.customerId]);

    const selectedPriority = useMemo(() => {
        return priorities.find(
            (priority) => String(priority.priorityId) === values.priorityId,
        );
    }, [priorities, values.priorityId]);

    useEffect(() => {
        if (!values.customerId) {
            setValues((current) => ({
                ...current,
                contactId: "",
            }));
            return;
        }

        const selectedCustomerId = Number(values.customerId);

        const contactBelongsToCustomer = contacts.some(
            (contact) =>
                contact.contactId === Number(values.contactId) &&
                contact.customerId === selectedCustomerId,
        );

        if (!contactBelongsToCustomer) {
            setValues((current) => ({
                ...current,
                contactId: "",
            }));
        }
    }, [values.customerId, values.contactId, contacts]);

    const handleFieldChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const { name, value } = event.target;

        setValues((current) => ({
            ...current,
            [name]: value,
        }));

        setErrors((current) => ({
            ...current,
            [name]: undefined,
        }));
    };

    const handleCustomerChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const nextCustomerId = event.target.value;

        setValues((current) => ({
            ...current,
            customerId: nextCustomerId,
            contactId: "",
        }));

        setErrors((current) => ({
            ...current,
            customerId: undefined,
            contactId: undefined,
        }));
    };

    const handleAddPurchase = () => {
        setValues((current) => ({
            ...current,
            purchases: [...current.purchases, emptyPurchase()],
        }));

        setErrors((current) => ({
            ...current,
            purchases: undefined,
        }));
    };

    const handleRemovePurchase = (index: number) => {
        setValues((current) => ({
            ...current,
            purchases: current.purchases.filter(
                (_, purchaseIndex) => purchaseIndex !== index,
            ),
        }));
    };

    const handlePurchaseChange = (
        index: number,
        field: keyof PurchaseFormValue,
        value: string,
    ) => {
        setValues((current) => ({
            ...current,
            purchases: current.purchases.map((purchase, purchaseIndex) =>
                purchaseIndex === index ? { ...purchase, [field]: value } : purchase,
            ),
        }));

        setErrors((current) => ({
            ...current,
            purchases: undefined,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationErrors = validateForm(values);
        setErrors(validationErrors);
        setSubmitError(null);
        setSubmitWarning(null);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        try {
            setIsSubmitting(true);

            const createdErrand = await createErrand({
                title: values.title.trim(),
                description: values.description.trim(),
                statusId: Number(values.statusId),
                priorityId: Number(values.priorityId),
                assigneeId: Number(values.assigneeId),
                customerId: Number(values.customerId),
                contactId: Number(values.contactId),
                timeSpent: Number(values.timeSpent),
                agreedPrice: Number(values.agreedPrice),
                purchases: values.purchases.map((purchase) => ({
                    itemName: purchase.itemName.trim(),
                    quantity: Number(purchase.quantity),
                    purchasePrice: Number(purchase.purchasePrice),
                    shippingCost: Number(purchase.shippingCost),
                    salePrice: Number(purchase.salePrice),
                })),
            });

            if (values.initialHistoryNote.trim()) {
                try {
                    await addErrandHistoryEntry(createdErrand.errandId, {
                        description: values.initialHistoryNote.trim(),
                    });
                } catch {
                    setSubmitWarning(
                        "Ärendet skapades, men första historiknoteringen kunde inte sparas.",
                    );
                }
            }

            navigate("/errands");
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Kunde inte skapa ärendet. Kontrollera formuläret och försök igen.";

            setSubmitError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-100 p-4">
            <div className="mx-auto max-w-[1600px]">
                <div className="mb-6">
                    <p className="text-sm text-slate-500">Ärenden / Skapa ärende</p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        Skapa ärende
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                    {lookupError ? (
                        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
                            {lookupError}
                        </div>
                    ) : null}

                    {submitError ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {submitError}
                        </div>
                    ) : null}

                    {submitWarning ? (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                            {submitWarning}
                        </div>
                    ) : null}

                    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                        <h2 className="mb-2 text-lg font-semibold text-slate-900">
                            Grundinformation
                        </h2>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <div>
                                <label
                                    htmlFor="customerId"
                                    className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                                >
                                    Kund
                                </label>
                                <select
                                    id="customerId"
                                    name="customerId"
                                    value={values.customerId}
                                    onChange={handleCustomerChange}
                                    disabled={isLoadingLookups}
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
                                >
                                    {isLoadingLookups ? (
                                        <option value="">Laddar kunder...</option>
                                    ) : (
                                        <>
                                            <option value="">Välj kund</option>
                                            {customers.map((customer) => (
                                                <option
                                                    key={customer.customerId}
                                                    value={customer.customerId}
                                                >
                                                    {customer.name}
                                                </option>
                                            ))}
                                        </>
                                    )}
                                </select>
                                {errors.customerId ? (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.customerId}
                                    </p>
                                ) : null}
                            </div>

                            <div>
                                <label
                                    htmlFor="title"
                                    className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                                >
                                    Titel
                                </label>
                                <input
                                    id="title"
                                    name="title"
                                    value={values.title}
                                    onChange={handleFieldChange}
                                    placeholder="Ange titel"
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                                />
                                {errors.title ? (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.title}
                                    </p>
                                ) : null}
                            </div>

                            <div>
                                <label
                                    htmlFor="assigneeId"
                                    className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                                >
                                    Ansvarig
                                </label>
                                <select
                                    id="assigneeId"
                                    name="assigneeId"
                                    value={values.assigneeId}
                                    onChange={handleFieldChange}
                                    disabled={isLoadingLookups}
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
                                >
                                    {isLoadingLookups ? (
                                        <option value="">Laddar ansvariga...</option>
                                    ) : (
                                        <>
                                            <option value="">Välj ansvarig</option>
                                            {assignees.map((assignee) => (
                                                <option
                                                    key={assignee.assigneeId}
                                                    value={assignee.assigneeId}
                                                >
                                                    {assignee.name}
                                                </option>
                                            ))}
                                        </>
                                    )}
                                </select>
                                {errors.assigneeId ? (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.assigneeId}
                                    </p>
                                ) : null}
                            </div>

                            <div>
                                <label
                                    htmlFor="contactId"
                                    className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                                >
                                    Kontakt
                                </label>
                                <select
                                    id="contactId"
                                    name="contactId"
                                    value={values.contactId}
                                    onChange={handleFieldChange}
                                    disabled={isLoadingLookups || !values.customerId}
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
                                >
                                    {isLoadingLookups ? (
                                        <option value="">Laddar kontakter...</option>
                                    ) : !values.customerId ? (
                                        <option value="">Välj kund först</option>
                                    ) : filteredContacts.length === 0 ? (
                                        <option value="">Inga kontakter för vald kund</option>
                                    ) : (
                                        <>
                                            <option value="">Välj kontakt</option>
                                            {filteredContacts.map((contact) => (
                                                <option
                                                    key={contact.contactId}
                                                    value={contact.contactId}
                                                >
                                                    {contactLabel(contact)}
                                                </option>
                                            ))}
                                        </>
                                    )}
                                </select>
                                {errors.contactId ? (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.contactId}
                                    </p>
                                ) : null}
                            </div>

                            <div className="md:col-span-2 xl:col-span-4">
                                <label
                                    htmlFor="description"
                                    className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                                >
                                    Beskrivning
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={values.description}
                                    onChange={handleFieldChange}
                                    rows={2}
                                    placeholder="Kort sammanfattning av ärendet"
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                                />
                                {errors.description ? (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.description}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                        <h2 className="mb-2 text-lg font-semibold text-slate-900">
                            Ärendedata
                        </h2>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <div>
                                <label
                                    htmlFor="statusId"
                                    className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                                >
                                    Status
                                </label>
                                <select
                                    id="statusId"
                                    name="statusId"
                                    value={values.statusId}
                                    onChange={handleFieldChange}
                                    disabled={isLoadingLookups}
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
                                >
                                    {isLoadingLookups ? (
                                        <option value="">Laddar statusar...</option>
                                    ) : statuses.length === 0 ? (
                                        <option value="">Inga statusar hittades</option>
                                    ) : (
                                        statuses.map((status) => (
                                            <option
                                                key={status.statusId}
                                                value={status.statusId}
                                            >
                                                {status.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                                {errors.statusId ? (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.statusId}
                                    </p>
                                ) : null}
                            </div>

                            <div>
                                <label
                                    htmlFor="priorityId"
                                    className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"
                                >
                                    <span
                                        className="inline-block h-2.5 w-2.5 rounded-full"
                                        style={{
                                            backgroundColor:
                                                selectedPriority?.color ?? "#FFFFFF",
                                        }}
                                    />
                                    Prioritet
                                </label>
                                <select
                                    id="priorityId"
                                    name="priorityId"
                                    value={values.priorityId}
                                    onChange={handleFieldChange}
                                    disabled={isLoadingLookups}
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
                                >
                                    {isLoadingLookups ? (
                                        <option value="">Laddar prioriteter...</option>
                                    ) : priorities.length === 0 ? (
                                        <option value="">Inga prioriteter hittades</option>
                                    ) : (
                                        priorities.map((priority) => (
                                            <option
                                                key={priority.priorityId}
                                                value={priority.priorityId}
                                            >
                                                {priority.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                                {errors.priorityId ? (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.priorityId}
                                    </p>
                                ) : null}
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
                                    step="0.5"
                                    name="timeSpent"
                                    value={values.timeSpent}
                                    onChange={handleFieldChange}
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                                />
                                {errors.timeSpent ? (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.timeSpent}
                                    </p>
                                ) : null}
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
                                    step="1"
                                    name="agreedPrice"
                                    value={values.agreedPrice}
                                    onChange={handleFieldChange}
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                                />
                                {errors.agreedPrice ? (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.agreedPrice}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                        <label
                            htmlFor="initialHistoryNote"
                            className="mb-4 block text-lg font-semibold text-slate-900"
                        >
                            Första historiknotering
                        </label>
                        <p className="mb-3 text-sm text-slate-500">
                            Anteckningen sparas som första rad i historiken när
                            ärendet skapas.
                        </p>
                        <textarea
                            id="initialHistoryNote"
                            name="initialHistoryNote"
                            value={values.initialHistoryNote}
                            onChange={handleFieldChange}
                            rows={2}
                            placeholder="Skriv en första anteckning..."
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
                        />
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Inköp
                            </h2>
                            <button
                                type="button"
                                onClick={handleAddPurchase}
                                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-0.5 text-sm font-semibold text-[#E85D5D] shadow-[0_2px_6px_rgba(15,23,42,0.12)] transition hover:bg-slate-50"
                            >
                                <span className="mr-1 text-base leading-none text-slate-700">
                                    +
                                </span>
                                Lägg till inköp
                            </button>
                        </div>

                        {errors.purchases ? (
                            <p className="mb-3 text-sm text-red-600">
                                {errors.purchases}
                            </p>
                        ) : null}

                        {values.purchases.length === 0 ? (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                                Inga inköp tillagda än.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {values.purchases.map((purchase, index) => (
                                    <div
                                        key={index}
                                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                    >
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3 className="font-medium text-slate-900">
                                                Inköp {index + 1}
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePurchase(index)}
                                                className="rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                                            >
                                                Ta bort
                                            </button>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                                            <div>
                                                <label
                                                    htmlFor={`purchase-itemName-${index}`}
                                                    className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                                                >
                                                    Namn
                                                </label>
                                                <input
                                                    id={`purchase-itemName-${index}`}
                                                    value={purchase.itemName}
                                                    onChange={(event) =>
                                                        handlePurchaseChange(
                                                            index,
                                                            "itemName",
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder="HDMI kabel"
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor={`purchase-quantity-${index}`}
                                                    className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                                                >
                                                    Antal
                                                </label>
                                                <input
                                                    id={`purchase-quantity-${index}`}
                                                    type="number"
                                                    min="1"
                                                    step="1"
                                                    value={purchase.quantity}
                                                    onChange={(event) =>
                                                        handlePurchaseChange(
                                                            index,
                                                            "quantity",
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder="1"
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor={`purchase-purchasePrice-${index}`}
                                                    className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                                                >
                                                    Inköpspris
                                                </label>
                                                <input
                                                    id={`purchase-purchasePrice-${index}`}
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={purchase.purchasePrice}
                                                    onChange={(event) =>
                                                        handlePurchaseChange(
                                                            index,
                                                            "purchasePrice",
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder="0"
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor={`purchase-shippingCost-${index}`}
                                                    className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                                                >
                                                    Frakt
                                                </label>
                                                <input
                                                    id={`purchase-shippingCost-${index}`}
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={purchase.shippingCost}
                                                    onChange={(event) =>
                                                        handlePurchaseChange(
                                                            index,
                                                            "shippingCost",
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder="0"
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor={`purchase-salePrice-${index}`}
                                                    className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                                                >
                                                    Utpris
                                                </label>
                                                <input
                                                    id={`purchase-salePrice-${index}`}
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={purchase.salePrice}
                                                    onChange={(event) =>
                                                        handlePurchaseChange(
                                                            index,
                                                            "salePrice",
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder="0"
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/errands")}
                            className="rounded-full border border-slate-300 bg-white px-8 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                        >
                            Avbryt
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-full bg-[#79C6A3] px-10 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#69b894] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting ? "Sparar..." : "Spara ärende"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}