package dev.datile.domain;

import jakarta.persistence.*;

/* JPA entitiy for the priorities table */

@Entity
@Table(name = "priorities")
public class Priority {

    @Id
    @Column(name = "priority_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long priorityId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String color;

    @Column(name = "is_default", nullable = false)
    private boolean isDefault;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    protected Priority() {}

    public Priority(String name, String color, boolean isDefault) {
        this.name = name;
        this.color = color;
        this.isDefault = isDefault;
    }

    public Long getPriorityId() { return priorityId; }
    public String getName() { return name; }
    public String getColor() { return color; }
    public boolean isDefault() { return isDefault; }

    public void setName(String name) {
        this.name = name;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public void setDefault(boolean b) {
        isDefault = b;
    }
}