package dev.datile.dto.reports;

import java.math.BigDecimal;

public record ReportPurchaseDto(
        Long purchaseId,
        String itemName,
        Integer quantity,
        BigDecimal salePrice,
        BigDecimal totalSaleValue
) {
}