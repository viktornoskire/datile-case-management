CREATE TABLE priorities
(
    priority_id BIGINT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    color       VARCHAR(20)  NOT NULL,
    is_default  BOOLEAN      NOT NULL DEFAULT FALSE
);

-- Seed priorities FIRST
INSERT INTO priorities(priority_id, name, color, is_default)
VALUES (1, 'PANIK HÖG', '#FF0000', FALSE),
       (2, 'HÖG', '#FF8800', FALSE),
       (3, 'Normal', '#3B82F6', TRUE),
       (4, 'Låg', '#29CC00', FALSE),
       (5, 'BEVAKNING', '#FFF7ED', FALSE);

-- Add column (existing errands will get default 3 which now exists)
ALTER TABLE errands
    ADD COLUMN priority_id BIGINT NOT NULL DEFAULT 3;

-- Add FK AFTER priorities exist
ALTER TABLE errands
    ADD CONSTRAINT fk_errands_priority
        FOREIGN KEY (priority_id) REFERENCES priorities(priority_id);

-- Optional: set visible priorities for the seeded errands
UPDATE errands SET priority_id = 1 WHERE errand_id = 1;
UPDATE errands SET priority_id = 2 WHERE errand_id = 2;