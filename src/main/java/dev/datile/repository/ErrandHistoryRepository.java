package dev.datile.repository;

import dev.datile.domain.ErrandHistoryEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.util.List;

/* Repository for history table - pulls history preview for a whole page of errands */

public interface ErrandHistoryRepository extends JpaRepository<ErrandHistoryEntry, Long> {

    interface HistoryPreviewRow {
        Long getHistoryId();
        Long getErrandId();
        String getDescription();
        String getVerifiedName();
        Timestamp getCreatedAt();
    }

    interface HistoryRow {
        Long getHistoryId();
        String getDescription();
        String getVerifiedName();
        Timestamp getCreatedAt();
    }

    /* Preview for list/card view: max 2 rows per errand */
    @Query(value = """
            SELECT x.history_id AS historyId,
                   x.errand_id AS errandId,
                   x.description AS description,
                   x.verified_name AS verifiedName,
                   x.created_at AS createdAt
            FROM (
              SELECT eh.*,
                     ROW_NUMBER() OVER (PARTITION BY eh.errand_id ORDER BY eh.created_at DESC) rn
              FROM errand_history eh
              WHERE eh.errand_id IN (:errandIds)
            ) x
            WHERE x.rn <= :limit
            ORDER BY x.errand_id, x.created_at DESC
            """, nativeQuery = true)
    List<HistoryPreviewRow> findHistoryPreview(@Param("errandIds") List<Long> errandIds,
                                               @Param("limit") int limit);

    /* Full history for one errand, used in modal/details view */
    @Query(value = """
            SELECT eh.history_id AS historyId,
                   eh.description AS description,
                   eh.verified_name AS verifiedName,
                   eh.created_at AS createdAt
            FROM errand_history eh
            WHERE eh.errand_id = :errandId
            ORDER BY eh.created_at DESC
            """, nativeQuery = true)
    List<HistoryRow> findFullHistoryByErrandId(@Param("errandId") Long errandId);
}