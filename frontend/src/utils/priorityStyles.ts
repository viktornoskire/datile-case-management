import type React from "react";

/* Helper for our priority colors since reuse is needed in listview */

export type PriorityLike = { name?: string; color?: string } | null | undefined;

const hexToRgba = (hex: string, alpha: number) => {
    const h = hex.replace("#", "");
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getPriorityStyles = (priority: PriorityLike) => {
    const color = priority?.color ?? "#CBD5E1"; // fallback
    const name = priority?.name ?? "—";

    return {
        name,
        color,
        cardStyle: {
            backgroundColor: hexToRgba(color, 0.28),
            borderColor: hexToRgba(color, 0.60),
        } as React.CSSProperties,
        badgeStyle: {
            backgroundColor: hexToRgba(color, 0.18),
            borderColor: hexToRgba(color, 0.55),
        } as React.CSSProperties,
        valueStyle: { color } as React.CSSProperties,
    };
};