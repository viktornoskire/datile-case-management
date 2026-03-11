package dev.datile.service;

import dev.datile.domain.Assignee;
import dev.datile.domain.Contact;
import dev.datile.domain.Customer;
import dev.datile.domain.Errand;
import dev.datile.domain.ErrandHistoryEntry;
import dev.datile.domain.Priority;
import dev.datile.domain.Purchase;
import dev.datile.domain.Status;
import dev.datile.dto.errands.AddHistoryEntryDto;
import dev.datile.dto.errands.CreateErrandDto;
import dev.datile.dto.errands.CreatePurchaseDto;
import dev.datile.dto.errands.ErrandDetailsDto;
import dev.datile.dto.errands.ErrandsResponseDto;
import dev.datile.dto.errands.HistoryEntryDto;
import dev.datile.dto.errands.UpdateErrandDto;
import dev.datile.mapper.ErrandMapper;
import dev.datile.repository.AssigneeRepository;
import dev.datile.repository.ContactRepository;
import dev.datile.repository.CustomerRepository;
import dev.datile.repository.ErrandHistoryRepository;
import dev.datile.repository.ErrandRepository;
import dev.datile.repository.PriorityRepository;
import dev.datile.repository.PurchaseRepository;
import dev.datile.repository.StatusRepository;
import dev.datile.spec.ErrandSpecifications;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;

@Service
public class ErrandService {

    private final ErrandHistoryRepository historyRepo;
    private final ErrandRepository repo;
    private final ErrandMapper mapper;
    private final StatusRepository statusRepo;
    private final PriorityRepository priorityRepo;
    private final AssigneeRepository assigneeRepo;
    private final CustomerRepository customerRepo;
    private final ContactRepository contactRepo;
    private final PurchaseRepository purchaseRepo;

    public ErrandService(
            ErrandRepository repo,
            ErrandMapper mapper,
            ErrandHistoryRepository historyRepo,
            StatusRepository statusRepo,
            PriorityRepository priorityRepo,
            AssigneeRepository assigneeRepo,
            CustomerRepository customerRepo,
            ContactRepository contactRepo,
            PurchaseRepository purchaseRepo
    ) {
        this.repo = repo;
        this.mapper = mapper;
        this.historyRepo = historyRepo;
        this.statusRepo = statusRepo;
        this.priorityRepo = priorityRepo;
        this.assigneeRepo = assigneeRepo;
        this.customerRepo = customerRepo;
        this.contactRepo = contactRepo;
        this.purchaseRepo = purchaseRepo;
    }

