import type {CSSProperties} from "react";

/* Helper for our priority colors since reuse is needed in listview */

export type PriorityLike = { name?: string; color?: string } | null | undefined;

const hexToRgba = (hex: string, alpha: number) => {
    const normalized = hex.replace("#", "");

    if (!/^[0-9A-Fa-f]{6}$/.test(normalized)) {
        return `rgba(203, 213, 225, ${alpha})`;
    }

    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getPriorityStyles = (priority: PriorityLike) => {
    const color = priority?.color ?? "#CBD5E1";
    const name = priority?.name ?? "—";

    return {
        name,
        color,
        cardStyle: {
            backgroundColor: hexToRgba(color, 0.28),
        } as CSSProperties,
        badgeStyle: {
            backgroundColor: hexToRgba(color, 0.18),
            borderColor: hexToRgba(color, 0.6),
        } as CSSProperties,
        valueStyle: {
            color,
        } as CSSProperties,
    };
};