package dev.datile.service;

import dev.datile.dto.reports.ReportFilterRequestDto;
import dev.datile.dto.reports.ReportRowDto;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.text.NumberFormat;
import java.time.temporal.TemporalAccessor;
import java.util.List;
import java.util.Locale;

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

        String formatted = formatValue(value);
        String escaped = formatted.replace("\"", "\"\"");
        return "\"" + escaped + "\"";
    }

    private String formatValue(Object value) {
        if (value instanceof BigDecimal bigDecimal) {
            return formatDecimal(bigDecimal);
        }

        if (value instanceof Double doubleValue) {
            return formatDecimal(BigDecimal.valueOf(doubleValue));
        }

        if (value instanceof Float floatValue) {
            return formatDecimal(BigDecimal.valueOf(floatValue.doubleValue()));
        }

        if (value instanceof TemporalAccessor) {
            return String.valueOf(value);
        }

        return String.valueOf(value);
    }

    private String formatDecimal(BigDecimal value) {
        NumberFormat format = NumberFormat.getNumberInstance(new Locale("sv", "SE"));
        format.setGroupingUsed(false);
        format.setMinimumFractionDigits(0);
        format.setMaximumFractionDigits(2);
        return format.format(value);
    }
}