-- migrate:up
CREATE TABLE IF NOT EXISTS tbl_vote (
    vote_id serial PRIMARY KEY,
    customer_id int NOT NULL,
    post_id int NOT NULL,
    vote int NOT NULL,
    date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES tbl_customer(customer_id),
    FOREIGN KEY (post_id) REFERENCES tbl_post(post_id)
);


-- migrate:down
DROP TABLE tbl_vote;
