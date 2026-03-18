package dev.datile.dto.errands;

import dev.datile.dto.customers.CustomerDto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/* Full details DTO for a single errand. */
public record ErrandDetailsDto(
        Long errandId,
        Instant createdAt,
        String title,
        String description,
        StatusDto status,
        PriorityDto priority,
        List<HistoryEntryDto> history,
        List<PurchaseDto> purchases,
        AssigneeDto assignee,
        CustomerDto customer,
        ContactDto contact,
        Double timeSpent,
        BigDecimal agreedPrice
) {
}