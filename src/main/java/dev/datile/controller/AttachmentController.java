package dev.datile.controller;

import dev.datile.domain.Attachment;
import dev.datile.repository.AttachmentRepository;
import dev.datile.service.AttachmentService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/attachments")
public class AttachmentController {

    private final AttachmentService service;
    private final AttachmentRepository attachmentRepository;

    public AttachmentController(AttachmentService service, AttachmentRepository attachmentRepository) {
        this.service = service;
        this.attachmentRepository = attachmentRepository;
    }

    @PostMapping("/{errandId}")
    public ResponseEntity<?> upload(
            @PathVariable Long errandId,
            @RequestParam("files") List<MultipartFile> files
    ) throws IOException {
        service.upload(errandId, files);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> get(@PathVariable Long id) throws IOException {

        Attachment file = attachmentRepository.findById(id).orElseThrow();

        Resource resource = new UrlResource(Paths.get(file.getFilePath()).toUri());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(file.getContentType())) // 👈 THIS
                .body(resource);
    }
}