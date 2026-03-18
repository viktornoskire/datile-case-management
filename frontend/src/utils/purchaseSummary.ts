import type { ErrandPurchase } from "../types/errands";

export type PurchaseSummary = {
    totalPurchaseAmountExclShipping: number;
    totalShippingCost: number;
    totalCostForUs: number;
    totalCustomerPrice: number;
    totalProfit: number;
    totalQuantity: number;
};

export const calculatePurchaseSummary = (
    purchases: ErrandPurchase[],
): PurchaseSummary => {
    return purchases.reduce<PurchaseSummary>(
        (summary, purchase) => {
            const purchaseAmountExclShipping =
                purchase.quantity * purchase.purchasePrice;

            return {
                totalPurchaseAmountExclShipping:
                    summary.totalPurchaseAmountExclShipping + purchaseAmountExclShipping,
                totalShippingCost:
                    summary.totalShippingCost + purchase.shippingCost,
                totalCostForUs:
                    summary.totalCostForUs + purchase.totalPurchaseCost,
                totalCustomerPrice:
                    summary.totalCustomerPrice + purchase.totalSaleValue,
                totalProfit:
                    summary.totalProfit + purchase.profit,
                totalQuantity:
                    summary.totalQuantity + purchase.quantity,
            };
        },
        {
            totalPurchaseAmountExclShipping: 0,
            totalShippingCost: 0,
            totalCostForUs: 0,
            totalCustomerPrice: 0,
            totalProfit: 0,
            totalQuantity: 0,
        },
    );
};