package dev.datile.dto.contacts;

public record CreateContactRequestDto(
        Long customerId,
        String firstName,
        String lastName,
        String phoneNumber,
        String mail
) {
}