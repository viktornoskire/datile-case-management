package dev.datile.service;

import dev.datile.domain.Errand;
import dev.datile.domain.Purchase;
import dev.datile.dto.errands.CreatePurchaseDto;
import dev.datile.dto.errands.PurchaseDto;
import dev.datile.dto.errands.UpdatePurchaseDto;
import dev.datile.repository.ErrandRepository;
import dev.datile.repository.PurchaseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final ErrandRepository errandRepository;

    public PurchaseService(
            PurchaseRepository purchaseRepository,
            ErrandRepository errandRepository
    ) {
        this.purchaseRepository = purchaseRepository;
        this.errandRepository = errandRepository;
    }

    public PurchaseDto addPurchase(Long errandId, CreatePurchaseDto request) {
        Errand errand = getErrandOrThrow(errandId);

        Purchase purchase = new Purchase(
                errand,
                request.itemName().trim(),
                request.quantity(),
                request.purchasePrice(),
                request.shippingCost(),
                request.salePrice()
        );

        Purchase savedPurchase = purchaseRepository.save(purchase);
        return toDto(savedPurchase);
    }

    public PurchaseDto updatePurchase(Long purchaseId, UpdatePurchaseDto request) {
        Purchase purchase = getPurchaseOrThrow(purchaseId);

        purchase.setItemName(request.itemName().trim());
        purchase.setQuantity(request.quantity());
        purchase.setPurchasePrice(request.purchasePrice());
        purchase.setShippingCost(request.shippingCost());
        purchase.setSalePrice(request.salePrice());

        Purchase savedPurchase = purchaseRepository.save(purchase);
        return toDto(savedPurchase);
    }

    public void deletePurchase(Long purchaseId) {
        Purchase purchase = getPurchaseOrThrow(purchaseId);
        purchaseRepository.delete(purchase);
    }

    private Errand getErrandOrThrow(Long errandId) {
        return errandRepository.findById(errandId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Errand not found"
                ));
    }

    private Purchase getPurchaseOrThrow(Long purchaseId) {
        return purchaseRepository.findById(purchaseId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Purchase not found"
                ));
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