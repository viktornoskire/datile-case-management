package dev.datile.dto.errands;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class UpdatePurchaseDto {

    @NotBlank
    public String itemName;

    @NotNull
    @Min(1)
    public Integer quantity;

    @NotNull
    @DecimalMin("0.00")
    public BigDecimal purchasePrice;

    @NotNull
    @DecimalMin("0.00")
    public BigDecimal shippingCost;

    @NotNull
    @DecimalMin("0.00")
    public BigDecimal salePrice;
}