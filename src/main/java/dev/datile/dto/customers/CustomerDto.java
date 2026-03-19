package dev.datile.dto.customers;

public record CustomerDto(
        Long customerId,
        String name,
        boolean isActive
) {
}