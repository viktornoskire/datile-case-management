package dev.datile.controller;

import dev.datile.dto.errands.ContactDto;
import dev.datile.repository.ContactRepository;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final ContactRepository contactRepository;

    public ContactController(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @GetMapping
    public List<ContactDto> listContacts() {
        return contactRepository.findAll(Sort.by("contactId")).stream()
                .map(contact -> new ContactDto(
                        contact.getContactId(),
                        contact.getFirstName(),
                        contact.getLastName(),
                        contact.getPhoneNumber(),
                        contact.getMail()
                ))
                .toList();
    }
}