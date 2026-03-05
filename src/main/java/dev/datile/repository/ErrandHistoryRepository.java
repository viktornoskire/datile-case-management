package dev.datile.repository;

import dev.datile.domain.ErrandHistoryEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.util.List;

/* Repository for history  table - pulls history preview for a whole page of errands */

public interface ErrandHistoryRepository extends JpaRepository<ErrandHistoryEntry, Long> {

    interface HistoryPreviewRow {
        Long getErrandId();

        String getDescription();

        String getVerifiedName();

        Timestamp getCreatedAt();
    }

    /* This special native SQL-query makes it possible to show (ONLY 2 ROWS MAX) history for errands that are shown on the page */
    @Query(value = """
            SELECT x.errand_id AS errandId, x.description AS description, x.verified_name AS verifiedName, x.created_at AS createdAt
            FROM (
              SELECT eh.*,
                     ROW_NUMBER() OVER (PARTITION BY eh.errand_id ORDER BY eh.created_at DESC) rn
              FROM errand_history eh
              WHERE eh.errand_id IN (:errandIds)
            ) x
            WHERE x.rn <= :limit
            ORDER BY x.errand_id, x.created_at DESC
            """, nativeQuery = true)
    List<HistoryPreviewRow> findHistoryPreview(@Param("errandIds") List<Long> errandIds, @Param("limit") int limit);
}