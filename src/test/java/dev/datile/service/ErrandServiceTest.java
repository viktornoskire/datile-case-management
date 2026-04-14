package dev.datile.service;

import dev.datile.dto.errands.ErrandFilterRequest;
import dev.datile.dto.errands.ErrandsResponseDto;
import dev.datile.mapper.ErrandMapper;
import dev.datile.repository.*;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class ErrandServiceTest {

    @Test
    void list_uses_spec_and_pageable() {
        var repo = mock(ErrandRepository.class);
        var mapper = mock(ErrandMapper.class);
        var historyRepo = mock(ErrandHistoryRepository.class);
        var statusRepo = mock(StatusRepository.class);
        var priorityRepo = mock(PriorityRepository.class);
        var assigneeRepo = mock(AssigneeRepository.class);
        var customerRepo = mock(CustomerRepository.class);
        var contactRepo = mock(ContactRepository.class);
        var purchaseRepo = mock(PurchaseRepository.class);
        var attachmentRepo = mock(AttachmentRepository.class);

        var service = new ErrandService(
                repo,
                mapper,
                historyRepo,
                statusRepo,
                priorityRepo,
                assigneeRepo,
                customerRepo,
                contactRepo,
                purchaseRepo,
                attachmentRepo
        );

        when(repo.findAll(any(Specification.class), any(Pageable.class)))
                .thenAnswer(invocation -> {
                    Pageable pageable = invocation.getArgument(1);
                    return new PageImpl<>(List.of(), pageable, 0);
                });

        when(historyRepo.findHistoryPreview(anyList(), anyInt()))
                .thenReturn(List.of());

        ErrandsResponseDto result = service.list(new ErrandFilterRequest(
                null,   // status
                null,   // priority
                null,   // assigneeId
                null,   // customerId
                null,   // q
                "date", // sortBy
                "desc", // sortDir
                0,      // page
                20      // size
        ));

        var specCaptor = ArgumentCaptor.forClass(Specification.class);
        var pageableCaptor = ArgumentCaptor.forClass(Pageable.class);

        verify(repo, times(1)).findAll(specCaptor.capture(), pageableCaptor.capture());

        assertEquals(0, result.page());
        assertEquals(20, result.size());
    }
}