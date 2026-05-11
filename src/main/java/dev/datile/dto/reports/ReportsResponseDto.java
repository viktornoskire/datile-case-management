package dev.datile.dto.reports;

import java.math.BigDecimal;
import java.util.List;

public record ReportsResponseDto(
        List<ReportListItemDto> reports,
        int page,
        int size,
        long totalElements,
        int totalPages,
        BigDecimal totalTimeSpent
) {}