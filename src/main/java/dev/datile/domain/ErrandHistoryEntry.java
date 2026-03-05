package dev.datile.domain;

import jakarta.persistence.*;
import java.time.Instant;

/* JPA Entity for errand_history table */

@Entity
@Table(name = "errand_history")
public class ErrandHistoryEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id")
    private Long historyId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "errand_id", nullable = false)
    private Errand errand;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(name = "verified_name", nullable = false, length = 100)
    private String verifiedName;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected ErrandHistoryEntry() {
    }

    public Long getHistoryId() {
        return historyId;
    }

    public Errand getErrand() {
        return errand;
    }

    public String getDescription() {
        return description;
    }

    public String getVerifiedName() {
        return verifiedName;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}