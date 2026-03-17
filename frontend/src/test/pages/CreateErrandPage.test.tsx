import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateErrandPage from "../../pages/CreateErrandPage.tsx";

const mockNavigate = vi.fn();
const mockCreateErrand = vi.fn();
const mockAddErrandHistoryEntry = vi.fn();

const mockFetchStatuses = vi.fn();
const mockFetchPriorities = vi.fn();
const mockFetchAssignees = vi.fn();
const mockFetchCustomers = vi.fn();
const mockFetchContacts = vi.fn();

vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock("../../api/errandsApi", () => ({
    createErrand: (...args: unknown[]) => mockCreateErrand(...args),
    addErrandHistoryEntry: (...args: unknown[]) => mockAddErrandHistoryEntry(...args),
}));

vi.mock("../../api/LookupsApi", () => ({
    fetchStatuses: (...args: unknown[]) => mockFetchStatuses(...args),
    fetchPriorities: (...args: unknown[]) => mockFetchPriorities(...args),
    fetchAssignees: (...args: unknown[]) => mockFetchAssignees(...args),
    fetchCustomers: (...args: unknown[]) => mockFetchCustomers(...args),
    fetchContacts: (...args: unknown[]) => mockFetchContacts(...args),
}));

const statuses = [
    { statusId: 1, name: "Ny" },
    { statusId: 2, name: "Pågår" },
];

const priorities = [
    { priorityId: 10, name: "Hög", color: "#ff0000" },
    { priorityId: 11, name: "Normal", color: "#0000ff" },
];

const assignees = [
    { assigneeId: 21, name: "Ronja" },
    { assigneeId: 22, name: "Viktor" },
];

const customers = [
    { customerId: 31, name: "Kund A" },
    { customerId: 32, name: "Kund B" },
];

const contacts = [
    {
        contactId: 41,
        customerId: 31,
        firstName: "Anna",
        lastName: "Andersson",
        mail: "anna@test.se",
    },
    {
        contactId: 42,
        customerId: 31,
        firstName: "Lisa",
        lastName: "Larsson",
        mail: "lisa@test.se",
    },
    {
        contactId: 43,
        customerId: 32,
        firstName: "Bertil",
        lastName: "Berg",
        mail: "bertil@test.se",
    },
];

