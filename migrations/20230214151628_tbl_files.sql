-- migrate:up
CREATE TABLE IF NOT EXISTS tbl_files (
    file_id serial PRIMARY KEY,
    post_id int NOT NULL,
    file_name varchar(50) NOT NULL,
    date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status boolean NOT NULL DEFAULT true,
    FOREIGN KEY (post_id) REFERENCES tbl_post(post_id)
);


-- migrate:down
DROP TABLE tbl_files;

