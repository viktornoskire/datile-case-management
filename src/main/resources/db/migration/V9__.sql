CREATE TABLE attachment
(
    id           BIGINT AUTO_INCREMENT NOT NULL,
    errand_id    BIGINT NULL,
    file_name    VARCHAR(255) NULL,
    file_path    VARCHAR(255) NULL,
    content_type VARCHAR(255) NULL,
    created_at   datetime NULL,
    CONSTRAINT pk_attachment PRIMARY KEY (id)
);

ALTER TABLE attachment
    ADD CONSTRAINT FK_ATTACHMENT_ON_ERRAND FOREIGN KEY (errand_id) REFERENCES errands (errand_id);