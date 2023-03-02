SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying(255) NOT NULL
);


--
-- Name: tbl_answer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tbl_answer (
    answer_id integer NOT NULL,
    post_id integer NOT NULL,
    question_id integer NOT NULL,
    answer_content text NOT NULL,
    accepted_answer boolean DEFAULT false NOT NULL
);


--
-- Name: tbl_answer_answer_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tbl_answer_answer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tbl_answer_answer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tbl_answer_answer_id_seq OWNED BY public.tbl_answer.answer_id;


--
-- Name: tbl_category; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tbl_category (
    category_id integer NOT NULL,
    category_name character varying(30) NOT NULL,
    category_description text NOT NULL,
    date_added timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status boolean DEFAULT true NOT NULL
);


--
-- Name: tbl_category_category_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tbl_category_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tbl_category_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tbl_category_category_id_seq OWNED BY public.tbl_category.category_id;


--
-- Name: tbl_comment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tbl_comment (
    comment_id integer NOT NULL,
    customer_id integer NOT NULL,
    post_id integer NOT NULL,
    comment character varying(200) NOT NULL,
    date_added timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status boolean DEFAULT true NOT NULL
);


--
-- Name: tbl_comment_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tbl_comment_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tbl_comment_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tbl_comment_comment_id_seq OWNED BY public.tbl_comment.comment_id;


