package dev.datile.dto.customers;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateCustomerRequestDto(

        @NotBlank(message = "Kundnamn måste anges")
        @Size(max = 150, message = "Kundnamn får vara max 150 tecken")
        String name,

        @NotBlank(message = "Kundnummer måste anges")
        @Size(max = 50, message = "Kundnummer får vara max 50 tecken")
        @Pattern(
                regexp = "^[A-Za-z0-9-]+$",
                message = "Kundnummer får bara innehålla bokstäver, siffror och bindestreck"
        )
        String customerNumber
) {
}