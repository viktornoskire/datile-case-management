import type { ReactNode } from "react";
import {
    errandPriorityOptions,
    errandStatusOptions,
    type ErrandAssignee,
    type ErrandFilters,
} from "../types/errands";
import type { CustomerLookup } from "../api/LookupsApi";

type FilterPanelProps = {
    filters: ErrandFilters;
    onChange: (next: ErrandFilters) => void;
    onClear: () => void;
    onClose: () => void;
    customers: CustomerLookup[];
    assignees: ErrandAssignee[];
};

type ChipOption = {
    label: string;
    value: string;
};

const sortOptions = [
    { value: "date", label: "Datum" },
    { value: "title", label: "Rubrik" },
    { value: "timeSpent", label: "Tidsåtgång" },
];

type ChipGroupProps = {
    label: string;
    options: readonly ChipOption[];
    selectedValues: string[];
    onToggle: (value: string) => void;
};

function ChipGroup({ label, options, selectedValues, onToggle }: ChipGroupProps) {
    return (
        <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">{label}</p>

            <div className="flex flex-wrap gap-2">
                {options.map((option) => {
                    const isActive = selectedValues.includes(option.value);

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onToggle(option.value)}
                            className={`rounded-full border px-3 py-1 text-sm font-semibold transition ${
                                isActive
                                    ? "border-emerald-300 bg-emerald-200 text-slate-800"
                                    : "border-emerald-200 bg-white text-slate-700 hover:bg-emerald-50"
                            }`}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

const toggleArrayValue = (values: string[], value: string) => {
    return values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value];
};

type SelectFieldProps = {
    value: string;
    onChange: (value: string) => void;
    children: ReactNode;
};

function SelectField({ value, onChange, children }: SelectFieldProps) {
    return (
        <div className="relative max-w-[180px]">
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full appearance-none rounded-full border border-slate-200 bg-white px-4 py-1.5 pr-10 text-left text-sm shadow-sm outline-none"
            >
                {children}
            </select>

            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500">
                ▾
            </span>
        </div>
    );
}

export function FilterPanel({
                                filters,
                                onChange,
                                onClear,
                                onClose,
                                customers,
                                assignees,
                            }: FilterPanelProps) {
    return (
        <section className="mb-6 max-w-5xl rounded-[24px] border border-slate-200 bg-[#f7f7f7] px-4 py-3 shadow-sm">
            <div className="mb-3 flex items-start justify-between">
                <h2 className="text-xl font-semibold tracking-tight text-slate-300">
                    Filtrera ärenden
                </h2>

                <button
                    type="button"
                    onClick={onClose}
                    className="text-lg font-bold text-slate-400 hover:text-slate-600"
                    aria-label="Stäng filterpanel"
                >
                    ×
                </button>
            </div>

            <div className="mb-4 grid gap-4 lg:grid-cols-[160px_160px_160px_1fr]">
                <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">
                        Sökordning:
                    </label>
                    <SelectField
                        value={filters.sortBy}
                        onChange={(value) =>
                            onChange({
                                ...filters,
                                sortBy: value,
                                page: 0,
                            })
                        }
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </SelectField>
                </div>

                <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">
                        Kund:
                    </label>
                    <SelectField
                        value={filters.customerId}
                        onChange={(value) =>
                            onChange({
                                ...filters,
                                customerId: value,
                                page: 0,
                            })
                        }
                    >
                        <option value="">Kund</option>
                        {customers.map((customer) => (
                            <option key={customer.customerId} value={customer.customerId}>
                                {customer.name}
                            </option>
                        ))}
                    </SelectField>
                </div>

                <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">
                        Ansvarig:
                    </label>
                    <SelectField
                        value={filters.assigneeId}
                        onChange={(value) =>
                            onChange({
                                ...filters,
                                assigneeId: value,
                                page: 0,
                            })
                        }
                    >
                        <option value="">Ansvarig</option>
                        {assignees.map((assignee) => (
                            <option key={assignee.assigneeId} value={assignee.assigneeId}>
                                {assignee.name}
                            </option>
                        ))}
                    </SelectField>
                </div>

                <ChipGroup
                    label="Prio:"
                    options={errandPriorityOptions}
                    selectedValues={filters.priorities}
                    onToggle={(value) =>
                        onChange({
                            ...filters,
                            priorities: toggleArrayValue(filters.priorities, value),
                            page: 0,
                        })
                    }
                />
            </div>

            <div className="mb-4">
                <ChipGroup
                    label="Status:"
                    options={errandStatusOptions}
                    selectedValues={filters.statuses}
                    onToggle={(value) =>
                        onChange({
                            ...filters,
                            statuses: toggleArrayValue(filters.statuses, value),
                            page: 0,
                        })
                    }
                />
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={onClear}
                    className="rounded-full border border-slate-300 bg-white px-4 py-1 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                    Rensa filter
                </button>
            </div>
        </section>
    );
}