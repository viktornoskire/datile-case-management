import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Reports from "../../pages/Reports.tsx";

const mockFetchReports = vi.fn();
const mockExportReportsCsv = vi.fn();
const mockFetchCustomers = vi.fn();
const mockFetchAssignees = vi.fn();
const mockFetchStatuses = vi.fn();
const mockFetchPriorities = vi.fn();

// testcommand: npx vitest run src/test/pages/Reports.test.tsx

vi.mock("../../api/reportsApi", () => ({
    fetchReports: (...args: unknown[]) => mockFetchReports(...args),
    exportReportsCsv: (...args: unknown[]) => mockExportReportsCsv(...args),
}));

vi.mock("../../api/LookupsApi", () => ({
    fetchCustomers: (...args: unknown[]) => mockFetchCustomers(...args),
    fetchAssignees: (...args: unknown[]) => mockFetchAssignees(...args),
    fetchStatuses: (...args: unknown[]) => mockFetchStatuses(...args),
    fetchPriorities: (...args: unknown[]) => mockFetchPriorities(...args),
}));

vi.mock("../../components/ReportFilterPanel", () => ({
    ReportFilterPanel: ({
                            filters,
                            onChange,
                            onClear,
                            customers,
                            assignees,
                            statuses,
                            priorities,
                        }: {
        filters: Record<string, unknown>;
        onChange: (next: unknown) => void;
        onClear: () => void;
        customers: Array<{ value: number; label: string }>;
        assignees: Array<{ value: number; label: string }>;
        statuses: Array<{ value: number; label: string }>;
        priorities: Array<{ value: number; label: string }>;
    }) => (
        <div data-testid="report-filter-panel">
            <div>customers:{customers.length}</div>
            <div>assignees:{assignees.length}</div>
            <div>statuses:{statuses.length}</div>
            <div>priorities:{priorities.length}</div>
            <div>page:{String(filters.page ?? "")}</div>

            <button
                type="button"
                onClick={() =>
                    onChange({
                        ...filters,
                        customerId: 1,
                        page: 0,
                    })
                }
            >
                Change filter
            </button>

            <button type="button" onClick={onClear}>
                Clear filters
            </button>
        </div>
    ),
}));

vi.mock("../../components/ReportListRow", () => ({
    ReportListRow: ({
                        report,
                        isExpanded,
                        onToggleExpand,
                        onEdit,
                        onQuickAddPurchase,
                    }: {
        report: {
            errandId: number;
            title: string;
        };
        isExpanded: boolean;
        onToggleExpand: (errandId: number) => void;
        onEdit: (errandId: number) => void;
        onQuickAddPurchase: (errandId: number) => void;
    }) => (
        <div data-testid={`report-row-${report.errandId}`}>
            <div>{report.title}</div>
            <div>{isExpanded ? "expanded" : "collapsed"}</div>

            <button type="button" onClick={() => onToggleExpand(report.errandId)}>
                Toggle row {report.errandId}
            </button>

            <button type="button" onClick={() => onEdit(report.errandId)}>
                Edit row {report.errandId}
            </button>

            <button type="button" onClick={() => onQuickAddPurchase(report.errandId)}>
                Purchase row {report.errandId}
            </button>
        </div>
    ),
}));

vi.mock("../../components/ReportPagination", () => ({
    ReportPagination: ({
                           page,
                           totalPages,
                           onPageChange,
                       }: {
        page: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    }) => (
        <div data-testid="report-pagination">
            <div>
                pagination:{page}/{totalPages}
            </div>
            <button type="button" onClick={() => onPageChange(1)}>
                Next page
            </button>
        </div>
    ),
}));

vi.mock("../../components/ErrandDetailsModal", () => ({
    ErrandDetailsModal: ({
                             errandId,
                             onClose,
                             startWithPurchaseFormOpen,
                             onErrandUpdated,
                         }: {
        errandId: number;
        onClose: () => void;
        startWithPurchaseFormOpen: boolean;
        onErrandUpdated: (updatedErrand: unknown) => Promise<void>;
    }) => (
        <div data-testid="errand-details-modal">
            <div>modal errand:{errandId}</div>
            <div>purchase-open:{startWithPurchaseFormOpen ? "yes" : "no"}</div>

            <button type="button" onClick={onClose}>
                Close modal
            </button>

            <button
                type="button"
                onClick={() => void onErrandUpdated({ errandId })}
            >
                Save errand
            </button>
        </div>
    ),
}));

