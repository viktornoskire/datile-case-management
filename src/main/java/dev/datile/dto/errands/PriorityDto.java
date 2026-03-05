package dev.datile.dto.errands;

/* Priority DTO (id, name and color) so that we do not need to expose our entity */

public record PriorityDto(Long priorityId, String name, String color) {
}