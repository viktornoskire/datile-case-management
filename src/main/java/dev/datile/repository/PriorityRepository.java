package dev.datile.repository;

import dev.datile.domain.Priority;
import org.springframework.data.jpa.repository.JpaRepository;

/* JPA Spring Data repository for priority,
 * this allows service layer to pull priorities from the database based on id´s
 * */

public interface PriorityRepository extends JpaRepository<Priority, Long> {
}


