-- migrate:up
CREATE TABLE IF NOT EXISTS tbl_category (
    category_id serial PRIMARY KEY,
    category_name varchar(30) NOT NULL,
    category_description TEXT NOT NULL,
    date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status boolean NOT NULL DEFAULT true
);
INSERT INTO tbl_category (
    category_id,category_name,category_description
) VALUES (1,'Other','A non specific category made so that people can post questions dont fit in any category');

-- migrate:down
DROP TABLE tbl_category;
