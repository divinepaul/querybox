-- migrate:up
CREATE TABLE IF NOT EXISTS tbl_answer (
    answer_id serial PRIMARY KEY,
    post_id int NOT NULL,
    question_id int NOT NULL,
    answer_content text NOT NULL,
    accepted_answer boolean NOT NULL DEFAULT false,
    FOREIGN KEY (post_id) REFERENCES tbl_post(post_id),
    FOREIGN KEY (question_id) REFERENCES tbl_question(question_id)
);


-- migrate:down
DROP TABLE tbl_answer;
