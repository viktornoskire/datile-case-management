package dev.datile.service;

import dev.datile.domain.Contact;
import dev.datile.domain.Customer;
import dev.datile.dto.contacts.ContactListItemDto;
import dev.datile.dto.contacts.CreateContactRequestDto;
import dev.datile.dto.contacts.UpdateContactRequestDto;
import dev.datile.repository.ContactRepository;
import dev.datile.repository.CustomerRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {

    private final ContactRepository contactRepository;
    private final CustomerRepository customerRepository;

    public ContactService(ContactRepository contactRepository, CustomerRepository customerRepository) {
        this.contactRepository = contactRepository;
        this.customerRepository = customerRepository;
    }

    public List<ContactListItemDto> listContacts() {
        return contactRepository.findByIsActiveTrue(Sort.by("contactId").ascending())
                .stream()
                .map(this::toDto)
                .toList();
    }

    public ContactListItemDto createContact(CreateContactRequestDto request) {
        validateRequest(
                request.customerId(),
                request.firstName(),
                request.lastName(),
                request.phoneNumber(),
                request.mail()
        );

        Customer customer = customerRepository.findByCustomerIdAndIsActiveTrue(request.customerId())
                .orElseThrow(() -> new IllegalArgumentException("Kunden hittades inte."));

        Contact contact = new Contact(
                customer,
                request.firstName().trim(),
                request.lastName().trim(),
                request.phoneNumber() != null ? request.phoneNumber().trim() : null,
                request.mail() != null ? request.mail().trim() : null,
                true
        );

        Contact saved = contactRepository.save(contact);
        return toDto(saved);
    }

    public ContactListItemDto updateContact(Long contactId, UpdateContactRequestDto request) {
        validateRequest(
                request.customerId(),
                request.firstName(),
                request.lastName(),
                request.phoneNumber(),
                request.mail()
        );

        Contact contact = contactRepository.findByContactIdAndIsActiveTrue(contactId)
                .orElseThrow(() -> new IllegalArgumentException("Kontakten hittades inte."));

        Customer customer = customerRepository.findByCustomerIdAndIsActiveTrue(request.customerId())
                .orElseThrow(() -> new IllegalArgumentException("Kunden hittades inte."));

        contact.update(
                customer,
                request.firstName().trim(),
                request.lastName().trim(),
                request.phoneNumber() != null ? request.phoneNumber().trim() : null,
                request.mail() != null ? request.mail().trim() : null
        );

        Contact saved = contactRepository.save(contact);
        return toDto(saved);
    }

    public void deleteContact(Long contactId) {
        Contact contact = contactRepository.findByContactIdAndIsActiveTrue(contactId)
                .orElseThrow(() -> new IllegalArgumentException("Kontakten hittades inte."));

        contact.deactivate();
        contactRepository.save(contact);
    }

    private ContactListItemDto toDto(Contact contact) {
        return new ContactListItemDto(
                contact.getContactId(),
                contact.getCustomer().getCustomerId(),
                contact.getCustomer().getName(),
                contact.getFirstName(),
                contact.getLastName(),
                contact.getPhoneNumber(),
                contact.getMail()
        );
    }

    private void validateRequest(
            Long customerId,
            String firstName,
            String lastName,
            String phoneNumber,
            String mail
    ) {
        if (customerId == null) {
            throw new IllegalArgumentException("Kund måste väljas.");
        }

        if (firstName == null || firstName.trim().isEmpty()) {
            throw new IllegalArgumentException("Förnamn måste fyllas i.");
        }

        if (lastName == null || lastName.trim().isEmpty()) {
            throw new IllegalArgumentException("Efternamn måste fyllas i.");
        }

        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Telefonnummer måste fyllas i.");
        }

        if (mail == null || mail.trim().isEmpty()) {
            throw new IllegalArgumentException("E-postadress måste fyllas i.");
        }
    }
}