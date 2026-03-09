INSERT INTO statuses(status_id, name)
VALUES (1, 'Nytt'),
       (2, 'Pågående'),
       (3, 'Väntar'),
       (4, 'Stängt'),
       (5, 'Beställt'),
       (6, 'Planerat'),
       (7, 'Väntar på fakturering'),
       (8, 'Klar ej fakt.'),
       (9, 'Bevakning');

INSERT INTO priorities(priority_id, name, color, is_default)
VALUES (1, 'PANIK HÖG', '#FF0000', FALSE),
       (2, 'HÖG', '#FF8800', FALSE),
       (3, 'Normal', '#3B82F6', TRUE),
       (4, 'Låg', '#29CC00', FALSE),
       (5, 'BEVAKNING', '#D1D5DB', FALSE);

INSERT INTO assignees(name)
VALUES ('Jimmy'),
       ('Niklas'),
       ('Leo');

INSERT INTO customers(name, is_active)
VALUES ('Hultfält AB', TRUE),
       ('Acme AB', TRUE),
       ('Northwind AB', TRUE);

INSERT INTO contacts(customer_id, first_name, last_name, phone_number, mail)
VALUES (1, 'John', 'Doe', '0701234567', 'johndoe1@gmail.com'),
       (1, 'Jane', 'Doe', '0701234568', 'janedoe@gmail.com'),
       (2, 'Karin', 'Svensson', '0702223344', 'karin@example.com'),
       (3, 'Per', 'Nilsson', '0703334455', 'per@example.com');

INSERT INTO errands(created_at, title, description, time_spent, agreed_price, assignee_id, customer_id, contact_id, status_id, priority_id)
VALUES
    (UTC_TIMESTAMP(), 'Trasig dator', 'Dator som inte startar', 1.6, 150.00, 1, 1, 1, 1, 1),
    (UTC_TIMESTAMP(), 'Problem med kablarna', 'Brandvägg behöver felsökas', 2.0, 300.00, 2, 2, 3, 2, 2);

INSERT INTO errand_history(errand_id, created_at, description, verified_name)
VALUES
    (1, UTC_TIMESTAMP(), 'Jag fixade kablar', 'Leo'),
    (1, UTC_TIMESTAMP(), 'Jag ordnade en grej', 'Leo'),
    (2, UTC_TIMESTAMP(), 'Jag tog hand om detta', 'Niklas');