const reportsResponse = {
    reports: [
        {
            errandId: 101,
            title: "Byt skärm",
            customerName: "Kund A",
            contactName: "Anna Andersson",
            assigneeName: "Ronja",
            statusName: "Ny",
            priorityName: "Hög",
            agreedPrice: 2500,
            createdAt: "2026-03-16T10:00:00",
            totalTimeSpentMinutes: 90,
            purchases: [],
        },
        {
            errandId: 102,
            title: "Installera nätverk",
            customerName: "Kund B",
            contactName: "Bertil Berg",
            assigneeName: "Test User",
            statusName: "Pågår",
            priorityName: "Normal",
            agreedPrice: 4900,
            createdAt: "2026-03-15T10:00:00",
            totalTimeSpentMinutes: 120,
            purchases: [],
        },
    ],
    page: 0,
    totalPages: 3,
    totalElements: 2,
};

describe("Reports page", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockFetchCustomers.mockResolvedValue([
            { customerId: 1, name: "Kund A" },
            { customerId: 2, name: "Kund B" },
        ]);

        mockFetchAssignees.mockResolvedValue([
            { assigneeId: 1, name: "Ronja" },
            { assigneeId: 2, name: "Viktor" },
        ]);

        mockFetchStatuses.mockResolvedValue([
            { statusId: 1, name: "Ny" },
            { statusId: 2, name: "Pågår" },
        ]);

        mockFetchPriorities.mockResolvedValue([
            { priorityId: 1, name: "Hög" },
            { priorityId: 2, name: "Normal" },
        ]);

        mockFetchReports.mockResolvedValue(reportsResponse);
        mockExportReportsCsv.mockResolvedValue(
            new Blob(["id,title"], { type: "text/csv" }),
        );

        vi.spyOn(window.URL, "createObjectURL").mockReturnValue("blob:mock-url");
        vi.spyOn(window.URL, "revokeObjectURL").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("renders loading state first", async () => {
        render(<Reports />);

        expect(screen.getByText("Laddar rapporter…")).toBeInTheDocument();

        await screen.findByText("Byt skärm");
    });

    it("loads filter options and reports on first render", async () => {
        render(<Reports />);

        await waitFor(() => {
            expect(mockFetchReports).toHaveBeenCalledTimes(1);
        });

        expect(mockFetchCustomers).toHaveBeenCalledTimes(1);
        expect(mockFetchAssignees).toHaveBeenCalledTimes(1);
        expect(mockFetchStatuses).toHaveBeenCalledTimes(1);
        expect(mockFetchPriorities).toHaveBeenCalledTimes(1);

        expect(await screen.findByText("Byt skärm")).toBeInTheDocument();
        expect(screen.getByText("Installera nätverk")).toBeInTheDocument();
    });

    it("shows hit counter when data has loaded", async () => {
        render(<Reports />);

        expect(await screen.findByText("2 träffar")).toBeInTheDocument();
    });

    it("passes lookup options to filter panel", async () => {
        render(<Reports />);

        expect(await screen.findByTestId("report-filter-panel")).toBeInTheDocument();
        expect(screen.getByText("customers:2")).toBeInTheDocument();
        expect(screen.getByText("assignees:2")).toBeInTheDocument();
        expect(screen.getByText("statuses:2")).toBeInTheDocument();
        expect(screen.getByText("priorities:2")).toBeInTheDocument();
    });

    it("shows error message when fetchReports fails", async () => {
        mockFetchReports.mockRejectedValueOnce(new Error("API fail"));

        render(<Reports />);

        expect(await screen.findByText("Fel: API fail")).toBeInTheDocument();
    });

    it("shows empty state when no reports match filters", async () => {
        mockFetchReports.mockResolvedValueOnce({
            reports: [],
            page: 0,
            totalPages: 0,
            totalElements: 0,
        });

        render(<Reports />);

        expect(
            await screen.findByText("Inga ärenden matchar dina filter."),
        ).toBeInTheDocument();
    });

    it("reloads reports when filters change", async () => {
        const user = userEvent.setup();
        render(<Reports />);

        await screen.findByText("Byt skärm");

        await user.click(screen.getByRole("button", { name: "Change filter" }));

        await waitFor(() => {
            expect(mockFetchReports).toHaveBeenCalledTimes(2);
        });
    });

    it("clears filters and collapses expanded rows", async () => {
        const user = userEvent.setup();
        render(<Reports />);

        await screen.findByText("Byt skärm");

        await user.click(screen.getByRole("button", { name: "Toggle row 101" }));
        expect(screen.getByTestId("report-row-101")).toHaveTextContent("expanded");

        await user.click(screen.getByRole("button", { name: "Clear filters" }));

        await waitFor(() => {
            expect(mockFetchReports).toHaveBeenCalledTimes(2);
        });

        expect(screen.getByTestId("report-row-101")).toHaveTextContent("collapsed");
    });

    it("toggles expanded row state", async () => {
        const user = userEvent.setup();
        render(<Reports />);

        await screen.findByText("Byt skärm");

        const row = screen.getByTestId("report-row-101");
        expect(row).toHaveTextContent("collapsed");

        await user.click(screen.getByRole("button", { name: "Toggle row 101" }));
        expect(row).toHaveTextContent("expanded");

        await user.click(screen.getByRole("button", { name: "Toggle row 101" }));
        expect(row).toHaveTextContent("collapsed");
    });

    it("changes page through pagination", async () => {
        const user = userEvent.setup();
        render(<Reports />);

        await screen.findByText("Byt skärm");

        await user.click(screen.getByRole("button", { name: "Next page" }));

        await waitFor(() => {
            expect(mockFetchReports).toHaveBeenCalledTimes(2);
        });
    });

    it("opens edit modal from row action", async () => {
        const user = userEvent.setup();
        render(<Reports />);

        await screen.findByText("Byt skärm");

        await user.click(screen.getByRole("button", { name: "Edit row 101" }));

        expect(await screen.findByTestId("errand-details-modal")).toBeInTheDocument();
        expect(screen.getByText("modal errand:101")).toBeInTheDocument();
        expect(screen.getByText("purchase-open:no")).toBeInTheDocument();
    });

    it("opens purchase modal with purchase form enabled", async () => {
        const user = userEvent.setup();
        render(<Reports />);

        await screen.findByText("Byt skärm");

        await user.click(screen.getByRole("button", { name: "Purchase row 101" }));

        expect(await screen.findByTestId("errand-details-modal")).toBeInTheDocument();
        expect(screen.getByText("modal errand:101")).toBeInTheDocument();
        expect(screen.getByText("purchase-open:yes")).toBeInTheDocument();
    });

    it("closes edit modal", async () => {
        const user = userEvent.setup();
        render(<Reports />);

        await screen.findByText("Byt skärm");

        await user.click(screen.getByRole("button", { name: "Edit row 101" }));
        expect(await screen.findByTestId("errand-details-modal")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Close modal" }));

        await waitFor(() => {
            expect(screen.queryByTestId("errand-details-modal")).not.toBeInTheDocument();
        });
    });

    it("reloads reports after errand update and closes modal", async () => {
        const user = userEvent.setup();
        render(<Reports />);

        await screen.findByText("Byt skärm");

        await user.click(screen.getByRole("button", { name: "Edit row 101" }));
        expect(await screen.findByTestId("errand-details-modal")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Save errand" }));

        await waitFor(() => {
            expect(mockFetchReports).toHaveBeenCalledTimes(2);
        });

        await waitFor(() => {
            expect(screen.queryByTestId("errand-details-modal")).not.toBeInTheDocument();
        });
    });

    it("exports csv when export button is clicked", async () => {
        const user = userEvent.setup();
        const clickSpy = vi.fn();
        const originalCreateElement = document.createElement.bind(document);

        const createElementSpy = vi
            .spyOn(document, "createElement")
            .mockImplementation((tagName: string) => {
                if (tagName === "a") {
                    const anchor = originalCreateElement("a");
                    anchor.click = clickSpy;
                    return anchor;
                }

                return originalCreateElement(tagName);
            });

        render(<Reports />);

        await screen.findByText("Byt skärm");

        await user.click(screen.getByRole("button", { name: "Exportera .CSV" }));

        await waitFor(() => {
            expect(mockExportReportsCsv).toHaveBeenCalledTimes(1);
        });

        expect(window.URL.createObjectURL).toHaveBeenCalled();
        expect(clickSpy).toHaveBeenCalledTimes(1);

        createElementSpy.mockRestore();
    });

    it("shows export error if csv export fails", async () => {
        const user = userEvent.setup();
        mockExportReportsCsv.mockRejectedValueOnce(new Error("Export failed badly"));

        render(<Reports />);

        await screen.findByText("Byt skärm");

        await user.click(screen.getByRole("button", { name: "Exportera .CSV" }));

        expect(
            await screen.findByText("Fel: Export failed badly"),
        ).toBeInTheDocument();
    });
});