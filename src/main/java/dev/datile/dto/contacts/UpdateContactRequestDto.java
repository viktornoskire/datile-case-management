package dev.datile.dto.contacts;

public record UpdateContactRequestDto(
        Long customerId,
        String firstName,
        String lastName,
        String phoneNumber,
        String mail
) {
}