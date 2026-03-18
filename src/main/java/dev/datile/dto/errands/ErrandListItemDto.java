package dev.datile.dto.errands;

import dev.datile.dto.customers.CustomerDto;

import java.time.Instant;
import java.util.List;

/* A light errand object suitable for list/cards.
 * historyPreview contains at most 2 latest history entries, ordered newest first.
 */
public record ErrandListItemDto(
        Long errandId,
        Instant createdAt,
        String title,
        String description,
        StatusDto status,
        PriorityDto priority,
        List<HistoryEntryDto> historyPreview,
        AssigneeDto assignee,
        CustomerDto customer,
        ContactDto contact
) {
}