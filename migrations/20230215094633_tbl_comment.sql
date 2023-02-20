-- migrate:up
CREATE TABLE IF NOT EXISTS tbl_comment (
    comment_id serial PRIMARY KEY,
    customer_id int NOT NULL,
    post_id int NOT NULL,
    comment varchar(200) NOT NULL,
    date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status boolean NOT NULL DEFAULT true,
    FOREIGN KEY (customer_id) REFERENCES tbl_customer(customer_id),
    FOREIGN KEY (post_id) REFERENCES tbl_post(post_id)
);


-- migrate:down
DROP TABLE tbl_comment;
