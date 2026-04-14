package dev.datile.repository;

import dev.datile.domain.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    List<Attachment> findByErrand_ErrandId(Long errandId);
}
