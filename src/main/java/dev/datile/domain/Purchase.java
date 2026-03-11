package dev.datile.domain;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "purchases")
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "purchase_id")
    private Long purchaseId;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "errand_id", nullable = false)
    private Errand errand;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "purchase_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal purchasePrice;

    @Column(name = "shipping_cost", nullable = false, precision = 10, scale = 2)
    private BigDecimal shippingCost;

    @Column(name = "sale_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal salePrice;

    protected Purchase() {
    }

    public Purchase(
            Errand errand,
            String itemName,
            Integer quantity,
            BigDecimal purchasePrice,
            BigDecimal shippingCost,
            BigDecimal salePrice
    ) {
        this.errand = errand;
        this.itemName = itemName;
        this.quantity = quantity;
        this.purchasePrice = purchasePrice;
        this.shippingCost = shippingCost;
        this.salePrice = salePrice;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setPurchasePrice(BigDecimal purchasePrice) {
        this.purchasePrice = purchasePrice;
    }

    public void setShippingCost(BigDecimal shippingCost) {
        this.shippingCost = shippingCost;
    }

    public void setSalePrice(BigDecimal salePrice) {
        this.salePrice = salePrice;
    }

    public void setErrand(Errand errand) {
        this.errand = errand;
    }



    public Long getPurchaseId() {
        return purchaseId;
    }

    public Errand getErrand() {
        return errand;
    }

    public String getItemName() {
        return itemName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getPurchasePrice() {
        return purchasePrice;
    }

    public BigDecimal getShippingCost() {
        return shippingCost;
    }

    public BigDecimal getSalePrice() {
        return salePrice;
    }

    public BigDecimal getTotalPurchaseCost() {
        return purchasePrice
                .multiply(BigDecimal.valueOf(quantity))
                .add(shippingCost);
    }

    public BigDecimal getTotalSaleValue() {
        return salePrice.multiply(BigDecimal.valueOf(quantity));
    }

    public BigDecimal getProfit() {
        return getTotalSaleValue().subtract(getTotalPurchaseCost());
    }
}

