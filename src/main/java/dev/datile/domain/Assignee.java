package dev.datile.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "assignees")
public class Assignee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assignee_id")
    private Long assigneeId;

    @Column(nullable = false, length = 255)
    private String name;

    protected Assignee() {
    }

    public Assignee(String name) {
        this.name = name;
    }

    public Long getAssigneeId() {
        return assigneeId;
    }

    public String getName() {
        return name;
    }
}