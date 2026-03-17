package dev.datile.controller;

import dev.datile.domain.Assignee;
import dev.datile.dto.errands.AssigneeDto;
import dev.datile.repository.AssigneeRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

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
    public AssigneeDto createAssignee(@RequestBody AssigneeDto dto) {
        System.out.println("CREATE ASSIGNEE HIT");

        if (assigneeRepository.existsByNameIgnoreCase(dto.name())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ansvarig finns redan"
            );
        }

        var assignee = new Assignee(dto.name());

        var saved = assigneeRepository.save(assignee);

        return new AssigneeDto(
                saved.getAssigneeId(),
                saved.getName()
        );
    }

    @PutMapping("/{id}")
    public AssigneeDto updateAssignee(@PathVariable Long id,
                                      @RequestBody AssigneeDto dto) {

        System.out.println("CREATE ASSIGNEE HIT");
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

        return new AssigneeDto(
                saved.getAssigneeId(),
                saved.getName()
        );
    }
}