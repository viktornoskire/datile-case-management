CREATE TABLE statuses
(
    status_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name      VARCHAR(100) NOT NULL
);

CREATE TABLE priorities
(
    priority_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    color       VARCHAR(20)  NOT NULL,
    is_default  BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE TABLE assignees
(
    assignee_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL
);

CREATE TABLE customers
(
    customer_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(150) NOT NULL,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE contacts
(
    contact_id    BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id   BIGINT       NOT NULL,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    phone_number  VARCHAR(50),
    mail          VARCHAR(150),
    CONSTRAINT fk_contacts_customer
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE errands
(
    errand_id      BIGINT PRIMARY KEY AUTO_INCREMENT,
    created_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    title          VARCHAR(255)   NOT NULL,
    description    TEXT,
    time_spent     DECIMAL(10,2),
    agreed_price   DECIMAL(10,2),

    assignee_id    BIGINT,
    customer_id    BIGINT,
    contact_id     BIGINT,
    status_id      BIGINT         NOT NULL,
    priority_id    BIGINT         NOT NULL,

    CONSTRAINT fk_errands_assignee
        FOREIGN KEY (assignee_id) REFERENCES assignees(assignee_id),

    CONSTRAINT fk_errands_customer
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id),

    CONSTRAINT fk_errands_contact
        FOREIGN KEY (contact_id) REFERENCES contacts(contact_id),

    CONSTRAINT fk_errands_status
        FOREIGN KEY (status_id) REFERENCES statuses(status_id),

    CONSTRAINT fk_errands_priority
        FOREIGN KEY (priority_id) REFERENCES priorities(priority_id)
);

CREATE TABLE errand_history
(
    history_id     BIGINT PRIMARY KEY AUTO_INCREMENT,
    errand_id      BIGINT       NOT NULL,
    created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description    VARCHAR(500) NOT NULL,
    verified_name  VARCHAR(100) NOT NULL,

    CONSTRAINT fk_history_errand
        FOREIGN KEY (errand_id) REFERENCES errands(errand_id)
);

CREATE INDEX idx_contacts_customer
    ON contacts(customer_id);

CREATE INDEX idx_errands_customer
    ON errands(customer_id);

CREATE INDEX idx_errands_contact
    ON errands(contact_id);

CREATE INDEX idx_errands_assignee
    ON errands(assignee_id);

CREATE INDEX idx_errands_status
    ON errands(status_id);

CREATE INDEX idx_errands_priority
    ON errands(priority_id);

CREATE INDEX idx_history_errand_created
    ON errand_history(errand_id, created_at);