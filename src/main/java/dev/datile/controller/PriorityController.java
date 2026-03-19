package dev.datile.controller;

import dev.datile.domain.Priority;
import dev.datile.repository.PriorityRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.transaction.Transactional;

import java.util.List;

@RestController
@RequestMapping("/api/priorities")
public class PriorityController {

    private final PriorityRepository priorityRepository;

    public PriorityController(PriorityRepository priorityRepository) {
        this.priorityRepository = priorityRepository;
    }

    @GetMapping
    public List<dev.datile.dto.settings.Priority> listPriorities() {
        return priorityRepository.findAll(Sort.by("priorityId")).stream()
                .map(priority -> new dev.datile.dto.settings.Priority(
                        priority.getPriorityId(),
                        priority.getName(),
                        priority.getColor(),
                        priority.isDefault()
                ))
                .toList();
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createPriority(@RequestBody dev.datile.dto.settings.Priority dto) {

        if (dto.name() == null || dto.name().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid name");
        }

        if (priorityRepository.existsByNameIgnoreCase(dto.name())) {
            return ResponseEntity.status(409).body("Priority already exists");
        }

        Priority priority = new Priority(dto.name(), dto.color(), false);

        if (dto.isDefault()) {
            priorityRepository.clearDefault();
            priority.setDefault(true);
        }

        priorityRepository.save(priority);

        return ResponseEntity.status(201).body(
                new dev.datile.dto.settings.Priority (
                        priority.getPriorityId(),
                        priority.getName(),
                        priority.getColor(),
                        priority.isDefault()
                )
        );
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> updatePriority(@PathVariable Long id,
                                            @RequestBody dev.datile.dto.settings.Priority dto) {

        return priorityRepository.findById(id)
                .map(priority -> {

                    priority.setName(dto.name().trim());
                    priority.setColor(dto.color());

                    if (dto.isDefault()) {
                        priorityRepository.clearDefault();
                        priority.setDefault(true);
                    } else {
                        if (!priority.isDefault()) {
                            priority.setDefault(false);
                        }
                    }

                    priorityRepository.save(priority);

                    return ResponseEntity.ok(
                            new dev.datile.dto.settings.Priority(
                                    priority.getPriorityId(),
                                    priority.getName(),
                                    priority.getColor(),
                                    priority.isDefault()
                            )
                    );
                })
                .orElseGet(() ->
                        ResponseEntity.status(404).build()
                );
    }
}