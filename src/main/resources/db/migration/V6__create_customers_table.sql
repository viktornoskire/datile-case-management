CREATE TABLE customers (
                           customer_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                           name VARCHAR(255) NOT NULL,
                           customer_number VARCHAR(100) NOT NULL UNIQUE,
                           is_active BOOLEAN NOT NULL DEFAULT TRUE
);