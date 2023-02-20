-- migrate:up
CREATE TABLE IF NOT EXISTS tbl_customer (
    customer_id serial PRIMARY KEY,
    email varchar(50) NOT NULL,
    customer_fname varchar(15) NOT NULL,
    customer_lname varchar(15) NOT NULL,
    customer_profession varchar(20) NOT NULL,
    customer_education varchar(20) NOT NULL,
    customer_phone varchar(10) NOT NULL,
    date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (email) REFERENCES tbl_login(email)
);


-- migrate:down
DROP TABLE tbl_customer;
