import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {act, fireEvent, render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Errands from "../../pages/Errands.tsx";

const mockFetchErrands = vi.fn();
const mockNavigate = vi.fn();
const mockBuildErrandFilterParams = vi.fn();

vi.mock("../../api/errandsApi", () => ({
    fetchErrands: (...args: unknown[]) => mockFetchErrands(...args),
}));

vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock("../../types/errands", () => ({
    initialErrandFilters: {
        q: "",
        sortBy: "createdAt",
        statuses: [],
        priorities: [],
        assigneeId: "",
        customerId: "",
    },
    buildErrandFilterParams: (...args: unknown[]) =>
        mockBuildErrandFilterParams(...args),
}));

vi.mock("../../components/ErrandCard", () => ({
    ErrandCard: ({
                     errand,
                     onOpen,
                     onEdit,
                 }: {
        errand: {
            errandId: number;
            title: string;
        };
        onOpen: (errandId: number) => void;
        onEdit: (errandId: number) => void;
    }) => (
        <div data-testid={`errand-card-${errand.errandId}`}>
            <div>{errand.title}</div>

            <button type="button" onClick={() => onOpen(errand.errandId)}>
                Open card {errand.errandId}
            </button>

            <button type="button" onClick={() => onEdit(errand.errandId)}>
                Edit card {errand.errandId}
            </button>
        </div>
    ),
}));

vi.mock("../../components/ErrandListRow", () => ({
    ErrandListRow: ({
                        errand,
                        onOpen,
                        onEdit,
                    }: {
        errand: {
            errandId: number;
            title: string;
        };
        onOpen: (errandId: number) => void;
        onEdit: (errandId: number) => void;
    }) => (
        <div data-testid={`errand-row-${errand.errandId}`}>
            <div>{errand.title}</div>

            <button type="button" onClick={() => onOpen(errand.errandId)}>
                Open row {errand.errandId}
            </button>

            <button type="button" onClick={() => onEdit(errand.errandId)}>
                Edit row {errand.errandId}
            </button>
        </div>
    ),
}));

vi.mock("../../components/FilterPanel", () => ({
    FilterPanel: ({
                      filters,
                      onChange,
                      onClear,
                      onClose,
                  }: {
        filters: Record<string, unknown>;
        onChange: (next: unknown) => void;
        onClear: () => void;
        onClose: () => void;
    }) => (
        <div data-testid="filter-panel">
            <div>filter-q:{String(filters.q ?? "")}</div>

            <button
                type="button"
                onClick={() =>
                    onChange({
                        ...filters,
                        customerId: "1",
                    })
                }
            >
                Change filters
            </button>

            <button type="button" onClick={onClear}>
                Clear filters
            </button>

            <button type="button" onClick={onClose}>
                Close filters
            </button>
        </div>
    ),
}));

vi.mock("../../components/ErrandDetailsModal", () => ({
    ErrandDetailsModal: ({
                             errandId,
                             mode,
                             onClose,
                             onErrandUpdated,
                         }: {
        errandId: number;
        mode: "view" | "edit";
        onClose: () => void;
        onErrandUpdated: (updatedErrand: {
            errandId: number;
            title: string;
            description: string;
            status: { name: string };
            priority: { name: string };
            assignee: { name: string };
            customer: { name: string };
            contact: { name: string };
            history?: Array<{ text: string }>;
        }) => void;
    }) => (
        <div data-testid="errand-details-modal">
            <div>modal-id:{errandId}</div>
            <div>modal-mode:{mode}</div>

            <button type="button" onClick={onClose}>
                Close modal
            </button>

            <button
                type="button"
                onClick={() =>
                    onErrandUpdated({
                        errandId,
                        title: "Updated errand title",
                        description: "Updated description",
                        status: {name: "Klar"},
                        priority: {name: "Hög"},
                        assignee: {name: "Ronja"},
                        customer: {name: "Kund X"},
                        contact: {name: "Lisa"},
                        history: [{text: "one"}, {text: "two"}, {text: "three"}],
                    })
                }
            >
                Save updated errand
            </button>
        </div>
    ),
}));

const errandsResponse = {
    errands: [
        {
            errandId: 101,
            title: "Byt skärm",
            description: "Skärm trasig",
            status: {name: "Ny"},
            priority: {name: "Hög"},
            assignee: {name: "Ronja"},
            customer: {name: "Kund A"},
            contact: {name: "Anna"},
            historyPreview: [],
            createdAt: "2026-03-17T08:00:00",
        },
        {
            errandId: 102,
            title: "Installera nätverk",
            description: "Sätta upp nätverk",
            status: {name: "Pågår"},
            priority: {name: "Normal"},
            assignee: {name: "Viktor"},
            customer: {name: "Kund B"},
            contact: {name: "Bertil"},
            historyPreview: [],
            createdAt: "2026-03-16T08:00:00",
        },
    ],
};

describe("Errands page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useRealTimers();

        mockBuildErrandFilterParams.mockReturnValue({});
        mockFetchErrands.mockResolvedValue(errandsResponse);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it("renders loading state first", async () => {
        render(<Errands/>);

        expect(screen.getByText("Laddar ärenden…")).toBeInTheDocument();

        await screen.findByText("Byt skärm");
    });

    it("loads errands on first render", async () => {
        render(<Errands/>);

        await waitFor(() => {
            expect(mockFetchErrands).toHaveBeenCalledTimes(1);
        });

        expect(await screen.findByText("Byt skärm")).toBeInTheDocument();
        expect(screen.getByText("Installera nätverk")).toBeInTheDocument();
    });

    it("shows error message when fetch fails", async () => {
        mockFetchErrands.mockRejectedValueOnce(new Error("API fail"));

        render(<Errands/>);

        expect(await screen.findByText("Fel: API fail")).toBeInTheDocument();
    });

    it("shows fallback when no data exists", async () => {
        mockFetchErrands.mockResolvedValueOnce(null);

        render(<Errands/>);

        expect(await screen.findByText("Inga ärenden hittades.")).toBeInTheDocument();
    });

    it("shows empty state when errands array is empty", async () => {
        mockFetchErrands.mockResolvedValueOnce({
            errands: [],
        });

        render(<Errands/>);

        expect(
            await screen.findByText("Inga ärenden matchar sökningen"),
        ).toBeInTheDocument();
    });

    it("shows errand count", async () => {
        render(<Errands/>);

        expect(await screen.findByText("2 ärenden")).toBeInTheDocument();
    });

    it("renders cards view by default", async () => {
        render(<Errands/>);

        expect(await screen.findByTestId("errand-card-101")).toBeInTheDocument();
        expect(screen.getByTestId("errand-card-102")).toBeInTheDocument();
    });

    it("switches to list view", async () => {
        const user = userEvent.setup();
        render(<Errands/>);

        await screen.findByText("Byt skärm");

        await user.click(screen.getByRole("button", {name: "Lista"}));

        expect(await screen.findByTestId("errand-row-101")).toBeInTheDocument();
        expect(screen.getByTestId("errand-row-102")).toBeInTheDocument();
    });

    it("navigates to create errand page", async () => {
        const user = userEvent.setup();
        render(<Errands/>);

        await screen.findByText("Byt skärm");

        await user.click(screen.getByRole("button", {name: "Skapa ärende"}));

        expect(mockNavigate).toHaveBeenCalledWith("/errands/new");
    });

    it("opens filter panel from button", async () => {
        const user = userEvent.setup();
        render(<Errands/>);

        await screen.findByText("Byt skärm");

        await user.click(screen.getByRole("button", {name: "Visa filter"}));

        expect(await screen.findByTestId("filter-panel")).toBeInTheDocument();
    });

    it("closes filter panel", async () => {
        const user = userEvent.setup();
        render(<Errands/>);

        await screen.findByText("Byt skärm");

        await user.click(screen.getByRole("button", {name: "Visa filter"}));
        expect(await screen.findByTestId("filter-panel")).toBeInTheDocument();

        await user.click(screen.getByRole("button", {name: "Close filters"}));

        expect(await screen.findByRole("button", {name: "Visa filter"})).toBeInTheDocument();
    });

    it("clears filters from filter panel", async () => {
        const user = userEvent.setup();
        render(<Errands/>);

        await screen.findByText("Byt skärm");
        expect(mockFetchErrands).toHaveBeenCalledTimes(1);

        await user.click(screen.getByRole("button", {name: "Visa filter"}));
        expect(await screen.findByTestId("filter-panel")).toBeInTheDocument();

        await user.click(screen.getByRole("button", {name: "Change filters"}));

        await waitFor(() => {
            expect(mockFetchErrands).toHaveBeenCalledTimes(2);
        });

        await user.click(screen.getByRole("button", {name: "Clear filters"}));

        await waitFor(() => {
            expect(mockFetchErrands).toHaveBeenCalledTimes(3);
        });
    });

    it("opens view modal from card", async () => {
        const user = userEvent.setup();
        render(<Errands/>);

        await screen.findByText("Byt skärm");

        await user.click(screen.getByRole("button", {name: "Open card 101"}));

        expect(await screen.findByTestId("errand-details-modal")).toBeInTheDocument();
        expect(screen.getByText("modal-id:101")).toBeInTheDocument();
        expect(screen.getByText("modal-mode:view")).toBeInTheDocument();
    });

    it("opens edit modal from card", async () => {
        const user = userEvent.setup();
        render(<Errands/>);

        await screen.findByText("Byt skärm");

        await user.click(screen.getByRole("button", {name: "Edit card 101"}));

        expect(await screen.findByTestId("errand-details-modal")).toBeInTheDocument();
        expect(screen.getByText("modal-id:101")).toBeInTheDocument();
        expect(screen.getByText("modal-mode:edit")).toBeInTheDocument();
    });

    it("opens view modal from list row", async () => {
        const user = userEvent.setup();
        render(<Errands/>);

        await screen.findByText("Byt skärm");
        await user.click(screen.getByRole("button", {name: "Lista"}));

        await user.click(screen.getByRole("button", {name: "Open row 101"}));

        expect(await screen.findByTestId("errand-details-modal")).toBeInTheDocument();
        expect(screen.getByText("modal-mode:view")).toBeInTheDocument();
    });

    it("closes modal", async () => {
        const user = userEvent.setup();
        render(<Errands/>);

        await screen.findByText("Byt skärm");
        await user.click(screen.getByRole("button", {name: "Open card 101"}));

        expect(await screen.findByTestId("errand-details-modal")).toBeInTheDocument();

        await user.click(screen.getByRole("button", {name: "Close modal"}));

        await waitFor(() => {
            expect(screen.queryByTestId("errand-details-modal")).not.toBeInTheDocument();
        });
    });

    it("updates errand in local state after modal save", async () => {
        const user = userEvent.setup();
        render(<Errands/>);

        await screen.findByText("Byt skärm");
        await user.click(screen.getByRole("button", {name: "Edit card 101"}));

        expect(await screen.findByTestId("errand-details-modal")).toBeInTheDocument();

        await user.click(screen.getByRole("button", {name: "Save updated errand"}));

        expect(await screen.findByText("Updated errand title")).toBeInTheDocument();
    });

    it("debounces search input before fetching again", async () => {
        render(<Errands/>);

        await screen.findByText("Byt skärm");
        expect(mockFetchErrands).toHaveBeenCalledTimes(1);

        vi.useFakeTimers();

        const searchInput = screen.getByPlaceholderText("Sök ärende...");

        fireEvent.change(searchInput, {
            target: {value: "router"},
        });

        expect(mockFetchErrands).toHaveBeenCalledTimes(1);

        await act(async () => {
            vi.advanceTimersByTime(399);
        });

        expect(mockFetchErrands).toHaveBeenCalledTimes(1);

        await act(async () => {
            vi.advanceTimersByTime(1);
        });

        expect(mockFetchErrands).toHaveBeenCalledTimes(2);

        vi.useRealTimers();
    });
});