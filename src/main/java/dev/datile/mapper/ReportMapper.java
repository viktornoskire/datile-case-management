package dev.datile.mapper;

import dev.datile.domain.Errand;
import dev.datile.domain.Purchase;
import dev.datile.dto.customers.CustomerDto;
import dev.datile.dto.errands.AssigneeDto;
import dev.datile.dto.errands.ContactDto;
import dev.datile.dto.errands.PriorityDto;
import dev.datile.dto.errands.StatusDto;
import dev.datile.dto.reports.ReportListItemDto;
import dev.datile.dto.reports.ReportPurchaseDto;
import dev.datile.dto.reports.ReportRowDto;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class ReportMapper {

    public ReportListItemDto toReportListItemDto(Errand errand, List<Purchase> purchases) {
        List<ReportPurchaseDto> purchaseDtos = purchases.stream()
                .map(this::toPurchaseDto)
                .toList();

        return new ReportListItemDto(
                errand.getErrandId(),
                errand.getCreatedAt(),
                errand.getTitle(),
                toCustomerDto(errand),
                toContactDto(errand),
                toStatusDto(errand),
                toPriorityDto(errand),
                errand.getTimeSpent(),
                toAssigneeDto(errand),
                purchaseDtos,
                errand.getAgreedPrice()
        );
    }

    public ReportRowDto toReportRowDto(Errand errand, List<Purchase> purchases) {
        BigDecimal purchaseTotal = purchases.stream()
                .map(Purchase::getTotalSaleValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        String customerName = errand.getCustomer() != null
                ? errand.getCustomer().getName()
                : "";

        String contactName = errand.getContact() != null
                ? (errand.getContact().getFirstName() + " " + errand.getContact().getLastName()).trim()
                : "";

        String assigneeName = errand.getAssignee() != null
                ? errand.getAssignee().getName()
                : "";

        String status = errand.getStatus() != null
                ? errand.getStatus().getName()
                : "";

        String priority = errand.getPriority() != null
                ? errand.getPriority().getName()
                : "";

        return new ReportRowDto(
                errand.getErrandId(),
                errand.getCreatedAt(),
                errand.getTitle(),
                customerName,
                contactName,
                assigneeName,
                status,
                priority,
                errand.getTimeSpent(),
                errand.getAgreedPrice(),
                purchaseTotal
        );
    }

    private ReportPurchaseDto toPurchaseDto(Purchase purchase) {
        return new ReportPurchaseDto(
                purchase.getPurchaseId(),
                purchase.getItemName(),
                purchase.getQuantity(),
                purchase.getSalePrice()
        );
    }

    private CustomerDto toCustomerDto(Errand errand) {
        if (errand.getCustomer() == null) {
            return null;
        }

        return new CustomerDto(
                errand.getCustomer().getCustomerId(),
                errand.getCustomer().getName(),
                errand.getCustomer().isActive()
        );
    }

    private ContactDto toContactDto(Errand errand) {
        if (errand.getContact() == null) {
            return null;
        }

        return new ContactDto(
                errand.getContact().getContactId(),
                errand.getContact().getCustomer() != null ? errand.getContact().getCustomer().getCustomerId() : null,
                errand.getContact().getFirstName(),
                errand.getContact().getLastName(),
                errand.getContact().getPhoneNumber(),
                errand.getContact().getMail()
        );
    }

    private StatusDto toStatusDto(Errand errand) {
        if (errand.getStatus() == null) {
            return null;
        }

        return new StatusDto(
                errand.getStatus().getStatusId(),
                errand.getStatus().getName()
        );
    }

    private PriorityDto toPriorityDto(Errand errand) {
        if (errand.getPriority() == null) {
            return null;
        }

        return new PriorityDto(
                errand.getPriority().getPriorityId(),
                errand.getPriority().getName(),
                errand.getPriority().getColor()
        );
    }

    private AssigneeDto toAssigneeDto(Errand errand) {
        if (errand.getAssignee() == null) {
            return null;
        }

        return new AssigneeDto(
                errand.getAssignee().getAssigneeId(),
                errand.getAssignee().getName()
        );
    }
}