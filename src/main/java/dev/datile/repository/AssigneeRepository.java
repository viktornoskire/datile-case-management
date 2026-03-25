package dev.datile.repository;

import dev.datile.domain.Assignee;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssigneeRepository extends JpaRepository<Assignee, Long> {
    boolean existsByNameIgnoreCase(String name);

    List<Assignee> findByIsActiveTrue(Sort sort);

    boolean existsByNameIgnoreCaseAndIsActiveTrue(String name);
}