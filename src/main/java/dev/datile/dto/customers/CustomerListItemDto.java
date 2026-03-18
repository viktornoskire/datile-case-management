package dev.datile.dto.customers;

public record CustomerListItemDto(
        Long customerId,
        String name,
        String customerNumber
) {
}