package dev.datile.controller;

import dev.datile.dto.errands.AssigneeDto;
import dev.datile.repository.AssigneeRepository;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}