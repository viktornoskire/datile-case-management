package dev.datile.dto.errands;

import java.math.BigDecimal;

public record PurchaseDto(
        Long purchaseId,
        String itemName,
        Integer quantity,
        BigDecimal purchasePrice,
        BigDecimal shippingCost,
        BigDecimal salePrice,
        BigDecimal totalPurchaseCost,
        BigDecimal totalSaleValue,
        BigDecimal profit
) {
}