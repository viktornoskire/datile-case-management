package dev.datile.domain;

import jakarta.persistence.*;

/* (JPA ENTITY)
 * This represents a row in the db table "statuses"
 * Hibernate/JPA uses it to read and write to DB.
 * It is used as a lookup-table(catalogue) that Errands points to via e foreign key.
 */

@Entity
@Table(name = "statuses")
public class Status {
    @Id
    @Column(name = "status_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long statusId;

    @Column(nullable = false)
    private String name;

    protected Status() {
    }

    public Status(Long statusId, String name) {
        this.statusId = statusId;
        this.name = name;
    }

    public Long getStatusId() {
        return statusId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}