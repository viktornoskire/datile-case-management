package dev.datile.dto.errands;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AddHistoryEntryDto(
        @NotBlank(message = "Beskrivning krävs")
        @Size(max = 5000, message = "Beskrivningen är för lång")
        String description
) {
}