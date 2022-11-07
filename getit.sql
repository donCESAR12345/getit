--
-- PostgreSQL database dump
--

-- Dumped from database version 14.3
-- Dumped by pg_dump version 14.3

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

DROP DATABASE getit;
--
-- Name: getit; Type: DATABASE; Schema: -; Owner: cesar
--

CREATE DATABASE getit WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C.UTF-8';


ALTER DATABASE getit OWNER TO cesar;

\connect getit

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
-- Name: users; Type: TABLE; Schema: public; Owner: cesar
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    email character varying(64) NOT NULL,
    password character varying(64) NOT NULL,
    is_admin boolean NOT NULL,
    first_name character varying(64) NOT NULL,
    last_name character varying(64) NOT NULL,
    country character varying(3) NOT NULL,
    birthdate date NOT NULL
);


ALTER TABLE public.users OWNER TO cesar;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: cesar
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO cesar;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cesar
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: cesar
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: cesar
--

INSERT INTO public.users VALUES (1, 'cesara.montoya1@udea.edu.co', 'desarrolloweb', true, 'César', 'Montoya', 'CO', '1998-10-15');


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cesar
--

SELECT pg_catalog.setval('public.users_user_id_seq', 1, true);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: cesar
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: cesar
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- PostgreSQL database dump complete
--

