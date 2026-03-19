package dev.datile.mapper;

import dev.datile.domain.Assignee;
import dev.datile.domain.Contact;
import dev.datile.domain.Customer;
import dev.datile.domain.Errand;
import dev.datile.domain.Priority;
import dev.datile.domain.Status;
import dev.datile.dto.customers.CustomerDto;
import dev.datile.dto.errands.*;
import dev.datile.domain.Purchase;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ErrandMapper {

    public ErrandListItemDto toListItemDto(Errand e, List<HistoryEntryDto> historyPreview) {
        return new ErrandListItemDto(
                e.getErrandId(),
                e.getCreatedAt(),
                e.getTitle(),
                e.getDescription(),
                toStatusDto(e.getStatus()),
                toPriorityDto(e.getPriority()),
                historyPreview,
                toAssigneeDto(e.getAssignee()),
                toCustomerDto(e.getCustomer()),
                toContactDto(e.getContact())
        );
    }

    public ErrandDetailsDto toDetailsDto(
            Errand e,
            List<HistoryEntryDto> history,
            List<PurchaseDto> purchases
    ) {
        return new ErrandDetailsDto(
                e.getErrandId(),
                e.getCreatedAt(),
                e.getTitle(),
                e.getDescription(),
                toStatusDto(e.getStatus()),
                toPriorityDto(e.getPriority()),
                history,
                purchases,
                toAssigneeDto(e.getAssignee()),
                toCustomerDto(e.getCustomer()),
                toContactDto(e.getContact()),
                e.getTimeSpent() != null ? e.getTimeSpent().doubleValue() : null,
                e.getAgreedPrice()
        );
    }

    public PurchaseDto toPurchaseDto(Purchase purchase) {
        return new PurchaseDto(
                purchase.getPurchaseId(),
                purchase.getItemName(),
                purchase.getQuantity(),
                purchase.getPurchasePrice(),
                purchase.getShippingCost(),
                purchase.getSalePrice(),
                purchase.getTotalPurchaseCost(),
                purchase.getTotalSaleValue(),
                purchase.getProfit()
        );
    }

    private StatusDto toStatusDto(Status s) {
        if (s == null) return null;
        return new StatusDto(s.getStatusId(), s.getName());
    }

    private PriorityDto toPriorityDto(Priority p) {
        if (p == null) return null;
        return new PriorityDto(
                p.getPriorityId(),
                p.getName(),
                p.getColor()
        );
    }

    private AssigneeDto toAssigneeDto(Assignee a) {
        if (a == null) return null;
        return new AssigneeDto(
                a.getAssigneeId(),
                a.getName()
        );
    }

    private CustomerDto toCustomerDto(Customer c) {
        if (c == null) return null;
        return new CustomerDto(
                c.getCustomerId(),
                c.getName(),
                c.isActive()
        );
    }

    private ContactDto toContactDto(Contact c) {
        if (c == null) return null;
        return new ContactDto(
                c.getContactId(),
                c.getCustomer().getCustomerId(),
                c.getFirstName(),
                c.getLastName(),
                c.getPhoneNumber(),
                c.getMail()
        );
    }
}