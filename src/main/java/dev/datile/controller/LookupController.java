package dev.datile.controller;

import dev.datile.dto.lookups.CustomerLookupDto;
import dev.datile.service.CustomerService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/lookups")
public class LookupController {

    private final CustomerService customerService;

    public LookupController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping("/customers")
    public List<CustomerLookupDto> getCustomerLookups() {
        return customerService.getCustomerLookups();
    }
}