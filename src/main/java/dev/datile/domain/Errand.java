package dev.datile.domain;

import jakarta.persistence.*;

import java.math.BigDecimal;
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

    @Column(name = "description", nullable = true, columnDefinition = "TEXT")
    private String description;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id", nullable = false)
    private Status status;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "priority_id", nullable = false)
    private Priority priority;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private Assignee assignee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id")
    private Contact contact;

    @Column(name = "time_spent")
    private Double timeSpent;

    @Column(name = "agreed_price", precision = 12, scale = 2)
    private BigDecimal agreedPrice;

    protected Errand() {
    }

    public Errand(String title, String description, Status status, Priority priority, Instant createdAt) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.createdAt = createdAt;
    }

    public Long getErrandId() {
        return errandId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Status getStatus() {
        return status;
    }

    public Priority getPriority() {
        return priority;
    }

    public Assignee getAssignee() {
        return assignee;
    }

    public Customer getCustomer() {
        return customer;
    }

    public Contact getContact() {
        return contact;
    }

    public Double getTimeSpent() {
        return timeSpent;
    }

    public BigDecimal getAgreedPrice() {
        return agreedPrice;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public void setAssignee(Assignee assignee) {
        this.assignee = assignee;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public void setContact(Contact contact) {
        this.contact = contact;
    }

    public void setTimeSpent(Double timeSpent) {
        this.timeSpent = timeSpent;
    }

    public void setAgreedPrice(BigDecimal agreedPrice) {
        this.agreedPrice = agreedPrice;
    }
}