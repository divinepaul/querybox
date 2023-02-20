-- migrate:up
CREATE TABLE IF NOT EXISTS tbl_question (
    question_id serial PRIMARY KEY,
    post_id int NOT NULL,
    topic_id int NOT NULL,
    question_title varchar(100) NOT NULL,
    question_description text NOT NULL,
    FOREIGN KEY (post_id) REFERENCES tbl_post(post_id),
    FOREIGN KEY (topic_id) REFERENCES tbl_topic(topic_id)
);


-- migrate:down
DROP TABLE tbl_question;
