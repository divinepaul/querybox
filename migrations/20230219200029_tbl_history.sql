-- migrate:up
CREATE TABLE IF NOT EXISTS tbl_history (
    history_id serial PRIMARY KEY,
    question_id int NOT NULL,
    customer_id int NOT NULL,
    date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES tbl_customer(customer_id),
    FOREIGN KEY (question_id) REFERENCES tbl_question(question_id),
    UNIQUE (question_id, customer_id)
);


-- migrate:down
DROP TABLE tbl_history;
