package dev.datile.service;

import dev.datile.dto.errands.ErrandsResponseDto;
import dev.datile.mapper.ErrandMapper;
import dev.datile.repository.ErrandRepository;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

/* Unit test to verify that service builds pageable/spec, and calls repo correctly.
*
* */

class ErrandServiceTest {

    @Test
    void list_uses_spec_and_pageable() {
        var repo = mock(ErrandRepository.class);
        var mapper = mock(ErrandMapper.class);
        var service = new ErrandService(repo, mapper);

        when(repo.findAll(any(Specification.class), any(Pageable.class)))
                .thenAnswer(invocation -> {
                    Pageable p = invocation.getArgument(1);
                    return new org.springframework.data.domain.PageImpl<>(java.util.List.of(), p, 0);
                });

        ErrandsResponseDto res = service.list("1,2", 0, 20, "date", "desc");

        var specCaptor = ArgumentCaptor.forClass(Specification.class);
        var pageableCaptor = ArgumentCaptor.forClass(Pageable.class);

        verify(repo, times(1)).findAll(specCaptor.capture(), pageableCaptor.capture());

        assertEquals(0, res.page());
        assertEquals(20, res.size());
    }
}