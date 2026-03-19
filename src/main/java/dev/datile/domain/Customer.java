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

    @Column(name = "customer_number", nullable = false, length = 100, unique = true)
    private String customerNumber;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    protected Customer() {
    }

    public Customer(String name, String customerNumber, boolean isActive) {
        this.name = name;
        this.customerNumber = customerNumber;
        this.isActive = isActive;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public String getName() {
        return name;
    }

    public String getCustomerNumber() {
        return customerNumber;
    }

    public boolean isActive() {
        return isActive;
    }

    public void update(String name, String customerNumber) {
        this.name = name;
        this.customerNumber = customerNumber;
    }

    public void deactivate() {
        this.isActive = false;
    }
}