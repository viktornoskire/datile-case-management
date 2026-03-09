package dev.datile.dto.errands;

/* The smallest possible presentation of status that the frontend needs
 * DTOs´ keeps JPA entities un-exposed */

public record StatusDto(
        Long statusId,
        String name) {
}