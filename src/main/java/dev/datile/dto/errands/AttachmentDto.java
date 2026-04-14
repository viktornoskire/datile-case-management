package dev.datile.dto.errands;

public record AttachmentDto(
        Long id,
        String fileName,
        String contentType
) {}
