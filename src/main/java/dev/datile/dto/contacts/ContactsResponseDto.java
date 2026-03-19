package dev.datile.dto.contacts;

import java.util.List;

public record ContactsResponseDto(
        List<ContactListItemDto> items,
        int page,
        int totalPages,
        long totalElements
) {
}