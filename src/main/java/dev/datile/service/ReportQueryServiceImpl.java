package dev.datile.service;

import dev.datile.domain.Errand;
import dev.datile.domain.Purchase;
import dev.datile.dto.reports.ReportFilterRequestDto;
import dev.datile.dto.reports.ReportListItemDto;
import dev.datile.dto.reports.ReportRowDto;
import dev.datile.dto.reports.ReportsResponseDto;
import dev.datile.mapper.ReportMapper;
import dev.datile.repository.ErrandRepository;
import dev.datile.repository.PurchaseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/* Pulls and filters data */

@Service
@Transactional(readOnly = true)
public class ReportQueryServiceImpl implements ReportQueryService {

    private static final Set<String> ALLOWED_SORTS = Set.of(
            "customer",
            "contact",
            "title",
            "status",
            "priority",
            "assignee",
            "timeSpent"
    );

    private final ErrandRepository errandRepository;
    private final PurchaseRepository purchaseRepository;
    private final ReportMapper reportMapper;

    public ReportQueryServiceImpl(
            ErrandRepository errandRepository,
            PurchaseRepository purchaseRepository,
            ReportMapper reportMapper
    ) {
        this.errandRepository = errandRepository;
        this.purchaseRepository = purchaseRepository;
        this.reportMapper = reportMapper;
    }

    @Override
    public ReportsResponseDto getReports(ReportFilterRequestDto request) {
        Instant effectiveFrom = resolveFromDate(request.dateFrom());
        Instant effectiveTo = resolveToDate(request.dateTo());

        if (effectiveFrom.isAfter(effectiveTo)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "dateFrom must be before or equal to dateTo"
            );
        }

        String effectiveSort = resolveSort(request.sortBy());

        int page = request.page() != null ? request.page() : 0;
        int size = request.size() != null ? request.size() : 20;

