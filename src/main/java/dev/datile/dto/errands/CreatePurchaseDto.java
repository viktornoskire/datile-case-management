package dev.datile.dto.errands;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record CreatePurchaseDto(
        @NotBlank String itemName,
        @NotNull @Min(1) Integer quantity,
        @NotNull @DecimalMin("0.00") BigDecimal purchasePrice,
        @NotNull @DecimalMin("0.00") BigDecimal shippingCost,
        @NotNull @DecimalMin("0.00") BigDecimal salePrice
) {
}