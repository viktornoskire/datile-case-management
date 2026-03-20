package dev.datile.dto.customers;

import java.util.List;

public record CustomersResponseDto(
        List<CustomerListItemDto> items,
        int pageNumber,
        int totalPages,
        long totalElements
) {
}