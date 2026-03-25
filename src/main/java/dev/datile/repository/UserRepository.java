package dev.datile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import dev.datile.domain.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    List<User> findByIsActiveTrue();

    boolean existsByEmailAndIsActiveTrue(String email);

    long countByRoleAndIsActiveTrue(String role);

    Optional<User> findByEmailAndIsActiveTrue(String email);
}
