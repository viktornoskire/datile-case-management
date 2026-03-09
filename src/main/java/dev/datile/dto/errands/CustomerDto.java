package dev.datile.dto.errands;

public record CustomerDto(
        Long customerId,
        String name,
        Boolean isActive
) {
}