ALTER TABLE errands
    ADD COLUMN assignee_id BIGINT NULL,
    ADD COLUMN customer_id BIGINT NULL,
    ADD COLUMN contact_id BIGINT NULL,
    ADD COLUMN time_spent DOUBLE NULL,
    ADD COLUMN agreed_price DECIMAL(10,2) NULL;