package dev.datile.domain;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "errand_history")
public class ErrandHistoryEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id")
    private Long historyId;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "errand_id", nullable = false)
    private Errand errand;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(name = "verified_name", nullable = false, length = 100)
    private String verifiedName;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    public ErrandHistoryEntry() {
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

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setErrand(Errand errand) {
        this.errand = errand;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setVerifiedName(String verifiedName) {
        this.verifiedName = verifiedName;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}