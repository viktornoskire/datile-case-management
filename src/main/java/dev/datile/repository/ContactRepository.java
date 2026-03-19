package dev.datile.repository;

import dev.datile.domain.Contact;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContactRepository extends JpaRepository<Contact, Long> {

    List<Contact> findByIsActiveTrue(Sort sort);

    Optional<Contact> findByContactIdAndIsActiveTrue(Long contactId);
}