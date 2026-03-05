package dev.datile.spec;

import dev.datile.domain.Errand;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

/* This will hold the building blocks for filtering in our DB */

public final class ErrandSpecifications {

    private ErrandSpecifications() {}

    public static Specification<Errand> statusIdIn(List<Long> statusIds) {
        return (root, query, cb) -> {
            if (statusIds == null || statusIds.isEmpty()) return cb.conjunction();
            return root.get("status").get("statusId").in(statusIds);
        };
    }
}