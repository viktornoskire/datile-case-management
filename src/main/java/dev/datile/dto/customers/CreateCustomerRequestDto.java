package dev.datile.dto.customers;

public record CreateCustomerRequestDto(
        String name,
        String customerNumber
) {
}