package dev.datile.dto.contacts;

import jakarta.validation.constraints.*;

public record UpdateContactRequestDto(

        @NotNull(message = "Kund måste anges")
        Long customerId,

        @NotBlank(message = "Förnamn måste anges")
        @Size(max = 100, message = "Förnamn får vara max 100 tecken")
        String firstName,

        @NotBlank(message = "Efternamn måste anges")
        @Size(max = 100, message = "Efternamn får vara max 100 tecken")
        String lastName,

        @Size(max = 50, message = "Telefonnummer får vara max 50 tecken")
        @Pattern(
                regexp = "^$|^[0-9+\\-\\s()]{7,20}$",
                message = "Telefonnummer har ogiltigt format"
        )
        String phoneNumber,

        @Size(max = 150, message = "E-post får vara max 150 tecken")
        @Email(message = "E-post har ogiltigt format")
        String mail
) {
}