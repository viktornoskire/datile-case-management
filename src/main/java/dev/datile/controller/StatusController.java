package dev.datile.controller;

import dev.datile.domain.Status;
import dev.datile.dto.errands.StatusDto;
import dev.datile.repository.StatusRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        return statusRepository.findByIsActiveTrue(Sort.by("statusId")).stream()
                .map(status -> new StatusDto(
                        status.getStatusId(),
                        status.getName()
                ))
                .toList();
    }

    @PostMapping
    public ResponseEntity<?> createStatus(@RequestBody StatusDto dto) {
        if (dto.name() == null || dto.name().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid name");
        }

        boolean exists = statusRepository.existsByNameIgnoreCaseAndIsActiveTrue(dto.name());
        if (exists) {
            return ResponseEntity.status(409).body("Status already exists");
        }

        var status = new Status(null, dto.name());

        Status s = statusRepository.save(status);

        return ResponseEntity.status(201).body(
                new StatusDto(s.getStatusId(), s.getName())
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                          @RequestBody StatusDto dto) {

        return statusRepository.findById(id)
                .map(status -> {
                    if (dto.name() == null || dto.name().trim().isEmpty()) {
                        return ResponseEntity.badRequest().body("Invalid name");
                    }
                    status.setName(dto.name().trim());
                    statusRepository.save(status);

                    return ResponseEntity.ok(
                            new StatusDto(status.getStatusId(), status.getName())
                    );
                })
                .orElseGet(() -> ResponseEntity.status(404).body("Status not found"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStatus(@PathVariable Long id) {

        return statusRepository.findById(id)
                .map(status -> {
                    status.setActive(false); // 👈 soft delete
                    statusRepository.save(status);

                    return ResponseEntity.noContent().build();
                })
                .orElseGet(() -> ResponseEntity.status(404).body("Status not found"));
    }
}