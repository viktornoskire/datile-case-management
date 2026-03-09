import type { CSSProperties } from "react";

/* Helper for our priority colors */

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
    const isWhite = color.toLowerCase() === "#ffffff";

    return {
        name,
        color,
        accentStyle: {
            backgroundColor: isWhite ? "#E2E8F0" : color,
        } as CSSProperties,
        badgeStyle: {
            backgroundColor: isWhite ? "#FFFFFF" : hexToRgba(color, 0.12),
            borderColor: isWhite ? "#CBD5E1" : hexToRgba(color, 0.45),
            color: isWhite ? "#0F172A" : color,
        } as CSSProperties,
        valueStyle: {
            color: isWhite ? "#0F172A" : color,
        } as CSSProperties,
    };
};