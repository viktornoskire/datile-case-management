package dev.datile.domain;

import jakarta.persistence.*;

import java.time.Instant;

/* (JPA ENTITY)
 * This defines how an errand is supposed to look in the DB
 */


@Entity
@Table(name = "errands")
public class Errand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "errand_id")
    private Long errandId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id", nullable = false)
    private Status status;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "priority_id", nullable = false)
    private Priority priority;

    protected Errand() {}

    public Errand(String title, String description, Status status, Priority priority, Instant createdAt) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.createdAt = createdAt;
    }

    public Long getErrandId() { return errandId; }
    public Instant getCreatedAt() { return createdAt; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public Status getStatus() { return status; }
    public Priority getPriority() { return priority; }
}