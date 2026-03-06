package dev.datile.dto.errands;

import java.time.Instant;
import java.util.List;

public record ErrandDetailsDto(
        Long errandId,
        Instant createdAt,
        String title,
        String description,
        StatusDto status,
        PriorityDto priority,
        AssigneeDto assignee,
        CustomerDto customer,
        ContactDto contact,
        List<HistoryEntryDto> history,
        Double timeSpent,
        java.math.BigDecimal agreedPrice
) {
}