package dev.datile.repository;

import dev.datile.domain.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Page<Customer> findByIsActiveTrue(Pageable pageable);
    Optional<Customer> findByCustomerNumber(String customerNumber);
    boolean existsByCustomerNumber(String customerNumber);
}