        if (page < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "page must be 0 or greater"
            );
        }

        if (size <= 0 || size > 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "size must be between 1 and 100"
            );
        }

        Specification<Errand> specification = buildSpecification(effectiveFrom, effectiveTo, request);

        PageRequest pageRequest = PageRequest.of(page, size, buildSort(effectiveSort));
        Page<Errand> resultPage = errandRepository.findAll(specification, pageRequest);

        List<ReportListItemDto> reports = mapToListItems(resultPage.getContent());

        return new ReportsResponseDto(
                reports,
                resultPage.getNumber(),
                resultPage.getSize(),
                resultPage.getTotalElements(),
                resultPage.getTotalPages()
        );
    }

    @Override
    public List<ReportRowDto> getReportRowsForExport(ReportFilterRequestDto request) {
        Instant effectiveFrom = resolveFromDate(request.dateFrom());
        Instant effectiveTo = resolveToDate(request.dateTo());

        if (effectiveFrom.isAfter(effectiveTo)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "dateFrom must be before or equal to dateTo"
            );
        }

        String effectiveSort = resolveSort(request.sortBy());

        Specification<Errand> specification = buildSpecification(effectiveFrom, effectiveTo, request);

        List<Errand> errands = errandRepository.findAll(specification, buildSort(effectiveSort));

        return mapToRows(errands);
    }

    private Instant resolveFromDate(LocalDate dateFrom) {
        return dateFrom != null
                ? dateFrom.atStartOfDay().toInstant(ZoneOffset.UTC)
                : LocalDate.now(ZoneOffset.UTC)
                .withDayOfMonth(1)
                .atStartOfDay()
                .toInstant(ZoneOffset.UTC);
    }

    private Instant resolveToDate(LocalDate dateTo) {
        return dateTo != null
                ? dateTo.plusDays(1)
                .atStartOfDay()
                .minusNanos(1)
                .toInstant(ZoneOffset.UTC)
                : LocalDate.now(ZoneOffset.UTC)
                .plusDays(1)
                .atStartOfDay()
                .minusNanos(1)
                .toInstant(ZoneOffset.UTC);
    }

    private String resolveSort(String sortBy) {
        String effectiveSort = (sortBy == null || sortBy.isBlank()) ? "customer" : sortBy;

        if (!ALLOWED_SORTS.contains(effectiveSort)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid sortBy value");
        }

        return effectiveSort;
    }

    private Specification<Errand> buildSpecification(
            Instant effectiveFrom,
            Instant effectiveTo,
            ReportFilterRequestDto request
    ) {
        return Specification
                .where(createdAtBetween(effectiveFrom, effectiveTo))
                .and(customerEquals(request.customerId()))
                .and(assigneeEquals(request.assigneeId()))
                .and(statusIn(request.statusIds()))
                .and(priorityIn(request.priorityIds()));
    }

    private List<ReportListItemDto> mapToListItems(List<Errand> errands) {
        List<Long> errandIds = errands.stream()
                .map(Errand::getErrandId)
                .toList();

        Map<Long, List<Purchase>> purchasesByErrandId = purchaseRepository.findByErrand_ErrandIdIn(errandIds).stream()
                .collect(Collectors.groupingBy(purchase -> purchase.getErrand().getErrandId()));

        return errands.stream()
                .map(errand -> reportMapper.toReportListItemDto(
                        errand,
                        purchasesByErrandId.getOrDefault(errand.getErrandId(), List.of())
                ))
                .toList();
    }

    private List<ReportRowDto> mapToRows(List<Errand> errands) {
        List<Long> errandIds = errands.stream()
                .map(Errand::getErrandId)
                .toList();

        Map<Long, List<Purchase>> purchasesByErrandId = purchaseRepository.findByErrand_ErrandIdIn(errandIds).stream()
                .collect(Collectors.groupingBy(purchase -> purchase.getErrand().getErrandId()));

        return errands.stream()
                .map(errand -> reportMapper.toReportRowDto(
                        errand,
                        purchasesByErrandId.getOrDefault(errand.getErrandId(), List.of())
                ))
                .toList();
    }

    private Sort buildSort(String sortBy) {
        return switch (sortBy) {
            case "customer" -> Sort.by("customer.name").ascending()
                    .and(Sort.by("errandId").ascending());
            case "contact" -> Sort.by("contact.lastName").ascending()
                    .and(Sort.by("contact.firstName").ascending())
                    .and(Sort.by("errandId").ascending());
            case "title" -> Sort.by("title").ascending()
                    .and(Sort.by("errandId").ascending());
            case "status" -> Sort.by("status.name").ascending()
                    .and(Sort.by("errandId").ascending());
            case "priority" -> Sort.by("priority.name").ascending()
                    .and(Sort.by("errandId").ascending());
            case "assignee" -> Sort.by("assignee.name").ascending()
                    .and(Sort.by("errandId").ascending());
            case "timeSpent" -> Sort.by("timeSpent").ascending()
                    .and(Sort.by("errandId").ascending());
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid sortBy value");
        };
    }

    private Specification<Errand> createdAtBetween(Instant from, Instant to) {
        return (root, query, cb) -> cb.between(root.get("createdAt"), from, to);
    }

    private Specification<Errand> customerEquals(Long customerId) {
        if (customerId == null) {
            return null;
        }

        return (root, query, cb) -> cb.equal(root.get("customer").get("customerId"), customerId);
    }

    private Specification<Errand> assigneeEquals(Long assigneeId) {
        if (assigneeId == null) {
            return null;
        }

        return (root, query, cb) -> cb.equal(root.get("assignee").get("assigneeId"), assigneeId);
    }

    private Specification<Errand> statusIn(List<Long> statusIds) {
        if (statusIds == null || statusIds.isEmpty()) {
            return null;
        }

        return (root, query, cb) -> root.get("status").get("statusId").in(statusIds);
    }

    private Specification<Errand> priorityIn(List<Long> priorityIds) {
        if (priorityIds == null || priorityIds.isEmpty()) {
            return null;
        }

        return (root, query, cb) -> root.get("priority").get("priorityId").in(priorityIds);
    }
}