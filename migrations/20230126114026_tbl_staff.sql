-- migrate:up
CREATE TABLE IF NOT EXISTS tbl_staff (
    staff_id serial PRIMARY KEY,
    email varchar(50) NOT NULL,
    staff_fname varchar(15) NOT NULL,
    staff_lname varchar(15) NOT NULL,
    staff_house_name varchar(20) NOT NULL,
    staff_street varchar(20) NOT NULL,
    staff_city varchar(20) NOT NULL,
    staff_state varchar(20) NOT NULL,
    staff_country varchar(7) NOT NULL,
    staff_pincode varchar(7) NOT NULL,
    staff_phone varchar(10) NOT NULL,
    staff_salary int NOT NULL,
    date_added TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (email) REFERENCES tbl_login(email)
);


-- migrate:down
DROP TABLE tbl_staff;
