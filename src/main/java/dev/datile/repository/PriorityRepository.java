package dev.datile.repository;

import dev.datile.domain.Priority;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/* JPA Spring Data repository for priority,
 * this allows service layer to pull priorities from the database based on id´s
 * */

public interface PriorityRepository extends JpaRepository<Priority, Long> {

    boolean existsByNameIgnoreCase(String name);

    @Modifying
    @Query("UPDATE Priority p SET p.isDefault = false")
    void clearDefault();

    List<Priority> findByIsActiveTrue(Sort sort);

    boolean existsByNameIgnoreCaseAndIsActiveTrue(String name);
}


