package dev.datile.service;

import dev.datile.dto.reports.ReportFilterRequestDto;
import dev.datile.dto.reports.ReportRowDto;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.List;

/* Takes finished report data and makes a file */

@Service
public class ReportExportServiceImpl implements ReportExportService {

    private final ReportQueryService reportQueryService;

    public ReportExportServiceImpl(ReportQueryService reportQueryService) {
        this.reportQueryService = reportQueryService;
    }

    @Override
    public byte[] exportCsv(ReportFilterRequestDto request) {
        List<ReportRowDto> rows = reportQueryService.getReportRowsForExport(request);

        StringBuilder csv = new StringBuilder();
        csv.append('\uFEFF');
        csv.append("Ärende-ID;Kund;Titel;Kontakt;Status;Prioritet;Ansvarig;Tidsåtgång;Datum;Överenskommet pris;Inköp i ärendet;\n");

        for (ReportRowDto row : rows) {
            csv.append(csvValue(row.errandId())).append(";");
            csv.append(csvValue(row.customerName())).append(";");
            csv.append(csvValue(row.title())).append(";");
            csv.append(csvValue(row.contactName())).append(";");
            csv.append(csvValue(row.status())).append(";");
            csv.append(csvValue(row.priority())).append(";");
            csv.append(csvValue(row.assigneeName())).append(";");
            csv.append(csvValue(row.timeSpent())).append(";");
            csv.append(csvValue(row.createdAt())).append(";");
            csv.append(csvValue(row.agreedPrice())).append(";");
            csv.append(csvValue(row.customerPurchaseTotal())).append("\n");
        }

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String csvValue(Object value) {
        if (value == null) {
            return "\"\"";
        }

        String escaped = String.valueOf(value).replace("\"", "\"\"");
        return "\"" + escaped + "\"";
    }
}