describe("CreateErrandPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockFetchStatuses.mockResolvedValue(statuses);
        mockFetchPriorities.mockResolvedValue(priorities);
        mockFetchAssignees.mockResolvedValue(assignees);
        mockFetchCustomers.mockResolvedValue(customers);
        mockFetchContacts.mockResolvedValue(contacts);

        mockCreateErrand.mockResolvedValue({ errandId: 999 });
        mockAddErrandHistoryEntry.mockResolvedValue({});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const waitForLookupsToLoad = async () => {
        await screen.findByRole("option", { name: "Kund A" });

        await waitFor(() => {
            expect(screen.getByLabelText("Kund")).not.toBeDisabled();
            expect(screen.getByLabelText("Ansvarig")).not.toBeDisabled();
            expect(screen.getByLabelText("Status")).not.toBeDisabled();
            expect(screen.getByLabelText("Prioritet")).not.toBeDisabled();
        });
    };

    const fillRequiredFields = async () => {
        const user = userEvent.setup();

        await waitForLookupsToLoad();

        await user.selectOptions(screen.getByLabelText("Kund"), "31");
        await user.type(screen.getByLabelText("Titel"), "Nytt ärende");
        await user.selectOptions(screen.getByLabelText("Ansvarig"), "21");
        await user.selectOptions(screen.getByLabelText("Kontakt"), "41");
        await user.type(screen.getByLabelText("Beskrivning"), "Beskrivning av ärendet");

        return user;
    };

    it("loads lookups and renders form options", async () => {
        render(<CreateErrandPage />);

        expect(
            await screen.findByRole("heading", { name: "Skapa ärende" }),
        ).toBeInTheDocument();

        await waitFor(() => {
            expect(mockFetchStatuses).toHaveBeenCalledTimes(1);
            expect(mockFetchPriorities).toHaveBeenCalledTimes(1);
            expect(mockFetchAssignees).toHaveBeenCalledTimes(1);
            expect(mockFetchCustomers).toHaveBeenCalledTimes(1);
            expect(mockFetchContacts).toHaveBeenCalledTimes(1);
        });

        expect(screen.getByRole("option", { name: "Kund A" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Ronja" })).toBeInTheDocument();
    });

    it("sets first status and Normal priority as defaults after lookup load", async () => {
        render(<CreateErrandPage />);

        await waitForLookupsToLoad();

        expect(screen.getByLabelText("Status")).toHaveValue("1");
        expect(screen.getByLabelText("Prioritet")).toHaveValue("11");
    });

    it("shows contact select disabled until a customer is selected", async () => {
        render(<CreateErrandPage />);

        await waitForLookupsToLoad();

        const contactSelect = screen.getByLabelText("Kontakt");
        expect(contactSelect).toBeDisabled();
        expect(screen.getByRole("option", { name: "Välj kund först" })).toBeInTheDocument();
    });

    it("filters contacts by selected customer", async () => {
        const user = userEvent.setup();
        render(<CreateErrandPage />);

        await waitForLookupsToLoad();
        await user.selectOptions(screen.getByLabelText("Kund"), "31");

        const contactSelect = screen.getByLabelText("Kontakt");
        expect(contactSelect).not.toBeDisabled();

        expect(screen.getByRole("option", { name: "Anna Andersson" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Lisa Larsson" })).toBeInTheDocument();
        expect(screen.queryByRole("option", { name: "Bertil Berg" })).not.toBeInTheDocument();
    });

    it("resets selected contact when customer changes", async () => {
        const user = userEvent.setup();
        render(<CreateErrandPage />);

        await waitForLookupsToLoad();

        await user.selectOptions(screen.getByLabelText("Kund"), "31");
        await user.selectOptions(screen.getByLabelText("Kontakt"), "41");
        expect(screen.getByLabelText("Kontakt")).toHaveValue("41");

        await user.selectOptions(screen.getByLabelText("Kund"), "32");
        expect(screen.getByLabelText("Kontakt")).toHaveValue("");
    });

    it("shows validation errors for required fields", async () => {
        const user = userEvent.setup();
        render(<CreateErrandPage />);

        await waitForLookupsToLoad();
        await user.click(screen.getByRole("button", { name: "Spara ärende" }));

        expect(await screen.findByText("Titel är obligatorisk")).toBeInTheDocument();
        expect(screen.getByText("Beskrivning är obligatorisk")).toBeInTheDocument();
        expect(screen.getByText("Kund måste väljas")).toBeInTheDocument();
        expect(screen.getByText("Kontaktperson måste väljas")).toBeInTheDocument();
        expect(screen.getByText("Ansvarig måste väljas")).toBeInTheDocument();

        expect(mockCreateErrand).not.toHaveBeenCalled();
    });

    it("shows validation errors for negative numbers", async () => {
        render(<CreateErrandPage />);
        const user = await fillRequiredFields();

        const timeSpentInput = screen.getByLabelText("Tidsåtgång") as HTMLInputElement;
        const agreedPriceInput = screen.getByLabelText("Överenskommet pris (SEK)") as HTMLInputElement;

        fireEvent.change(timeSpentInput, {
            target: { value: "-1" },
        });

        fireEvent.change(agreedPriceInput, {
            target: { value: "-5" },
        });

        expect(timeSpentInput.value).toBe("-1");
        expect(agreedPriceInput.value).toBe("-5");

        await user.click(screen.getByRole("button", { name: "Spara ärende" }));

        screen.debug();

        expect(screen.getByText("Tidsåtgång måste vara 0 eller mer")).toBeInTheDocument();
        expect(screen.getByText("Överenskommet pris måste vara 0 eller mer")).toBeInTheDocument();

        expect(mockCreateErrand).not.toHaveBeenCalled();
    });

    it("adds and removes purchase rows", async () => {
        const user = userEvent.setup();
        render(<CreateErrandPage />);

        await waitForLookupsToLoad();
        expect(screen.getByText("Inga inköp tillagda än.")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /lägg till inköp/i }));
        expect(screen.getByText("Inköp 1")).toBeInTheDocument();
        expect(screen.queryByText("Inga inköp tillagda än.")).not.toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Ta bort" }));
        expect(screen.getByText("Inga inköp tillagda än.")).toBeInTheDocument();
    });

    it("validates purchase fields", async () => {
        render(<CreateErrandPage />);
        const user = await fillRequiredFields();

        await user.click(screen.getByRole("button", { name: /lägg till inköp/i }));
        await user.clear(screen.getByPlaceholderText("HDMI kabel"));

        await user.click(screen.getByRole("button", { name: "Spara ärende" }));

        expect(await screen.findByText("Alla inköp måste ha namn")).toBeInTheDocument();
        expect(mockCreateErrand).not.toHaveBeenCalled();
    });

    it("submits form with correct payload and navigates", async () => {
        render(<CreateErrandPage />);
        const user = await fillRequiredFields();

        await user.clear(screen.getByLabelText("Tidsåtgång"));
        await user.type(screen.getByLabelText("Tidsåtgång"), "2.5");

        await user.clear(screen.getByLabelText("Överenskommet pris (SEK)"));
        await user.type(screen.getByLabelText("Överenskommet pris (SEK)"), "1500");

        await user.click(screen.getByRole("button", { name: /lägg till inköp/i }));

        const purchaseNameInput = screen.getByPlaceholderText("HDMI kabel");
        await user.type(purchaseNameInput, "Adapter");

        const spinbuttons = screen.getAllByRole("spinbutton");

        await user.clear(spinbuttons[2]);
        await user.type(spinbuttons[2], "2");

        await user.clear(spinbuttons[3]);
        await user.type(spinbuttons[3], "100");

        await user.clear(spinbuttons[4]);
        await user.type(spinbuttons[4], "25");

        await user.clear(spinbuttons[5]);
        await user.type(spinbuttons[5], "180");

        await user.click(screen.getByRole("button", { name: "Spara ärende" }));

        await waitFor(() => {
            expect(mockCreateErrand).toHaveBeenCalledTimes(1);
        });

        expect(mockCreateErrand).toHaveBeenCalledWith({
            title: "Nytt ärende",
            description: "Beskrivning av ärendet",
            statusId: 1,
            priorityId: 11,
            assigneeId: 21,
            customerId: 31,
            contactId: 41,
            timeSpent: 2.5,
            agreedPrice: 1500,
            purchases: [
                {
                    itemName: "Adapter",
                    quantity: 2,
                    purchasePrice: 100,
                    shippingCost: 25,
                    salePrice: 180,
                },
            ],
        });

        expect(mockNavigate).toHaveBeenCalledWith("/errands");
    });

    it("creates initial history note after errand creation", async () => {
        render(<CreateErrandPage />);
        const user = await fillRequiredFields();

        await user.type(
            screen.getByPlaceholderText("Skriv en första anteckning..."),
            "Första anteckning",
        );

        await user.click(screen.getByRole("button", { name: "Spara ärende" }));

        await waitFor(() => {
            expect(mockCreateErrand).toHaveBeenCalledTimes(1);
        });

        expect(mockAddErrandHistoryEntry).toHaveBeenCalledWith(999, {
            description: "Första anteckning",
        });
        expect(mockNavigate).toHaveBeenCalledWith("/errands");
    });

    it("shows warning if history note fails but still navigates", async () => {
        mockAddErrandHistoryEntry.mockRejectedValueOnce(new Error("History failed"));

        render(<CreateErrandPage />);
        const user = await fillRequiredFields();

        await user.type(
            screen.getByPlaceholderText("Skriv en första anteckning..."),
            "Första anteckning",
        );

        await user.click(screen.getByRole("button", { name: "Spara ärende" }));

        await waitFor(() => {
            expect(mockCreateErrand).toHaveBeenCalledTimes(1);
        });

        expect(
            await screen.findByText(
                "Ärendet skapades, men första historiknoteringen kunde inte sparas.",
            ),
        ).toBeInTheDocument();

        expect(mockNavigate).toHaveBeenCalledWith("/errands");
    });

    it("shows submit error when createErrand fails", async () => {
        mockCreateErrand.mockRejectedValueOnce(new Error("Kunde inte skapa"));

        render(<CreateErrandPage />);
        const user = await fillRequiredFields();

        await user.click(screen.getByRole("button", { name: "Spara ärende" }));

        expect(await screen.findByText("Kunde inte skapa")).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("shows partial lookup warning when one lookup call fails", async () => {
        mockFetchContacts.mockRejectedValueOnce(new Error("Kontakter nere"));

        render(<CreateErrandPage />);

        expect(
            await screen.findByText(/Kunde inte hämta alla valbara listor\./i),
        ).toBeInTheDocument();
        expect(screen.getByText(/Kontakter: Kontakter nere/i)).toBeInTheDocument();
    });

    it("navigates back when cancel is clicked", async () => {
        const user = userEvent.setup();
        render(<CreateErrandPage />);

        await waitForLookupsToLoad();
        await user.click(screen.getByRole("button", { name: "Avbryt" }));

        expect(mockNavigate).toHaveBeenCalledWith("/errands");
    });

    it("shows submitting state while saving", async () => {
        let resolveCreate!: (value: { errandId: number }) => void;

        mockCreateErrand.mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveCreate = resolve;
                }),
        );

        render(<CreateErrandPage />);
        const user = await fillRequiredFields();

        await user.click(screen.getByRole("button", { name: "Spara ärende" }));

        expect(screen.getByRole("button", { name: "Sparar..." })).toBeDisabled();

        resolveCreate({ errandId: 999 });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/errands");
        });
    });
});