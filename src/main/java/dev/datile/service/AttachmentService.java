package dev.datile.service;

import dev.datile.domain.Attachment;
import dev.datile.domain.Errand;
import dev.datile.repository.AttachmentRepository;
import dev.datile.repository.ErrandRepository;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class AttachmentService {

    private final AttachmentRepository repo;
    private final ErrandRepository errandRepo;

    private static final List<String> ALLOWED_TYPES = List.of(
            "image/png",
            "image/jpeg",
            "image/jpg",
            "application/pdf"
    );

    public AttachmentService(AttachmentRepository repo, ErrandRepository errandRepo) {
        this.repo = repo;
        this.errandRepo = errandRepo;
    }

    public void upload(Long errandId, List<MultipartFile> files) throws IOException {

        Errand errand = errandRepo.findById(errandId)
                .orElseThrow(() -> new RuntimeException("Errand not found"));

        String baseDir = "uploads/errands/" + errandId;

        Path uploadPath = Paths.get(baseDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        for (MultipartFile file : files) {

            if (!ALLOWED_TYPES.contains(file.getContentType())) {
                throw new RuntimeException("Filtyp inte tillåten: " + file.getContentType());
            }

            if (file.getSize() > 5_000_000) { // 5MB
                throw new RuntimeException("Filen är för stor (max 5MB)");
            }

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            Files.copy(file.getInputStream(), filePath);

            Attachment attachment = new Attachment();
            attachment.setErrand(errand);
            attachment.setFileName(fileName);
            attachment.setFilePath(filePath.toString());
            attachment.setContentType(file.getContentType());

            repo.save(attachment);
        }
    }

    public Resource getFile(Long id) throws IOException {
        Attachment file = repo.findById(id).orElseThrow();

        Path path = Paths.get(file.getFilePath());

        return new UrlResource(path.toUri());
    }

    public List<Attachment> getByErrand(Long errandId) {
        return repo.findByErrand_ErrandId(errandId);
    }
}