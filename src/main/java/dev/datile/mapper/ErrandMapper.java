package dev.datile.mapper;

import dev.datile.domain.Errand;
import dev.datile.domain.Priority;
import dev.datile.dto.errands.*;
import org.springframework.stereotype.Component;

import java.util.List;

/* ErrandMapper takes an Errand entity and translates it to a DTO (ErrandListItemDto (API-format))
 * We keep all mapping in one place to avoid spaghetti all over the place.
 *
 * */

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
                historyPreview
        );
    }

    private StatusDto toStatusDto(dev.datile.domain.Status s) {
        if (s == null) return null;
        return new StatusDto(s.getStatusId(), s.getName());
    }

    private PriorityDto toPriorityDto(Priority p) {
        if (p == null) return null;
        return new PriorityDto(p.getPriorityId(), p.getName(), p.getColor());
    }
}
