package dev.datile.dto.customers;

public record UpdateCustomerRequestDto(
        String name,
        String customerNumber
) {
}