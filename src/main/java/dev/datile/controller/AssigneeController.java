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
        return assigneeRepository.findAll(Sort.by("assigneeId")).stream()
                .map(assignee -> new AssigneeDto(
                        assignee.getAssigneeId(),
                        assignee.getName()
                ))
                .toList();
    }

    @PostMapping
    public ResponseEntity<?> createAssignee(@RequestBody AssigneeDto dto) {

        if (assigneeRepository.existsByNameIgnoreCase(dto.name())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ansvarig finns redan"
            );
        }

        var assignee = new Assignee(dto.name());

        var saved = assigneeRepository.save(assignee);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("assignee", new AssigneeDto(
                saved.getAssigneeId(),
                saved.getName()))
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAssignee(@PathVariable Long id, @RequestBody AssigneeDto dto) {

        var assignee = assigneeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Assignee not found"
                ));

        if (assigneeRepository.existsByNameIgnoreCase(dto.name())
                && !assignee.getName().equalsIgnoreCase(dto.name())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ansvarig finns redan"
            );
        }

        assignee.setName(dto.name());

        var saved = assigneeRepository.save(assignee);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("assignee", new AssigneeDto(
                saved.getAssigneeId(),
                saved.getName()))
        );
    }
}