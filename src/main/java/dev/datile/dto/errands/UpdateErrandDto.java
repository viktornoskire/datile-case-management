package dev.datile.dto.errands;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.Instant;

/* Editable fields */

public record UpdateErrandDto(
        @NotBlank(message = "Title is required")
        @Size(max = 255, message = "Title must be at most 255 characters")
        String title,

        @Size(max = 5000, message = "Description is too long")
        String description,

        @NotNull(message = "Status is required")
        Long statusId,

        @NotNull(message = "Priority is required")
        Long priorityId,

        @NotNull Instant createdAt,

        Long assigneeId,
        Long customerId,
        Long contactId,

        @DecimalMin(value = "0.0", inclusive = true, message = "Time spent must be 0 or more")
        Double timeSpent,

        @DecimalMin(value = "0.0", inclusive = true, message = "Agreed price must be 0 or more")
        BigDecimal agreedPrice
) {
}