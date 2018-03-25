--
-- PostgreSQL database dump
--

-- Dumped from database version 10.0
-- Dumped by pg_dump version 10.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: contractStatuses; Type: TABLE; Schema: public; Owner: sandasai
--

CREATE TABLE "contractStatuses" (
    id integer NOT NULL,
    name character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE "contractStatuses" OWNER TO sandasai;

--
-- Name: contractStatuses_id_seq; Type: SEQUENCE; Schema: public; Owner: sandasai
--

CREATE SEQUENCE "contractStatuses_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "contractStatuses_id_seq" OWNER TO sandasai;

--
-- Name: contractStatuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sandasai
--

ALTER SEQUENCE "contractStatuses_id_seq" OWNED BY "contractStatuses".id;


--
-- Name: contracts; Type: TABLE; Schema: public; Owner: sandasai
--

CREATE TABLE contracts (
    id integer NOT NULL,
    item_id integer,
    borrower_id integer,
    sharer_id integer,
    status character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    item_taken timestamp with time zone,
    item_returned timestamp with time zone
);


ALTER TABLE contracts OWNER TO sandasai;

--
-- Name: contracts_id_seq; Type: SEQUENCE; Schema: public; Owner: sandasai
--

CREATE SEQUENCE contracts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contracts_id_seq OWNER TO sandasai;

--
-- Name: contracts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sandasai
--

ALTER SEQUENCE contracts_id_seq OWNED BY contracts.id;


--
-- Name: images; Type: TABLE; Schema: public; Owner: sandasai
--

CREATE TABLE images (
    id integer NOT NULL,
    width integer,
    height integer,
    format character varying(255),
    bytes integer,
    cloudinary_public_id character varying(255),
    cloudinary_version character varying(255),
    cloudinary_url character varying(255),
    item_id integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE images OWNER TO sandasai;

--
-- Name: images_id_seq; Type: SEQUENCE; Schema: public; Owner: sandasai
--

CREATE SEQUENCE images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE images_id_seq OWNER TO sandasai;

--
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sandasai
--

ALTER SEQUENCE images_id_seq OWNED BY images.id;


--
-- Name: item_comments; Type: TABLE; Schema: public; Owner: sandasai
--

CREATE TABLE item_comments (
    id integer NOT NULL,
    user_id integer,
    item_id integer,
    content character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE item_comments OWNER TO sandasai;

--
-- Name: item_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: sandasai
--

CREATE SEQUENCE item_comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE item_comments_id_seq OWNER TO sandasai;

--
-- Name: item_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sandasai
--

ALTER SEQUENCE item_comments_id_seq OWNED BY item_comments.id;


--
-- Name: item_log_types; Type: TABLE; Schema: public; Owner: sandasai
--

CREATE TABLE item_log_types (
    id integer NOT NULL,
    name character varying(255)
);


ALTER TABLE item_log_types OWNER TO sandasai;

--
-- Name: item_log_types_id_seq; Type: SEQUENCE; Schema: public; Owner: sandasai
--

CREATE SEQUENCE item_log_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE item_log_types_id_seq OWNER TO sandasai;

--
-- Name: item_log_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sandasai
--

ALTER SEQUENCE item_log_types_id_seq OWNED BY item_log_types.id;


--
-- Name: item_logs; Type: TABLE; Schema: public; Owner: sandasai
--

CREATE TABLE item_logs (
    id integer NOT NULL,
    user_id integer,
    item_id integer,
    item_log_type character varying(255),
    dropoff_at timestamp with time zone,
    pickup_at timestamp with time zone,
    comments character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE item_logs OWNER TO sandasai;

--
-- Name: item_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: sandasai
--

CREATE SEQUENCE item_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE item_logs_id_seq OWNER TO sandasai;

--
-- Name: item_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sandasai
--

ALTER SEQUENCE item_logs_id_seq OWNED BY item_logs.id;


--
-- Name: items; Type: TABLE; Schema: public; Owner: sandasai
--

CREATE TABLE items (
    id integer NOT NULL,
    owner_id integer NOT NULL,
    holder_id integer,
    name character varying(255),
    description text,
    status character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE items OWNER TO sandasai;

--
-- Name: items_id_seq; Type: SEQUENCE; Schema: public; Owner: sandasai
--

CREATE SEQUENCE items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE items_id_seq OWNER TO sandasai;

--
-- Name: items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sandasai
--

ALTER SEQUENCE items_id_seq OWNED BY items.id;


--
-- Name: knex_migrations; Type: TABLE; Schema: public; Owner: sandasai
--

CREATE TABLE knex_migrations (
    id integer NOT NULL,
    name character varying(255),
    batch integer,
    migration_time timestamp with time zone
);


ALTER TABLE knex_migrations OWNER TO sandasai;

--
-- Name: knex_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: sandasai
--

CREATE SEQUENCE knex_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE knex_migrations_id_seq OWNER TO sandasai;

--
-- Name: knex_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sandasai
--

ALTER SEQUENCE knex_migrations_id_seq OWNED BY knex_migrations.id;


--
-- Name: knex_migrations_lock; Type: TABLE; Schema: public; Owner: sandasai
--

CREATE TABLE knex_migrations_lock (
    is_locked integer
);


ALTER TABLE knex_migrations_lock OWNER TO sandasai;

--
-- Name: likes; Type: TABLE; Schema: public; Owner: sandasai
--

CREATE TABLE likes (
    id integer NOT NULL,
    item_id integer,
    user_id integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE likes OWNER TO sandasai;

--
-- Name: likes_id_seq; Type: SEQUENCE; Schema: public; Owner: sandasai
--

CREATE SEQUENCE likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE likes_id_seq OWNER TO sandasai;

--
-- Name: likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sandasai
--

ALTER SEQUENCE likes_id_seq OWNED BY likes.id;


--
-- Name: notification_types; Type: TABLE; Schema: public; Owner: sandasai
--

CREATE TABLE notification_types (
    id integer NOT NULL,
    name character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE notification_types OWNER TO sandasai;

--
-- Name: notificationTypes_id_seq; Type: SEQUENCE; Schema: public; Owner: sandasai
--

CREATE SEQUENCE "notificationTypes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "notificationTypes_id_seq" OWNER TO sandasai;

--
-- Name: notificationTypes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sandasai
--

ALTER SEQUENCE "notificationTypes_id_seq" OWNED BY notification_types.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: sandasai
--

CREATE TABLE notifications (
    id integer NOT NULL,
    to_user_id integer NOT NULL,
    from_user_id integer,
    notification_type character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    status character varying(255),
    associated_request integer,
    associated_item integer,
    associated_item_log integer,
    associated_item_comment integer
);


ALTER TABLE notifications OWNER TO sandasai;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: sandasai
--

CREATE SEQUENCE notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE notifications_id_seq OWNER TO sandasai;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sandasai
--

ALTER SEQUENCE notifications_id_seq OWNED BY notifications.id;


--
-- Name: requests; Type: TABLE; Schema: public; Owner: sandasai
--

CREATE TABLE requests (
    id integer NOT NULL,
    user_id integer NOT NULL,
    item character varying(255),
    description text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    status character varying(255),
    item_id integer
);


ALTER TABLE requests OWNER TO sandasai;

--
-- Name: requests_id_seq; Type: SEQUENCE; Schema: public; Owner: sandasai
--

CREATE SEQUENCE requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE requests_id_seq OWNER TO sandasai;

--
-- Name: requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sandasai
--

ALTER SEQUENCE requests_id_seq OWNED BY requests.id;


--
-- Name: tagGroups; Type: TABLE; Schema: public; Owner: sandasai
--

CREATE TABLE "tagGroups" (
    id integer NOT NULL,
    name character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE "tagGroups" OWNER TO sandasai;

--
-- Name: tagGroups_id_seq; Type: SEQUENCE; Schema: public; Owner: sandasai
--

CREATE SEQUENCE "tagGroups_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "tagGroups_id_seq" OWNER TO sandasai;

--
-- Name: tagGroups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sandasai
--

ALTER SEQUENCE "tagGroups_id_seq" OWNED BY "tagGroups".id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: sandasai
--

CREATE TABLE tags (
    id integer NOT NULL,
    "tagGroup_id" integer NOT NULL,
    item_id integer NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE tags OWNER TO sandasai;

--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: sandasai
--

CREATE SEQUENCE tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tags_id_seq OWNER TO sandasai;

--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sandasai
--

ALTER SEQUENCE tags_id_seq OWNED BY tags.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: sandasai
--

CREATE TABLE users (
    id integer NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE users OWNER TO sandasai;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: sandasai
--

CREATE SEQUENCE users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO sandasai;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sandasai
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: contractStatuses id; Type: DEFAULT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY "contractStatuses" ALTER COLUMN id SET DEFAULT nextval('"contractStatuses_id_seq"'::regclass);


--
-- Name: contracts id; Type: DEFAULT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY contracts ALTER COLUMN id SET DEFAULT nextval('contracts_id_seq'::regclass);


--
-- Name: images id; Type: DEFAULT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY images ALTER COLUMN id SET DEFAULT nextval('images_id_seq'::regclass);


--
-- Name: item_comments id; Type: DEFAULT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY item_comments ALTER COLUMN id SET DEFAULT nextval('item_comments_id_seq'::regclass);


--
-- Name: item_log_types id; Type: DEFAULT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY item_log_types ALTER COLUMN id SET DEFAULT nextval('item_log_types_id_seq'::regclass);


--
-- Name: item_logs id; Type: DEFAULT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY item_logs ALTER COLUMN id SET DEFAULT nextval('item_logs_id_seq'::regclass);


--
-- Name: items id; Type: DEFAULT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY items ALTER COLUMN id SET DEFAULT nextval('items_id_seq'::regclass);


--
-- Name: knex_migrations id; Type: DEFAULT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY knex_migrations ALTER COLUMN id SET DEFAULT nextval('knex_migrations_id_seq'::regclass);


--
-- Name: likes id; Type: DEFAULT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY likes ALTER COLUMN id SET DEFAULT nextval('likes_id_seq'::regclass);


--
-- Name: notification_types id; Type: DEFAULT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY notification_types ALTER COLUMN id SET DEFAULT nextval('"notificationTypes_id_seq"'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY notifications ALTER COLUMN id SET DEFAULT nextval('notifications_id_seq'::regclass);


--
-- Name: requests id; Type: DEFAULT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY requests ALTER COLUMN id SET DEFAULT nextval('requests_id_seq'::regclass);


--
-- Name: tagGroups id; Type: DEFAULT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY "tagGroups" ALTER COLUMN id SET DEFAULT nextval('"tagGroups_id_seq"'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY tags ALTER COLUMN id SET DEFAULT nextval('tags_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Name: contractStatuses contractStatuses_pkey; Type: CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY "contractStatuses"
    ADD CONSTRAINT "contractStatuses_pkey" PRIMARY KEY (id);


--
-- Name: contracts contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY contracts
    ADD CONSTRAINT contracts_pkey PRIMARY KEY (id);


--
-- Name: contractStatuses contractstatuses_name_unique; Type: CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY "contractStatuses"
    ADD CONSTRAINT contractstatuses_name_unique UNIQUE (name);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: item_comments item_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY item_comments
    ADD CONSTRAINT item_comments_pkey PRIMARY KEY (id);


--
-- Name: item_log_types item_log_types_name_unique; Type: CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY item_log_types
    ADD CONSTRAINT item_log_types_name_unique UNIQUE (name);


--
-- Name: item_log_types item_log_types_pkey; Type: CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY item_log_types
    ADD CONSTRAINT item_log_types_pkey PRIMARY KEY (id);


--
-- Name: item_logs item_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY item_logs
    ADD CONSTRAINT item_logs_pkey PRIMARY KEY (id);


--
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- Name: knex_migrations knex_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY knex_migrations
    ADD CONSTRAINT knex_migrations_pkey PRIMARY KEY (id);


--
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


--
-- Name: notification_types notificationTypes_pkey; Type: CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY notification_types
    ADD CONSTRAINT "notificationTypes_pkey" PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: notification_types notificationtypes_name_unique; Type: CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY notification_types
    ADD CONSTRAINT notificationtypes_name_unique UNIQUE (name);


--
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);


--
-- Name: tagGroups tagGroups_pkey; Type: CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY "tagGroups"
    ADD CONSTRAINT "tagGroups_pkey" PRIMARY KEY (id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: contracts contracts_fk0; Type: FK CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY contracts
    ADD CONSTRAINT contracts_fk0 FOREIGN KEY (status) REFERENCES "contractStatuses"(name);


--
-- Name: contracts contracts_fk1; Type: FK CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY contracts
    ADD CONSTRAINT contracts_fk1 FOREIGN KEY (borrower_id) REFERENCES users(id);


--
-- Name: contracts contracts_fk2; Type: FK CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY contracts
    ADD CONSTRAINT contracts_fk2 FOREIGN KEY (sharer_id) REFERENCES users(id);


--
-- Name: contracts contracts_fk3; Type: FK CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY contracts
    ADD CONSTRAINT contracts_fk3 FOREIGN KEY (item_id) REFERENCES items(id);


--
-- Name: images images_fk0; Type: FK CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY images
    ADD CONSTRAINT images_fk0 FOREIGN KEY (item_id) REFERENCES items(id);


--
-- Name: item_comments item_comments_fk0; Type: FK CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY item_comments
    ADD CONSTRAINT item_comments_fk0 FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: item_comments item_comments_fk1; Type: FK CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY item_comments
    ADD CONSTRAINT item_comments_fk1 FOREIGN KEY (item_id) REFERENCES items(id);


--
-- Name: item_logs item_logs_fk0; Type: FK CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY item_logs
    ADD CONSTRAINT item_logs_fk0 FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: item_logs item_logs_fk1; Type: FK CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY item_logs
    ADD CONSTRAINT item_logs_fk1 FOREIGN KEY (item_id) REFERENCES items(id);


--
-- Name: item_logs item_logs_fk2; Type: FK CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY item_logs
    ADD CONSTRAINT item_logs_fk2 FOREIGN KEY (item_log_type) REFERENCES item_log_types(name);


--
-- Name: items items_fk0; Type: FK CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY items
    ADD CONSTRAINT items_fk0 FOREIGN KEY (owner_id) REFERENCES users(id);


--
-- Name: items items_fk1; Type: FK CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY items
    ADD CONSTRAINT items_fk1 FOREIGN KEY (holder_id) REFERENCES users(id);


--
-- Name: likes likes_fk0; Type: FK CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY likes
    ADD CONSTRAINT likes_fk0 FOREIGN KEY (item_id) REFERENCES items(id);


--
-- Name: likes likes_fk1; Type: FK CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY likes
    ADD CONSTRAINT likes_fk1 FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: notifications notifications_fk0; Type: FK CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notifications_fk0 FOREIGN KEY (to_user_id) REFERENCES users(id);


--
-- Name: notifications notifications_fk1; Type: FK CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notifications_fk1 FOREIGN KEY (from_user_id) REFERENCES users(id);


--
-- Name: notifications notifications_fk2; Type: FK CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notifications_fk2 FOREIGN KEY (notification_type) REFERENCES notification_types(name);


--
-- Name: notifications notifications_fk3; Type: FK CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notifications_fk3 FOREIGN KEY (associated_item_log) REFERENCES item_logs(id) ON DELETE SET NULL;


--
-- Name: notifications notifications_fk4; Type: FK CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notifications_fk4 FOREIGN KEY (associated_request) REFERENCES requests(id) ON DELETE SET NULL;


--
-- Name: notifications notifications_fk5; Type: FK CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notifications_fk5 FOREIGN KEY (associated_item) REFERENCES items(id) ON DELETE SET NULL;


--
-- Name: notifications notifications_fk6; Type: FK CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notifications_fk6 FOREIGN KEY (associated_item_comment) REFERENCES item_comments(id) ON DELETE SET NULL;


--
-- Name: requests requests_fk0; Type: FK CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY requests
    ADD CONSTRAINT requests_fk0 FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: tags tags_fk0; Type: FK CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY tags
    ADD CONSTRAINT tags_fk0 FOREIGN KEY ("tagGroup_id") REFERENCES "tagGroups"(id);


--
-- Name: tags tags_fk1; Type: FK CONSTRAINT; Schema: public; Owner: sandasai
--

ALTER TABLE ONLY tags
    ADD CONSTRAINT tags_fk1 FOREIGN KEY (item_id) REFERENCES items(id);


--
-- PostgreSQL database dump complete
--

