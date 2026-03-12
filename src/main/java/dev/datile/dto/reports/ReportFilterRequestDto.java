package dev.datile.dto.reports;

import java.time.LocalDate;
import java.util.List;

public record ReportFilterRequestDto(
        LocalDate dateFrom,
        LocalDate dateTo,
        Long customerId,
        Long assigneeId,
        List<Long> statusIds,
        List<Long> priorityIds,
        String sortBy,
        Integer page,
        Integer size
) {}