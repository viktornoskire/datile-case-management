CREATE TABLE errand_history
(
    history_id    BIGINT PRIMARY KEY AUTO_INCREMENT,
    errand_id     BIGINT       NOT NULL,
    description   VARCHAR(500) NOT NULL,
    verified_name VARCHAR(100) NOT NULL,
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_errand FOREIGN KEY (errand_id) REFERENCES errands (errand_id)
);

CREATE INDEX idx_history_errand_created ON errand_history (errand_id, created_at);

INSERT INTO errand_history(errand_id, description, verified_name, created_at)
VALUES (1, 'Jag installerade anti-virus', 'Jimmy', UTC_TIMESTAMP()),
       (1, 'Jag beställde en dator', 'Leo', UTC_TIMESTAMP()),
       (2, 'Felsökte brandvägg', 'Niklas', UTC_TIMESTAMP());