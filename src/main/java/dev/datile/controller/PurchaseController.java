package dev.datile.controller;

import dev.datile.domain.Errand;
import dev.datile.domain.Purchase;
import dev.datile.dto.errands.CreatePurchaseDto;
import dev.datile.dto.errands.PurchaseDto;
import dev.datile.dto.errands.UpdatePurchaseDto;
import dev.datile.repository.ErrandRepository;
import dev.datile.repository.PurchaseRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/errands")
public class PurchaseController {

    private final PurchaseRepository purchaseRepository;
    private final ErrandRepository errandRepository;

    public PurchaseController(
            PurchaseRepository purchaseRepository,
            ErrandRepository errandRepository
    ) {
        this.purchaseRepository = purchaseRepository;
        this.errandRepository = errandRepository;
    }

    @PostMapping("/{id}/purchases")
    public PurchaseDto addPurchase(
            @PathVariable Long id,
            @Valid @RequestBody CreatePurchaseDto request
    ) {
        Errand errand = errandRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Errand not found"));

        Purchase purchase = new Purchase(
                errand,
                request.itemName,
                request.quantity,
                request.purchasePrice,
                request.shippingCost,
                request.salePrice
        );

        Purchase savedPurchase = purchaseRepository.save(purchase);

        return toDto(savedPurchase);
    }

    @PutMapping("/purchases/{purchaseId}")
    public PurchaseDto updatePurchase(
            @PathVariable Long purchaseId,
            @Valid @RequestBody UpdatePurchaseDto request
    ) {
        Purchase purchase = purchaseRepository.findById(purchaseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Purchase not found"));

        purchase.setItemName(request.itemName);
        purchase.setQuantity(request.quantity);
        purchase.setPurchasePrice(request.purchasePrice);
        purchase.setShippingCost(request.shippingCost);
        purchase.setSalePrice(request.salePrice);

        Purchase savedPurchase = purchaseRepository.save(purchase);

        return toDto(savedPurchase);
    }

    @DeleteMapping("/purchases/{purchaseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePurchase(@PathVariable Long purchaseId) {
        if (!purchaseRepository.existsById(purchaseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Purchase not found");
        }

        purchaseRepository.deleteById(purchaseId);
    }

    private PurchaseDto toDto(Purchase purchase) {
        return new PurchaseDto(
                purchase.getPurchaseId(),
                purchase.getItemName(),
                purchase.getQuantity(),
                purchase.getPurchasePrice(),
                purchase.getShippingCost(),
                purchase.getSalePrice(),
                purchase.getTotalPurchaseCost(),
                purchase.getTotalSaleValue(),
                purchase.getProfit()
        );
    }
}