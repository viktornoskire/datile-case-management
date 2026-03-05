package dev.datile.service;

import dev.datile.dto.errands.ErrandsResponseDto;
import dev.datile.mapper.ErrandMapper;
import dev.datile.repository.ErrandRepository;
import dev.datile.spec.ErrandSpecifications;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.data.jpa.domain.Specification;

import java.util.Arrays;
import java.util.List;

/* This is the service layer that pulls the data.
 * Service layers´ responsibility = business logic and orchestration.
 * ErrandService takes pagination and sort, pulls from ErrandRepository and maps to DTO.
 * + Returns the format that we want! */

@Service
public class ErrandService {

    private final ErrandRepository repo;
    private final ErrandMapper mapper;

    public ErrandService(ErrandRepository repo, ErrandMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    public ErrandsResponseDto list(String statusIdsCsv, int page, int size, String sortBy, String sortDir) {
        final var statusIds = parseCsvLongs(statusIdsCsv);

        final var spec = Specification.where(ErrandSpecifications.statusIdIn(statusIds));

        final var pageable = PageRequest.of(
                Math.max(page, 0),
                size <= 0 ? 20 : Math.min(size, 200),
                Sort.by(parseDirection(sortDir), mapSortField(sortBy))
        );

        final var result = repo.findAll(spec, pageable);
        final var dtos = result.getContent().stream().map(mapper::toListItemDto).toList();

        return new ErrandsResponseDto(dtos, result.getNumber(), result.getSize(), result.getTotalElements(), result.getTotalPages());
    }

    private List<Long> parseCsvLongs(String csv) {
        if (csv == null || csv.isBlank()) return List.of();
        return Arrays.stream(csv.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(Long::valueOf)
                .toList();
    }

    private Sort.Direction parseDirection(String sortDir) {
        return "desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC;
    }

    private String mapSortField(String sortBy) {
        if (sortBy == null || sortBy.isBlank() || "date".equalsIgnoreCase(sortBy)) return "createdAt";
        if ("title".equalsIgnoreCase(sortBy)) return "title";
        throw new IllegalArgumentException("Invalid sortBy: " + sortBy);
    }
}