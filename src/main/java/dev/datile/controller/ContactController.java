package dev.datile.controller;

import dev.datile.dto.contacts.ContactListItemDto;
import dev.datile.dto.contacts.CreateContactRequestDto;
import dev.datile.dto.contacts.UpdateContactRequestDto;
import dev.datile.service.ContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @GetMapping
    public List<ContactListItemDto> listContacts() {
        return contactService.listContacts();
    }

    @PostMapping
    public ContactListItemDto createContact(@RequestBody CreateContactRequestDto request) {
        return contactService.createContact(request);
    }

    @PutMapping("/{contactId}")
    public ContactListItemDto updateContact(
            @PathVariable Long contactId,
            @RequestBody UpdateContactRequestDto request
    ) {
        return contactService.updateContact(contactId, request);
    }

    @DeleteMapping("/{contactId}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long contactId) {
        contactService.deleteContact(contactId);
        return ResponseEntity.noContent().build();
    }
}