package dev.datile.dto.errands;

import java.time.Instant;

/* DTO for a row of history in a preview */

public record HistoryEntryDto(
        Long historyId,
        String description,
        String verifiedName,
        Instant createdAt
) {}