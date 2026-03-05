package dev.datile.controller;

import dev.datile.dto.errands.ErrandsResponseDto;
import dev.datile.service.ErrandService;
import org.springframework.web.bind.annotation.*;

/* Everything in this class is API routes under /api/errands
* @GetMapping means: when someone does GET /api/errands -> run this method */

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
        // Controller does not do anything smart, it just delegates to service as it should
        return service.list(statusIds, page, size, sortBy, sortDir);
    }
}