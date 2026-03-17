package dev.datile.repository;

import dev.datile.domain.Assignee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssigneeRepository extends JpaRepository<Assignee, Long> {
    boolean existsByNameIgnoreCase(String name);
}