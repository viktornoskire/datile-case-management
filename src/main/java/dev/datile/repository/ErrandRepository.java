package dev.datile.repository;

import dev.datile.domain.Errand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/* ErrandRepository is the Spring Data JPA
 * That basically means that we don´t have to write pure SQL in java to find stuff
 * Spring gives us everything for free - findAll(Pageable)
 * Repository = "DB-Access"
 *  */

public interface ErrandRepository extends JpaRepository<Errand, Long>, JpaSpecificationExecutor<Errand> {}