--
-- Name: tbl_complaint; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tbl_complaint (
    complaint_id integer NOT NULL,
    post_id integer NOT NULL,
    customer_id integer NOT NULL,
    reason character varying(100) NOT NULL,
    date_added timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tbl_complaint_complaint_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tbl_complaint_complaint_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tbl_complaint_complaint_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tbl_complaint_complaint_id_seq OWNED BY public.tbl_complaint.complaint_id;


--
-- Name: tbl_customer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tbl_customer (
    customer_id integer NOT NULL,
    email character varying(50) NOT NULL,
    customer_fname character varying(15) NOT NULL,
    customer_lname character varying(15) NOT NULL,
    customer_profession character varying(20) NOT NULL,
    customer_education character varying(20) NOT NULL,
    customer_phone character varying(10) NOT NULL,
    date_added timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tbl_customer_customer_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tbl_customer_customer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tbl_customer_customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tbl_customer_customer_id_seq OWNED BY public.tbl_customer.customer_id;


--
-- Name: tbl_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tbl_files (
    file_id integer NOT NULL,
    post_id integer NOT NULL,
    file_name character varying(50) NOT NULL,
    date_added timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status boolean DEFAULT true NOT NULL
);


--
-- Name: tbl_files_file_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tbl_files_file_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tbl_files_file_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tbl_files_file_id_seq OWNED BY public.tbl_files.file_id;


--
-- Name: tbl_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tbl_history (
    history_id integer NOT NULL,
    question_id integer NOT NULL,
    customer_id integer NOT NULL,
    date_added timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tbl_history_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tbl_history_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tbl_history_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tbl_history_history_id_seq OWNED BY public.tbl_history.history_id;


--
-- Name: tbl_login; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tbl_login (
    email character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    type character varying(8) NOT NULL,
    status boolean NOT NULL
);


--
-- Name: tbl_post; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tbl_post (
    post_id integer NOT NULL,
    customer_id integer NOT NULL,
    status character varying(10) NOT NULL,
    date_added timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_modified timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tbl_post_post_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tbl_post_post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tbl_post_post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tbl_post_post_id_seq OWNED BY public.tbl_post.post_id;


--
-- Name: tbl_question; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tbl_question (
    question_id integer NOT NULL,
    post_id integer NOT NULL,
    topic_id integer NOT NULL,
    question_title character varying(100) NOT NULL,
    question_description text NOT NULL
);


--
-- Name: tbl_question_question_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tbl_question_question_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tbl_question_question_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tbl_question_question_id_seq OWNED BY public.tbl_question.question_id;


--
-- Name: tbl_staff; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tbl_staff (
    staff_id integer NOT NULL,
    email character varying(50) NOT NULL,
    staff_fname character varying(15) NOT NULL,
    staff_lname character varying(15) NOT NULL,
    staff_house_name character varying(20) NOT NULL,
    staff_street character varying(20) NOT NULL,
    staff_city character varying(20) NOT NULL,
    staff_state character varying(20) NOT NULL,
    staff_country character varying(7) NOT NULL,
    staff_pincode character varying(7) NOT NULL,
    staff_phone character varying(10) NOT NULL,
    staff_salary integer NOT NULL,
    date_added timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tbl_staff_staff_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tbl_staff_staff_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tbl_staff_staff_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tbl_staff_staff_id_seq OWNED BY public.tbl_staff.staff_id;


--
-- Name: tbl_topic; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tbl_topic (
    topic_id integer NOT NULL,
    category_id integer NOT NULL,
    topic_name character varying(30) NOT NULL,
    topic_description text NOT NULL,
    date_added timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status boolean DEFAULT true NOT NULL
);


--
-- Name: tbl_topic_topic_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tbl_topic_topic_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tbl_topic_topic_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tbl_topic_topic_id_seq OWNED BY public.tbl_topic.topic_id;


--
-- Name: tbl_vote; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tbl_vote (
    vote_id integer NOT NULL,
    customer_id integer NOT NULL,
    post_id integer NOT NULL,
    vote integer NOT NULL,
    date_added timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tbl_vote_vote_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tbl_vote_vote_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tbl_vote_vote_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tbl_vote_vote_id_seq OWNED BY public.tbl_vote.vote_id;


--
-- Name: tbl_answer answer_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_answer ALTER COLUMN answer_id SET DEFAULT nextval('public.tbl_answer_answer_id_seq'::regclass);


--
-- Name: tbl_category category_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_category ALTER COLUMN category_id SET DEFAULT nextval('public.tbl_category_category_id_seq'::regclass);


--
-- Name: tbl_comment comment_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_comment ALTER COLUMN comment_id SET DEFAULT nextval('public.tbl_comment_comment_id_seq'::regclass);


--
-- Name: tbl_complaint complaint_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_complaint ALTER COLUMN complaint_id SET DEFAULT nextval('public.tbl_complaint_complaint_id_seq'::regclass);


--
-- Name: tbl_customer customer_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_customer ALTER COLUMN customer_id SET DEFAULT nextval('public.tbl_customer_customer_id_seq'::regclass);


--
-- Name: tbl_files file_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_files ALTER COLUMN file_id SET DEFAULT nextval('public.tbl_files_file_id_seq'::regclass);


--
-- Name: tbl_history history_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_history ALTER COLUMN history_id SET DEFAULT nextval('public.tbl_history_history_id_seq'::regclass);


--
-- Name: tbl_post post_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_post ALTER COLUMN post_id SET DEFAULT nextval('public.tbl_post_post_id_seq'::regclass);


--
-- Name: tbl_question question_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_question ALTER COLUMN question_id SET DEFAULT nextval('public.tbl_question_question_id_seq'::regclass);


--
-- Name: tbl_staff staff_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_staff ALTER COLUMN staff_id SET DEFAULT nextval('public.tbl_staff_staff_id_seq'::regclass);


--
-- Name: tbl_topic topic_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_topic ALTER COLUMN topic_id SET DEFAULT nextval('public.tbl_topic_topic_id_seq'::regclass);


--
-- Name: tbl_vote vote_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_vote ALTER COLUMN vote_id SET DEFAULT nextval('public.tbl_vote_vote_id_seq'::regclass);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: tbl_answer tbl_answer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_answer
    ADD CONSTRAINT tbl_answer_pkey PRIMARY KEY (answer_id);


--
-- Name: tbl_category tbl_category_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_category
    ADD CONSTRAINT tbl_category_pkey PRIMARY KEY (category_id);


--
-- Name: tbl_comment tbl_comment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_comment
    ADD CONSTRAINT tbl_comment_pkey PRIMARY KEY (comment_id);


--
-- Name: tbl_complaint tbl_complaint_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_complaint
    ADD CONSTRAINT tbl_complaint_pkey PRIMARY KEY (complaint_id);


--
-- Name: tbl_complaint tbl_complaint_post_id_customer_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_complaint
    ADD CONSTRAINT tbl_complaint_post_id_customer_id_key UNIQUE (post_id, customer_id);


--
-- Name: tbl_customer tbl_customer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_customer
    ADD CONSTRAINT tbl_customer_pkey PRIMARY KEY (customer_id);


--
-- Name: tbl_files tbl_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_files
    ADD CONSTRAINT tbl_files_pkey PRIMARY KEY (file_id);


--
-- Name: tbl_history tbl_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_history
    ADD CONSTRAINT tbl_history_pkey PRIMARY KEY (history_id);


--
-- Name: tbl_history tbl_history_question_id_customer_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_history
    ADD CONSTRAINT tbl_history_question_id_customer_id_key UNIQUE (question_id, customer_id);


--
-- Name: tbl_login tbl_login_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_login
    ADD CONSTRAINT tbl_login_pkey PRIMARY KEY (email);


--
-- Name: tbl_post tbl_post_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_post
    ADD CONSTRAINT tbl_post_pkey PRIMARY KEY (post_id);


--
-- Name: tbl_question tbl_question_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_question
    ADD CONSTRAINT tbl_question_pkey PRIMARY KEY (question_id);


--
-- Name: tbl_staff tbl_staff_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_staff
    ADD CONSTRAINT tbl_staff_pkey PRIMARY KEY (staff_id);


--
-- Name: tbl_topic tbl_topic_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_topic
    ADD CONSTRAINT tbl_topic_pkey PRIMARY KEY (topic_id);


--
-- Name: tbl_vote tbl_vote_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_vote
    ADD CONSTRAINT tbl_vote_pkey PRIMARY KEY (vote_id);


--
-- Name: tbl_vote tbl_vote_post_id_customer_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_vote
    ADD CONSTRAINT tbl_vote_post_id_customer_id_key UNIQUE (post_id, customer_id);


--
-- Name: tbl_answer tbl_answer_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_answer
    ADD CONSTRAINT tbl_answer_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.tbl_post(post_id);


--
-- Name: tbl_answer tbl_answer_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_answer
    ADD CONSTRAINT tbl_answer_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.tbl_question(question_id);


--
-- Name: tbl_comment tbl_comment_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_comment
    ADD CONSTRAINT tbl_comment_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.tbl_customer(customer_id);


--
-- Name: tbl_comment tbl_comment_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_comment
    ADD CONSTRAINT tbl_comment_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.tbl_post(post_id);


--
-- Name: tbl_complaint tbl_complaint_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_complaint
    ADD CONSTRAINT tbl_complaint_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.tbl_customer(customer_id);


--
-- Name: tbl_complaint tbl_complaint_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_complaint
    ADD CONSTRAINT tbl_complaint_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.tbl_post(post_id);


--
-- Name: tbl_customer tbl_customer_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_customer
    ADD CONSTRAINT tbl_customer_email_fkey FOREIGN KEY (email) REFERENCES public.tbl_login(email);


--
-- Name: tbl_files tbl_files_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_files
    ADD CONSTRAINT tbl_files_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.tbl_post(post_id);


--
-- Name: tbl_history tbl_history_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_history
    ADD CONSTRAINT tbl_history_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.tbl_customer(customer_id);


--
-- Name: tbl_history tbl_history_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_history
    ADD CONSTRAINT tbl_history_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.tbl_question(question_id);


--
-- Name: tbl_post tbl_post_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_post
    ADD CONSTRAINT tbl_post_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.tbl_customer(customer_id);


--
-- Name: tbl_question tbl_question_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_question
    ADD CONSTRAINT tbl_question_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.tbl_post(post_id);


--
-- Name: tbl_question tbl_question_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_question
    ADD CONSTRAINT tbl_question_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.tbl_topic(topic_id);


--
-- Name: tbl_staff tbl_staff_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_staff
    ADD CONSTRAINT tbl_staff_email_fkey FOREIGN KEY (email) REFERENCES public.tbl_login(email);


--
-- Name: tbl_topic tbl_topic_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_topic
    ADD CONSTRAINT tbl_topic_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.tbl_category(category_id);


--
-- Name: tbl_vote tbl_vote_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_vote
    ADD CONSTRAINT tbl_vote_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.tbl_customer(customer_id);


--
-- Name: tbl_vote tbl_vote_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_vote
    ADD CONSTRAINT tbl_vote_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.tbl_post(post_id);


--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20221231100245'),
    ('20221231100408'),
    ('20230126114026'),
    ('20230207060852'),
    ('20230207070328'),
    ('20230207144356'),
    ('20230214151520'),
    ('20230214151559'),
    ('20230214151628'),
    ('20230215075635'),
    ('20230215094633'),
    ('20230215103750'),
    ('20230219200029'),
    ('20230220191549');
