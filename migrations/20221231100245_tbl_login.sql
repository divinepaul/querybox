-- migrate:up
CREATE TABLE IF NOT EXISTS tbl_login (
    email varchar(50) PRIMARY KEY,
    password varchar(255) NOT NULL,
    type varchar(8) NOT NULL,
    status boolean NOT NULL
);

-- migrate:down
DROP TABLE tbl_login;

