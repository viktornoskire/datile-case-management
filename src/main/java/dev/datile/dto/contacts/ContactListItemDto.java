package dev.datile.dto.contacts;

public record ContactListItemDto(
        Long contactId,
        Long customerId,
        String customerName,
        String firstName,
        String lastName,
        String phoneNumber,
        String mail
) {
}