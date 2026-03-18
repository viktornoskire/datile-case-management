package dev.datile.controller;

import dev.datile.dto.errands.CreatePurchaseDto;
import dev.datile.dto.errands.PurchaseDto;
import dev.datile.dto.errands.UpdatePurchaseDto;
import dev.datile.service.PurchaseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @PostMapping("/errands/{errandId}/purchases")
    @ResponseStatus(HttpStatus.CREATED)
    public PurchaseDto addPurchase(
            @PathVariable Long errandId,
            @Valid @RequestBody CreatePurchaseDto request
    ) {
        return purchaseService.addPurchase(errandId, request);
    }

    @PutMapping("/purchases/{purchaseId}")
    public PurchaseDto updatePurchase(
            @PathVariable Long purchaseId,
            @Valid @RequestBody UpdatePurchaseDto request
    ) {
        return purchaseService.updatePurchase(purchaseId, request);
    }

    @DeleteMapping("/purchases/{purchaseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePurchase(@PathVariable Long purchaseId) {
        purchaseService.deletePurchase(purchaseId);
    }
}