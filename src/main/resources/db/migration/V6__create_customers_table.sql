ALTER TABLE customers
    ADD COLUMN customer_number VARCHAR(100);

UPDATE customers
SET customer_number = CONCAT('CUST-', customer_id)
WHERE customer_number IS NULL;

ALTER TABLE customers
    MODIFY customer_number VARCHAR(100) NOT NULL;

ALTER TABLE customers
    ADD CONSTRAINT uk_customer_number UNIQUE (customer_number);