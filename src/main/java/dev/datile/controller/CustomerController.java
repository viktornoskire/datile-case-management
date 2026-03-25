package dev.datile.controller;

import dev.datile.dto.customers.CreateCustomerRequestDto;
import dev.datile.dto.customers.CustomerListItemDto;
import dev.datile.dto.customers.CustomersResponseDto;
import dev.datile.dto.customers.UpdateCustomerRequestDto;
import dev.datile.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public CustomersResponseDto listCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String q,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        return customerService.listCustomers(page, size, q, sortBy, sortDir);
    }

    @PostMapping
    public CustomerListItemDto createCustomer(@Valid @RequestBody CreateCustomerRequestDto request) {
        return customerService.createCustomer(request);
    }

    @PutMapping("/{customerId}")
    public CustomerListItemDto updateCustomer(
            @PathVariable Long customerId,
            @Valid @RequestBody UpdateCustomerRequestDto request
    ) {
        return customerService.updateCustomer(customerId, request);
    }

    @DeleteMapping("/{customerId}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long customerId) {
        customerService.deleteCustomer(customerId);
        return ResponseEntity.noContent().build();
    }
}