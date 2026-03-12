package dev.datile.dto.reports;

import java.util.List;

public record ReportsResponseDto(
        List<ReportListItemDto> reports,
        int page,
        int size,
        long totalElements,
        int totalPages
) {}