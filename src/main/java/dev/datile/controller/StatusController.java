package dev.datile.controller;

import dev.datile.dto.errands.StatusDto;
import dev.datile.repository.StatusRepository;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/statuses")
public class StatusController {

    private final StatusRepository statusRepository;

    public StatusController(StatusRepository statusRepository) {
        this.statusRepository = statusRepository;
    }

    @GetMapping
    public List<StatusDto> listStatuses() {
        return statusRepository.findAll(Sort.by("statusId")).stream()
                .map(status -> new StatusDto(
                        status.getStatusId(),
                        status.getName()
                ))
                .toList();
    }
}