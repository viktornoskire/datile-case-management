CREATE TABLE purchases
(
    purchase_id   BIGINT PRIMARY KEY AUTO_INCREMENT,
    errand_id     BIGINT         NOT NULL,
    created_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    purchase      VARCHAR(255)   NOT NULL,
    price         DECIMAL(10,2)  NOT NULL,
    shipping      DECIMAL(10,2),
    outgoing      DECIMAL(10,2),
    comment       VARCHAR(500),

    CONSTRAINT fk_purchases_errand
        FOREIGN KEY (errand_id) REFERENCES errands(errand_id)
);

CREATE INDEX idx_purchases_errand
    ON purchases(errand_id);