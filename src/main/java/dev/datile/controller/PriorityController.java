package dev.datile.controller;

import dev.datile.dto.errands.PriorityDto;
import dev.datile.repository.PriorityRepository;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/priorities")
public class PriorityController {

    private final PriorityRepository priorityRepository;

    public PriorityController(PriorityRepository priorityRepository) {
        this.priorityRepository = priorityRepository;
    }

    @GetMapping
    public List<PriorityDto> listPriorities() {
        return priorityRepository.findAll(Sort.by("priorityId")).stream()
                .map(priority -> new PriorityDto(
                        priority.getPriorityId(),
                        priority.getName(),
                        priority.getColor()
                ))
                .toList();
    }
}