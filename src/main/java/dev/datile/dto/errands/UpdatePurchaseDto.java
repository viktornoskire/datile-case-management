package dev.datile.dto.errands;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record UpdatePurchaseDto(
        @NotBlank String itemName,
        @NotNull @Min(1) Integer quantity,
        @NotNull @DecimalMin("0.00") @Digits(integer = 10, fraction = 2) BigDecimal purchasePrice,
        @NotNull @DecimalMin("0.00") @Digits(integer = 10, fraction = 2) BigDecimal shippingCost,
        @NotNull @DecimalMin("0.00") @Digits(integer = 10, fraction = 2) BigDecimal salePrice
) {
}