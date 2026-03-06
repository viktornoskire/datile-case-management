package dev.datile.controller;

import dev.datile.dto.errands.CustomerDto;
import dev.datile.repository.CustomerRepository;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerRepository customerRepository;

    public CustomerController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @GetMapping
    public List<CustomerDto> listCustomers() {
        return customerRepository.findAll(Sort.by("customerId")).stream()
                .map(customer -> new CustomerDto(
                        customer.getCustomerId(),
                        customer.getName()
                ))
                .toList();
    }
}