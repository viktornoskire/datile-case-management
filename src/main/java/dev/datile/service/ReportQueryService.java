package dev.datile.service;

import dev.datile.dto.reports.ReportFilterRequestDto;
import dev.datile.dto.reports.ReportRowDto;
import dev.datile.dto.reports.ReportsResponseDto;

import java.util.List;

public interface ReportQueryService {

    ReportsResponseDto getReports(ReportFilterRequestDto request);

    List<ReportRowDto> getReportRowsForExport(ReportFilterRequestDto request);
}