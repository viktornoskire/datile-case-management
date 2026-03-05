package dev.datile.domain;

import jakarta.persistence.*;

/* JPA entitiy for the priorities table */

@Entity
@Table(name = "priorities")
public class Priority {

    @Id
    @Column(name = "priority_id")
    private Long priorityId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String color;

    @Column(name = "is_default", nullable = false)
    private boolean isDefault;

    protected Priority() {}

    public Long getPriorityId() { return priorityId; }
    public String getName() { return name; }
    public String getColor() { return color; }
    public boolean isDefault() { return isDefault; }
}