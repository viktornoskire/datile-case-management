package dev.datile.repository;

import dev.datile.domain.Status;
import org.springframework.data.jpa.repository.JpaRepository;

/* JPA Spring Data repository for Status,
 * this allows service layer to pull statuses from the database based on id´s
 * */

public interface StatusRepository extends JpaRepository<Status, Long> {
}


