package dev.datile.dto.reports;

import java.math.BigDecimal;
import java.time.Instant;

public record ReportRowDto(
        Long errandId,
        Instant createdAt,
        String title,
        String customerName,
        String contactName,
        String assigneeName,
        String status,
        String priority,
        BigDecimal timeSpent,
        BigDecimal agreedPrice,
        BigDecimal customerPurchaseTotal
) {}