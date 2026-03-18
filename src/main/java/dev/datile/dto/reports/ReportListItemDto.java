package dev.datile.dto.reports;

import dev.datile.dto.errands.AssigneeDto;
import dev.datile.dto.errands.ContactDto;
import dev.datile.dto.errands.CustomerDto;
import dev.datile.dto.errands.PriorityDto;
import dev.datile.dto.errands.StatusDto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record ReportListItemDto(
        Long errandId,
        Instant createdAt,
        String title,
        CustomerDto customer,
        ContactDto contact,
        StatusDto status,
        PriorityDto priority,
        BigDecimal timeSpent,
        AssigneeDto assignee,
        List<ReportPurchaseDto> purchases,
        BigDecimal agreedPrice
) {
}