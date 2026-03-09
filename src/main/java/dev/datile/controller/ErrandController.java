package dev.datile.controller;

import dev.datile.dto.errands.AddHistoryEntryDto;
import dev.datile.dto.errands.ErrandsResponseDto;
import dev.datile.dto.errands.ErrandDetailsDto;
import dev.datile.dto.errands.UpdateErrandDto;
import dev.datile.service.ErrandService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/* Everything in this class is API routes under /api/errands
 * @GetMapping means: when someone does GET /api/errands -> run this method
 */

@RestController
@RequestMapping("/api/errands")
public class ErrandController {

    private final ErrandService service;

    public ErrandController(ErrandService service) {
        this.service = service;
    }

    @GetMapping
    public ErrandsResponseDto list(
            @RequestParam(required = false) String statusIds,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        return service.list(statusIds, page, size, sortBy, sortDir);
    }

    @GetMapping("/{id}")
    public ErrandDetailsDto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ErrandDetailsDto> updateErrand(
            @PathVariable Long id,
            @Valid @RequestBody UpdateErrandDto request
    ) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @PostMapping("/{id}/history")
    public ResponseEntity<ErrandDetailsDto> addHistoryEntry(
            @PathVariable Long id,
            @Valid @RequestBody AddHistoryEntryDto request
    ) {
        return ResponseEntity.ok(service.addHistoryEntry(id, request));
    }
}