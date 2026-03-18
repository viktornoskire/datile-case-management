CREATE TABLE user
(
    id       BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY ,
    name VARCHAR(255) NULL,
    email VARCHAR(255) NULL,
    password VARCHAR(255) NULL,
    role     VARCHAR(255) NULL
);

INSERT INTO user(name, email, password, role)
VALUES ("jimmy", 'jimmy@gmail.com', '$2a$10$OWtxLEAOiGedqi0n7sFBq.oKTr3LWPlDcrCgnTrEuWWZGuWpocYKW', 'ADMIN'),
       ("niklas", 'niklas@gmail.com', '$2a$10$OWtxLEAOiGedqi0n7sFBq.oKTr3LWPlDcrCgnTrEuWWZGuWpocYKW', 'ADMIN'),
       ("leo", 'leo@gmail.com', '$2a$10$OWtxLEAOiGedqi0n7sFBq.oKTr3LWPlDcrCgnTrEuWWZGuWpocYKW', 'ADMIN'),
       ("ronja", 'ronja@gmail.com', '$2a$10$OWtxLEAOiGedqi0n7sFBq.oKTr3LWPlDcrCgnTrEuWWZGuWpocYKW', 'USER'),
       ("viktor", 'viktor@gmail.com', '$2a$10$OWtxLEAOiGedqi0n7sFBq.oKTr3LWPlDcrCgnTrEuWWZGuWpocYKW', 'USER');