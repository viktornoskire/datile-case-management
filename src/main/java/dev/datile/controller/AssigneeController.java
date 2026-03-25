package dev.datile.controller;

import dev.datile.domain.Assignee;
import dev.datile.dto.errands.AssigneeDto;
import dev.datile.repository.AssigneeRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assignees")
public class AssigneeController {

    private final AssigneeRepository assigneeRepository;

    public AssigneeController(AssigneeRepository assigneeRepository) {
        this.assigneeRepository = assigneeRepository;
    }

    @GetMapping
    public List<AssigneeDto> listAssignees() {
        return assigneeRepository.findByIsActiveTrue(Sort.by("assigneeId")).stream()
                .map(assignee -> new AssigneeDto(
                        assignee.getAssigneeId(),
                        assignee.getName()
                ))
                .toList();
    }

    @PostMapping
    public ResponseEntity<?> createAssignee(@RequestBody AssigneeDto dto) {

        if (dto.name() == null || dto.name().trim().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid name"
            );
        }

        if (assigneeRepository.existsByNameIgnoreCaseAndIsActiveTrue(dto.name())) {
            return ResponseEntity.status(409).body("Assignee already exists");
        }

        var assignee = new Assignee(dto.name().trim());
        var saved = assigneeRepository.save(assignee);

        return ResponseEntity.status(201).body(
                new AssigneeDto(saved.getAssigneeId(), saved.getName())
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAssignee(@PathVariable Long id,
                                            @RequestBody AssigneeDto dto) {

        if (dto.name() == null || dto.name().trim().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid name"
            );
        }

        return assigneeRepository.findById(id)
                .map(assignee -> {
                    if (assigneeRepository.existsByNameIgnoreCaseAndIsActiveTrue(dto.name())
                            && !assignee.getName().equalsIgnoreCase(dto.name())) {
                        return ResponseEntity.status(409).body("Assignee already exists");
                    }

                    assignee.setName(dto.name().trim());
                    assigneeRepository.save(assignee);

                    return ResponseEntity.ok(
                            new AssigneeDto(assignee.getAssigneeId(), assignee.getName())
                    );
                })
                .orElseGet(() ->
                        ResponseEntity.status(404).body("Assignee not found")
                );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssignee(@PathVariable Long id) {

        return assigneeRepository.findById(id)
                .map(assignee -> {
                    assignee.setActive(false);
                    assigneeRepository.save(assignee);

                    return ResponseEntity.noContent().build();
                })
                .orElseGet(() ->
                        ResponseEntity.status(404).body("Assignee not found")
                );
    }
}