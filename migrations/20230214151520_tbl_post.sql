-- migrate:up
CREATE TABLE IF NOT EXISTS tbl_post (
    post_id serial PRIMARY KEY,
    customer_id int NOT NULL,
    status varchar(10) NOT NULL,
    date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES tbl_customer(customer_id)
);


-- migrate:down
DROP TABLE tbl_post;

