package dev.datile.service;

import dev.datile.domain.Customer;
import dev.datile.dto.customers.CreateCustomerRequestDto;
import dev.datile.dto.customers.CustomerListItemDto;
import dev.datile.dto.customers.CustomersResponseDto;
import dev.datile.dto.customers.UpdateCustomerRequestDto;
import dev.datile.dto.lookups.CustomerLookupDto;
import dev.datile.repository.CustomerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public CustomersResponseDto listCustomers(int page, int size, String q, String sortBy, String sortDir) {
        String safeSortBy = switch (sortBy) {
            case "name" -> "name";
            case "customerNumber" -> "customerNumber";
            default -> "name";
        };

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(safeSortBy).descending()
                : Sort.by(safeSortBy).ascending();

        PageRequest pageRequest = PageRequest.of(page, size, sort);

        Page<Customer> customerPage;

        if (q != null && !q.trim().isEmpty()) {
            customerPage = customerRepository
                    .findByIsActiveTrueAndNameContainingIgnoreCase(q.trim(), pageRequest);
        } else {
            customerPage = customerRepository.findByIsActiveTrue(
                    PageRequest.of(page, size, sort)
            );
        }

        return new CustomersResponseDto(
                customerPage.getContent().stream()
                        .map(this::toListItemDto)
                        .toList(),
                customerPage.getNumber(),
                customerPage.getTotalPages(),
                customerPage.getTotalElements()
        );
    }

    public CustomerListItemDto createCustomer(CreateCustomerRequestDto request) {
        validateRequest(request.name(), request.customerNumber());

        if (customerRepository.existsByCustomerNumber(request.customerNumber().trim())) {
            throw new IllegalArgumentException("Kundnummer finns redan.");
        }

        Customer customer = new Customer(
                request.name().trim(),
                request.customerNumber().trim(),
                true
        );

        Customer saved = customerRepository.save(customer);
        return toListItemDto(saved);
    }

    public CustomerListItemDto updateCustomer(Long customerId, UpdateCustomerRequestDto request) {
        validateRequest(request.name(), request.customerNumber());

        Customer customer = customerRepository.findByCustomerIdAndIsActiveTrue(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Kunden hittades inte."));

        String trimmedCustomerNumber = request.customerNumber().trim();

        customerRepository.findByCustomerNumber(trimmedCustomerNumber)
                .filter(existing -> !existing.getCustomerId().equals(customerId))
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("Kundnummer finns redan.");
                });

        customer.update(request.name().trim(), trimmedCustomerNumber);

        Customer saved = customerRepository.save(customer);
        return toListItemDto(saved);
    }

    public void deleteCustomer(Long customerId) {
        Customer customer = customerRepository.findByCustomerIdAndIsActiveTrue(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Kunden hittades inte."));

        customer.deactivate();
        customerRepository.save(customer);
    }

    private CustomerListItemDto toListItemDto(Customer customer) {
        return new CustomerListItemDto(
                customer.getCustomerId(),
                customer.getName(),
                customer.getCustomerNumber()
        );
    }

    private void validateRequest(String name, String customerNumber) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Kundnamn måste fyllas i.");
        }

        if (customerNumber == null || customerNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Kundnummer måste fyllas i.");
        }
    }
    public List<CustomerLookupDto> getCustomerLookups() {
        return customerRepository.findByIsActiveTrue(Sort.by("name").ascending())
                .stream()
                .map(customer -> new CustomerLookupDto(
                        customer.getCustomerId(),
                        customer.getName()
                ))
                .toList();
    }
}