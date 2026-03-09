package dev.datile.dto.errands;

public record ContactDto(
        Long contactId,
        Long customerId,
        String firstName,
        String lastName,
        String phoneNumber,
        String mail
) {
}