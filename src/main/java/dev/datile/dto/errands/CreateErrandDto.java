package dev.datile.dto.errands;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.List;

public record CreateErrandDto(
        @NotBlank String title,
        @NotBlank String description,
        @NotNull Long statusId,
        @NotNull Long priorityId,
        @NotNull Long assigneeId,
        @NotNull Long customerId,
        @NotNull Long contactId,
        @NotNull Double timeSpent,
        @NotNull Double agreedPrice,
        @NotNull Instant createdAt,
        List<CreatePurchaseDto> purchases
) {
}