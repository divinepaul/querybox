-- migrate:up
CREATE TABLE IF NOT EXISTS tbl_topic (
    topic_id serial PRIMARY KEY,
    category_id int NOT NULL,
    topic_name varchar(30) NOT NULL,
    topic_description TEXT NOT NULL,
    date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status boolean NOT NULL DEFAULT true,
    FOREIGN KEY (category_id) REFERENCES tbl_category(category_id)
);


-- migrate:down
DROP TABLE tbl_category;
