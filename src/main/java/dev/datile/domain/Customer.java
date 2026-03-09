package dev.datile.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Long customerId;

    @Column(nullable = false, length = 255)
    private String name;

    protected Customer() {
    }
    private Boolean isActive;

    public Customer(String name) {
        this.name = name;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public String getName() {
        return name;
    }


    public Boolean getIsActive() {
        return isActive;
    }
}