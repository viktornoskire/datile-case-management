package dev.datile.repository;

import dev.datile.domain.Status;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/* JPA Spring Data repository for Status,
 * this allows service layer to pull statuses from the database based on id´s
 * */

public interface StatusRepository extends JpaRepository<Status, Long> {

    boolean existsByNameIgnoreCaseAndIsActiveTrue(String name);

    List<Status> findByIsActiveTrue(Sort sort);
}