    @Transactional(readOnly = true)
    public ErrandsResponseDto list(String statusIdsCsv, int page, int size, String sortBy, String sortDir) {
        final var statusIds = parseCsvLongs(statusIdsCsv);

        final var spec = Specification.where(ErrandSpecifications.statusIdIn(statusIds));

        final var pageable = PageRequest.of(
                Math.max(page, 0),
                size <= 0 ? 20 : Math.min(size, 200),
                Sort.by(parseDirection(sortDir), mapSortField(sortBy))
        );

        final var result = repo.findAll(spec, pageable);

        final var errands = result.getContent();
        final var ids = errands.stream().map(Errand::getErrandId).toList();

        final var rows = ids.isEmpty()
                ? List.<ErrandHistoryRepository.HistoryPreviewRow>of()
                : historyRepo.findHistoryPreview(ids, 2);

        final var historyMap = rows.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        ErrandHistoryRepository.HistoryPreviewRow::getErrandId,
                        java.util.stream.Collectors.mapping(
                                row -> new HistoryEntryDto(
                                        row.getHistoryId(),
                                        row.getDescription(),
                                        row.getVerifiedName(),
                                        row.getCreatedAt().toInstant()
                                ),
                                java.util.stream.Collectors.toList()
                        )
                ));

        final var dtos = errands.stream()
                .map(errand -> mapper.toListItemDto(
                        errand,
                        historyMap.getOrDefault(errand.getErrandId(), List.of())
                ))
                .toList();

        return new ErrandsResponseDto(
                dtos,
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages()
        );
    }

    @Transactional(readOnly = true)
    public ErrandDetailsDto getById(Long id) {
        Errand errand = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ärende inte hittat"));

        final var history = historyRepo.findFullHistoryByErrandId(id).stream()
                .map(h -> new HistoryEntryDto(
                        h.getHistoryId(),
                        h.getDescription(),
                        h.getVerifiedName(),
                        h.getCreatedAt().toInstant()
                ))
                .toList();

        final var purchases = purchaseRepo.findByErrandErrandId(id).stream()
                .map(mapper::toPurchaseDto)
                .toList();

        return mapper.toDetailsDto(
                errand,
                history,
                purchases
        );
    }

    @Transactional
    public ErrandDetailsDto update(Long id, UpdateErrandDto request) {
        Errand errand = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ärende inte hittat"));

        Status status = statusRepo.findById(request.statusId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ogiltigt statusId"));

        Priority priority = priorityRepo.findById(request.priorityId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ogiltigt priorityId"));

        Assignee assignee = null;
        if (request.assigneeId() != null) {
            assignee = assigneeRepo.findById(request.assigneeId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ogiltigt assigneeId"));
        }

        Customer customer = null;
        if (request.customerId() != null) {
            customer = customerRepo.findById(request.customerId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ogiltigt customerId"));
        }

        Contact contact = null;
        if (request.contactId() != null) {
            contact = contactRepo.findById(request.contactId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ogiltigt contactId"));
        }

        errand.setTitle(request.title().trim());
        errand.setDescription(request.description() != null ? request.description().trim() : null);
        errand.setStatus(status);
        errand.setPriority(priority);
        errand.setAssignee(assignee);
        errand.setCustomer(customer);
        errand.setContact(contact);
        errand.setTimeSpent(request.timeSpent());
        errand.setAgreedPrice(request.agreedPrice());

        repo.save(errand);

        return getById(errand.getErrandId());
    }

    @Transactional
    public ErrandDetailsDto create(CreateErrandDto request) {
        Status status = statusRepo.findById(request.statusId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ogiltigt statusId"));

        Priority priority = priorityRepo.findById(request.priorityId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ogiltigt priorityId"));

        Assignee assignee = assigneeRepo.findById(request.assigneeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ogiltigt assigneeId"));

        Customer customer = customerRepo.findById(request.customerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ogiltigt customerId"));

        Contact contact = contactRepo.findById(request.contactId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ogiltigt contactId"));

        Errand errand = new Errand(
                request.title().trim(),
                request.description() != null ? request.description().trim() : null,
                status,
                priority,
                Instant.now()
        );

        errand.setAssignee(assignee);
        errand.setCustomer(customer);
        errand.setContact(contact);
        errand.setTimeSpent(request.timeSpent());
        errand.setAgreedPrice(BigDecimal.valueOf(request.agreedPrice()));

        Errand savedErrand = repo.save(errand);

        if (request.purchases() != null && !request.purchases().isEmpty()) {
            for (CreatePurchaseDto purchaseDto : request.purchases()) {
                Purchase purchase = new Purchase(
                        savedErrand,
                        purchaseDto.itemName().trim(),
                        purchaseDto.quantity(),
                        purchaseDto.purchasePrice(),
                        purchaseDto.shippingCost(),
                        purchaseDto.salePrice()
                );

                purchaseRepo.save(purchase);
            }
        }

        return getById(savedErrand.getErrandId());
    }

    @Transactional
    public ErrandDetailsDto addHistoryEntry(Long id, AddHistoryEntryDto request) {
        Errand errand = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ärende inte hittat"));

        ErrandHistoryEntry entry = new ErrandHistoryEntry();
        entry.setErrand(errand);
        entry.setDescription(request.description().trim());
        entry.setVerifiedName("System");
        entry.setCreatedAt(Timestamp.from(Instant.now()));

        historyRepo.save(entry);

        return getById(id);
    }

    private List<Long> parseCsvLongs(String csv) {
        if (csv == null || csv.isBlank()) {
            return List.of();
        }

        return Arrays.stream(csv.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(Long::valueOf)
                .toList();
    }

    private Sort.Direction parseDirection(String sortDir) {
        return "desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC;
    }

    private String mapSortField(String sortBy) {
        if (sortBy == null || sortBy.isBlank() || "date".equalsIgnoreCase(sortBy)) {
            return "createdAt";
        }

        if ("title".equalsIgnoreCase(sortBy)) {
            return "title";
        }

        throw new IllegalArgumentException("Invalid sortBy: " + sortBy);
    }
}