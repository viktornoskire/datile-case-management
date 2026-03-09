package dev.datile.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "contacts")
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contact_id")
    private Long contactId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "first_name", nullable = false, length = 255)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 255)
    private String lastName;

    @Column(name = "phone_number", length = 255)
    private String phoneNumber;

    @Column(length = 255)
    private String mail;

    protected Contact() {
    }

    public Contact(Customer customer, String firstName, String lastName, String phoneNumber, String mail) {
        this.customer = customer;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.mail = mail;
    }

    public Long getContactId() {
        return contactId;
    }

    public Customer getCustomer() {
        return customer;
    }

    public Long getCustomerId() {
        return customer != null ? customer.getCustomerId() : null;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getMail() {
        return mail;
    }
}