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

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying(255) NOT NULL
);


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
-- Name: tbl_customer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tbl_customer (
    customer_id integer NOT NULL,
    email character varying(50) NOT NULL,
    customer_fname character varying(15) NOT NULL,
    customer_lname character varying(15) NOT NULL,
    customer_house_name character varying(20) NOT NULL,
    customer_street character varying(20) NOT NULL,
    customer_city character varying(20) NOT NULL,
    customer_state character varying(20) NOT NULL,
    customer_country character varying(20) NOT NULL,
    customer_pincode character varying(7) NOT NULL,
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
-- Name: tbl_login; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tbl_login (
    email character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    type character varying(8) NOT NULL,
    status boolean NOT NULL
);


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
    staff_country character varying(20) NOT NULL,
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
-- Name: test; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.test (
    id integer NOT NULL,
    name character varying(300)
);


--
-- Name: tbl_category category_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_category ALTER COLUMN category_id SET DEFAULT nextval('public.tbl_category_category_id_seq'::regclass);


--
-- Name: tbl_customer customer_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_customer ALTER COLUMN customer_id SET DEFAULT nextval('public.tbl_customer_customer_id_seq'::regclass);


--
-- Name: tbl_staff staff_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_staff ALTER COLUMN staff_id SET DEFAULT nextval('public.tbl_staff_staff_id_seq'::regclass);


--
-- Name: tbl_topic topic_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_topic ALTER COLUMN topic_id SET DEFAULT nextval('public.tbl_topic_topic_id_seq'::regclass);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: tbl_category tbl_category_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_category
    ADD CONSTRAINT tbl_category_pkey PRIMARY KEY (category_id);


--
-- Name: tbl_customer tbl_customer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_customer
    ADD CONSTRAINT tbl_customer_pkey PRIMARY KEY (customer_id);


--
-- Name: tbl_login tbl_login_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_login
    ADD CONSTRAINT tbl_login_pkey PRIMARY KEY (email);


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
-- Name: test test_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test
    ADD CONSTRAINT test_pkey PRIMARY KEY (id);


--
-- Name: tbl_customer tbl_customer_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tbl_customer
    ADD CONSTRAINT tbl_customer_email_fkey FOREIGN KEY (email) REFERENCES public.tbl_login(email);


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
    ('20230207144356');
