package dev.datile.service;

import dev.datile.dto.reports.ReportFilterRequestDto;
import dev.datile.dto.reports.ReportRowDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

class ReportExportServiceImplTest {

    private ReportQueryService reportQueryService;
    private ReportExportServiceImpl reportExportService;

    @BeforeEach
    void setUp() {
        reportQueryService = Mockito.mock(ReportQueryService.class);
        reportExportService = new ReportExportServiceImpl(reportQueryService);
    }

    @Test
    void exportCsv_shouldFormatDecimalValuesWithCommaForSwedishExcel() {
        ReportFilterRequestDto request = new ReportFilterRequestDto(
                null,
                null,
                null,
                null,
                List.of(),
                List.of(),
                "customer",
                0,
                20
        );

        ReportRowDto row = new ReportRowDto(
                1L,
                Instant.parse("2026-03-31T08:30:00Z"),
                "Problem med nätverk",
                "Acme AB",
                "Karin Svensson",
                "Niklas",
                "Pågående",
                "Hög",
                new BigDecimal("12.5"),
                new BigDecimal("499.90"),
                new BigDecimal("120.25")
        );

        when(reportQueryService.getReportRowsForExport(request)).thenReturn(List.of(row));

        byte[] result = reportExportService.exportCsv(request);
        String csv = new String(result, StandardCharsets.UTF_8);

        assertThat(csv).contains("\"12,5\"");
        assertThat(csv).contains("\"499,9\"");
        assertThat(csv).contains("\"120,25\"");
        assertThat(csv).doesNotContain("\"12.5\"");
        assertThat(csv).contains("Ärende-ID;Kund;Titel;Kontakt;Status;Prioritet;Ansvarig;Tidsåtgång;Datum;Överenskommet pris;Inköp i ärendet;");
    }
}