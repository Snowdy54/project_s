--
-- PostgreSQL database dump
--

\restrict BZQugsswsZlD5SoBvGBhbZPvT2oJAAoW7Zh1g40AU0vCXRoSRJNpHuJgUgV75rD

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- Name: achievements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.achievements (
    id bigint NOT NULL,
    code character varying(64) NOT NULL,
    title character varying(150) NOT NULL,
    description text NOT NULL,
    icon character varying(100) NOT NULL,
    points integer NOT NULL,
    type character varying(20) NOT NULL,
    CONSTRAINT achievements_type_check CHECK (((type)::text = ANY ((ARRAY['unique'::character varying, 'repeatable'::character varying])::text[])))
);


--
-- Name: achievements_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.achievements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: achievements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.achievements_id_seq OWNED BY public.achievements.id;


--
-- Name: gap_question_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gap_question_tags (
    question_id bigint NOT NULL,
    tag_id bigint NOT NULL
);


--
-- Name: gap_questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gap_questions (
    id bigint NOT NULL,
    roadmap_id bigint NOT NULL,
    question_text text NOT NULL,
    order_num integer DEFAULT 1 NOT NULL
);


--
-- Name: gap_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.gap_questions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: gap_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.gap_questions_id_seq OWNED BY public.gap_questions.id;


--
-- Name: hh_key_skills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hh_key_skills (
    id bigint NOT NULL,
    roadmap_id bigint NOT NULL,
    skill_name character varying(150) NOT NULL,
    frequency integer DEFAULT 1 NOT NULL
);


--
-- Name: hh_key_skills_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hh_key_skills_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hh_key_skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hh_key_skills_id_seq OWNED BY public.hh_key_skills.id;


--
-- Name: roadmap_relations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roadmap_relations (
    roadmap_id bigint NOT NULL,
    related_roadmap_id bigint NOT NULL,
    relation_type character varying(20) DEFAULT 'related'::character varying NOT NULL,
    CONSTRAINT roadmap_relations_relation_type_check CHECK (((relation_type)::text = ANY ((ARRAY['related'::character varying, 'next_step'::character varying])::text[])))
);


--
-- Name: roadmap_tag_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roadmap_tag_links (
    roadmap_id bigint NOT NULL,
    tag_id bigint NOT NULL
);


--
-- Name: roadmap_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roadmap_tags (
    id bigint NOT NULL,
    name character varying(100) NOT NULL,
    category character varying(30) NOT NULL,
    CONSTRAINT roadmap_tags_category_check CHECK (((category)::text = ANY ((ARRAY['language'::character varying, 'direction'::character varying, 'basics'::character varying])::text[])))
);


--
-- Name: roadmap_tags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roadmap_tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roadmap_tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roadmap_tags_id_seq OWNED BY public.roadmap_tags.id;


--
-- Name: roadmaps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roadmaps (
    id bigint NOT NULL,
    title character varying(255) NOT NULL,
    short_description text DEFAULT ''::text NOT NULL,
    required_skills_desc text DEFAULT ''::text NOT NULL,
    typical_tasks_desc text DEFAULT ''::text NOT NULL,
    ai_impact_notes text DEFAULT ''::text NOT NULL,
    practice_base_url character varying(500) DEFAULT ''::character varying NOT NULL,
    hh_search_query character varying(255) DEFAULT ''::character varying NOT NULL,
    hh_last_error text,
    hh_retry_count integer DEFAULT 0 NOT NULL,
    hh_updated_at timestamp with time zone
);


--
-- Name: roadmaps_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roadmaps_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roadmaps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roadmaps_id_seq OWNED BY public.roadmaps.id;


--
-- Name: skill_tag_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.skill_tag_links (
    skill_id bigint NOT NULL,
    tag_id bigint NOT NULL
);


--
-- Name: skill_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.skill_tags (
    id bigint NOT NULL,
    name character varying(100) NOT NULL
);


--
-- Name: skill_tags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.skill_tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: skill_tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.skill_tags_id_seq OWNED BY public.skill_tags.id;


--
-- Name: skills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.skills (
    id bigint NOT NULL,
    roadmap_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    difficulty character varying(20) DEFAULT 'beginner'::character varying NOT NULL,
    pos_x integer DEFAULT 0 NOT NULL,
    pos_y integer DEFAULT 0 NOT NULL,
    CONSTRAINT skills_difficulty_check CHECK (((difficulty)::text = ANY ((ARRAY['beginner'::character varying, 'advanced'::character varying, 'deep'::character varying])::text[])))
);


--
-- Name: skills_dependencies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.skills_dependencies (
    skill_id bigint NOT NULL,
    depends_on_skill_id bigint NOT NULL
);


--
-- Name: skills_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.skills_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.skills_id_seq OWNED BY public.skills.id;


--
-- Name: user_achievements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_achievements (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    achievement_id bigint NOT NULL,
    source_key character varying(100) DEFAULT 'global'::character varying NOT NULL,
    awarded_at timestamp with time zone DEFAULT now()
);


--
-- Name: user_achievements_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_achievements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_achievements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_achievements_id_seq OWNED BY public.user_achievements.id;


--
-- Name: user_favorite_roadmaps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_favorite_roadmaps (
    user_id bigint NOT NULL,
    roadmap_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    nickname character varying(100) NOT NULL,
    email character varying(255),
    phone character varying(30),
    password_hash character varying(255) NOT NULL,
    github_url character varying(255) DEFAULT ''::character varying,
    vk_url character varying(255) DEFAULT ''::character varying,
    telegram_url character varying(255) DEFAULT ''::character varying,
    website_url character varying(255) DEFAULT ''::character varying,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT chk_user_contact CHECK (((email IS NOT NULL) OR (phone IS NOT NULL)))
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users_skill_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_skill_progress (
    user_id bigint,
    skill_id bigint,
    status character varying(20) DEFAULT 'not_started'::character varying NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT users_skill_progress_status_check CHECK (((status)::text = ANY ((ARRAY['not_started'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'skipped'::character varying])::text[])))
);


--
-- Name: achievements id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievements ALTER COLUMN id SET DEFAULT nextval('public.achievements_id_seq'::regclass);


--
-- Name: gap_questions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gap_questions ALTER COLUMN id SET DEFAULT nextval('public.gap_questions_id_seq'::regclass);


--
-- Name: hh_key_skills id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hh_key_skills ALTER COLUMN id SET DEFAULT nextval('public.hh_key_skills_id_seq'::regclass);


--
-- Name: roadmap_tags id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roadmap_tags ALTER COLUMN id SET DEFAULT nextval('public.roadmap_tags_id_seq'::regclass);


--
-- Name: roadmaps id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roadmaps ALTER COLUMN id SET DEFAULT nextval('public.roadmaps_id_seq'::regclass);


--
-- Name: skill_tags id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_tags ALTER COLUMN id SET DEFAULT nextval('public.skill_tags_id_seq'::regclass);


--
-- Name: skills id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skills ALTER COLUMN id SET DEFAULT nextval('public.skills_id_seq'::regclass);


--
-- Name: user_achievements id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements ALTER COLUMN id SET DEFAULT nextval('public.user_achievements_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.achievements (id, code, title, description, icon, points, type) FROM stdin;
1	first_peak	Первая вершина	Завершить первую интерактивную карту (любого уровня сложности)	trophy	50	unique
2	fullstack	Fullstack	Завершить карты Backend и Frontend направления	layers	200	unique
3	jack_of_all_trades	Мастер на все руки	Завершить карты Backend, Frontend и DevOps направления	crown	300	unique
4	junior_backend	Начинающий Backend-разработчик	Завершить карту Backend направления	server	100	unique
5	junior_frontend	Начинающий Frontend-разработчик	Завершить карту Frontend направления	layout	100	unique
6	junior_devops	Начинающий DevOps-инженер	Завершить карту DevOps направления	cloud	100	unique
7	tip_of_iceberg	Середина айсберга	Завершить 50% прогресса на любой карте впервые	mountain	25	unique
8	i_need_this	Это мне надо	Добавить любую карту в избранное впервые	bookmark	25	unique
9	practitioner	Практик	Зайти на страницу базы практик впервые	code	25	unique
10	journey_start	Начало пути	Изменить статус первого узла в новой карте	flag	5	repeatable
11	halfway_there	Половина пути	Достичь 50% прогресса в любой карте	compass	15	repeatable
12	mastered_skill	Закреплённый навык	Завершить любую карту на 100%	check_circle	25	repeatable
\.


--
-- Data for Name: gap_question_tags; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.gap_question_tags (question_id, tag_id) FROM stdin;
1	1
2	2
3	3
4	4
5	5
\.


--
-- Data for Name: gap_questions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.gap_questions (id, roadmap_id, question_text, order_num) FROM stdin;
1	1	Уверенно ли вы понимаете базовые алгоритмы, структуры данных и работу памяти?	1
2	1	Знаете ли вы основы реляционных БД, нормализацию и транзакции ACID?	2
3	1	Умеете ли вы работать с индексами, планами запросов EXPLAIN и UPSERT в PostgreSQL?	3
4	1	Умеете ли вы писать Dockerfile и поднимать сервисы через docker-compose?	4
5	1	Есть ли у вас опыт разработки микросервисов на gRPC и Protobuf?	5
\.


--
-- Data for Name: hh_key_skills; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hh_key_skills (id, roadmap_id, skill_name, frequency) FROM stdin;
1	1	Go	28
2	1	PostgreSQL	24
3	1	Docker	22
4	1	Git	19
5	1	gRPC	16
6	1	Микросервисы	15
7	2	TypeScript	27
8	2	React	26
9	2	JavaScript	25
10	2	HTML5	18
11	2	CSS3	18
12	2	Git	17
\.


--
-- Data for Name: roadmap_relations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roadmap_relations (roadmap_id, related_roadmap_id, relation_type) FROM stdin;
1	2	related
2	1	related
\.


--
-- Data for Name: roadmap_tag_links; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roadmap_tag_links (roadmap_id, tag_id) FROM stdin;
1	1
1	3
1	5
2	2
2	4
\.


--
-- Data for Name: roadmap_tags; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roadmap_tags (id, name, category) FROM stdin;
1	Go	language
2	TypeScript	language
3	Backend	direction
4	Frontend	direction
5	Docker	basics
6	DevOps	direction
\.


--
-- Data for Name: roadmaps; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roadmaps (id, title, short_description, required_skills_desc, typical_tasks_desc, ai_impact_notes, practice_base_url, hh_search_query, hh_last_error, hh_retry_count, hh_updated_at) FROM stdin;
1	Backend-разработчик (Go)	Разработка серверной логики и высоконагруженных API на Go.	Go, SQL, Docker, понимание сетей и архитектуры.	Проектирование API, работа с БД, оптимизация запросов.	ИИ ускоряет написание бойлерплейта и тестов, но архитектура остаётся за инженером.	/practice/backend	Go разработчик	Не удалось получить ответ от hh.ru	3	2026-11-23 21:16:47.750662+05
2	Frontend-разработчик	Создание современных веб-интерфейсов на React и TypeScript.	HTML, CSS, TypeScript, React, работа с REST API.	Вёрстка компонентов, управление состоянием, интеграция с бэкендом.	ИИ хорошо генерирует типовую вёрстку, фокус смещается на UX и сложную логику.	/practice/frontend	Frontend разработчик	Не удалось получить ответ от hh.ru	3	2026-11-23 21:16:47.897307+05
\.


--
-- Data for Name: skill_tag_links; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.skill_tag_links (skill_id, tag_id) FROM stdin;
10	1
20	2
30	2
30	3
40	4
50	5
\.


--
-- Data for Name: skill_tags; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.skill_tags (id, name) FROM stdin;
1	CS
2	SQL
3	PostgreSQL
4	Docker
5	gRPC
\.


--
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.skills (id, roadmap_id, name, description, difficulty, pos_x, pos_y) FROM stdin;
10	1	Основы Computer Science	Алгоритмы, структуры данных, работа памяти.	beginner	100	100
20	1	Основы баз данных	Реляционная модель, нормализация, транзакции ACID.	beginner	400	100
30	1	PostgreSQL	Индексы, планы запросов EXPLAIN, UPSERT.	advanced	700	100
40	1	Docker и контейнеризация	Dockerfile, docker-compose, сети и тома.	advanced	400	280
50	1	gRPC и микросервисы	Protobuf, стриминг, отказоустойчивость.	deep	700	280
\.


--
-- Data for Name: skills_dependencies; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.skills_dependencies (skill_id, depends_on_skill_id) FROM stdin;
20	10
30	20
50	30
50	40
\.


--
-- Name: achievements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.achievements_id_seq', 12, true);


--
-- Name: gap_questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.gap_questions_id_seq', 5, true);


--
-- Name: hh_key_skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.hh_key_skills_id_seq', 12, true);


--
-- Name: roadmap_tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roadmap_tags_id_seq', 6, true);


--
-- Name: roadmaps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roadmaps_id_seq', 2, true);


--
-- Name: skill_tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.skill_tags_id_seq', 5, true);


--
-- Name: skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.skills_id_seq', 50, true);


--
-- Name: user_achievements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_achievements_id_seq', 41, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: achievements achievements_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_code_key UNIQUE (code);


--
-- Name: achievements achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);


--
-- Name: gap_question_tags gap_question_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gap_question_tags
    ADD CONSTRAINT gap_question_tags_pkey PRIMARY KEY (question_id, tag_id);


--
-- Name: gap_questions gap_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gap_questions
    ADD CONSTRAINT gap_questions_pkey PRIMARY KEY (id);


--
-- Name: hh_key_skills hh_key_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hh_key_skills
    ADD CONSTRAINT hh_key_skills_pkey PRIMARY KEY (id);


--
-- Name: hh_key_skills hh_key_skills_roadmap_id_skill_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hh_key_skills
    ADD CONSTRAINT hh_key_skills_roadmap_id_skill_name_key UNIQUE (roadmap_id, skill_name);


--
-- Name: roadmap_relations roadmap_relations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roadmap_relations
    ADD CONSTRAINT roadmap_relations_pkey PRIMARY KEY (roadmap_id, related_roadmap_id, relation_type);


--
-- Name: roadmap_tag_links roadmap_tag_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roadmap_tag_links
    ADD CONSTRAINT roadmap_tag_links_pkey PRIMARY KEY (roadmap_id, tag_id);


--
-- Name: roadmap_tags roadmap_tags_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roadmap_tags
    ADD CONSTRAINT roadmap_tags_name_key UNIQUE (name);


--
-- Name: roadmap_tags roadmap_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roadmap_tags
    ADD CONSTRAINT roadmap_tags_pkey PRIMARY KEY (id);


--
-- Name: roadmaps roadmaps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roadmaps
    ADD CONSTRAINT roadmaps_pkey PRIMARY KEY (id);


--
-- Name: skill_tag_links skill_tag_links_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_tag_links
    ADD CONSTRAINT skill_tag_links_pkey PRIMARY KEY (skill_id, tag_id);


--
-- Name: skill_tags skill_tags_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_tags
    ADD CONSTRAINT skill_tags_name_key UNIQUE (name);


--
-- Name: skill_tags skill_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_tags
    ADD CONSTRAINT skill_tags_pkey PRIMARY KEY (id);


--
-- Name: skills_dependencies skills_dependencies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skills_dependencies
    ADD CONSTRAINT skills_dependencies_pkey PRIMARY KEY (skill_id, depends_on_skill_id);


--
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);


--
-- Name: user_achievements unique_user_achievement_source; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT unique_user_achievement_source UNIQUE (user_id, achievement_id, source_key);


--
-- Name: users_skill_progress unique_user_skill; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_skill_progress
    ADD CONSTRAINT unique_user_skill UNIQUE (user_id, skill_id);


--
-- Name: user_achievements user_achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_pkey PRIMARY KEY (id);


--
-- Name: user_favorite_roadmaps user_favorite_roadmaps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_favorite_roadmaps
    ADD CONSTRAINT user_favorite_roadmaps_pkey PRIMARY KEY (user_id, roadmap_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: gap_question_tags gap_question_tags_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gap_question_tags
    ADD CONSTRAINT gap_question_tags_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.gap_questions(id) ON DELETE CASCADE;


--
-- Name: gap_question_tags gap_question_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gap_question_tags
    ADD CONSTRAINT gap_question_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.skill_tags(id) ON DELETE CASCADE;


--
-- Name: gap_questions gap_questions_roadmap_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gap_questions
    ADD CONSTRAINT gap_questions_roadmap_id_fkey FOREIGN KEY (roadmap_id) REFERENCES public.roadmaps(id) ON DELETE CASCADE;


--
-- Name: hh_key_skills hh_key_skills_roadmap_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hh_key_skills
    ADD CONSTRAINT hh_key_skills_roadmap_id_fkey FOREIGN KEY (roadmap_id) REFERENCES public.roadmaps(id) ON DELETE CASCADE;


--
-- Name: roadmap_relations roadmap_relations_related_roadmap_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roadmap_relations
    ADD CONSTRAINT roadmap_relations_related_roadmap_id_fkey FOREIGN KEY (related_roadmap_id) REFERENCES public.roadmaps(id) ON DELETE CASCADE;


--
-- Name: roadmap_relations roadmap_relations_roadmap_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roadmap_relations
    ADD CONSTRAINT roadmap_relations_roadmap_id_fkey FOREIGN KEY (roadmap_id) REFERENCES public.roadmaps(id) ON DELETE CASCADE;


--
-- Name: roadmap_tag_links roadmap_tag_links_roadmap_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roadmap_tag_links
    ADD CONSTRAINT roadmap_tag_links_roadmap_id_fkey FOREIGN KEY (roadmap_id) REFERENCES public.roadmaps(id) ON DELETE CASCADE;


--
-- Name: roadmap_tag_links roadmap_tag_links_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roadmap_tag_links
    ADD CONSTRAINT roadmap_tag_links_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.roadmap_tags(id) ON DELETE CASCADE;


--
-- Name: skill_tag_links skill_tag_links_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_tag_links
    ADD CONSTRAINT skill_tag_links_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id) ON DELETE CASCADE;


--
-- Name: skill_tag_links skill_tag_links_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_tag_links
    ADD CONSTRAINT skill_tag_links_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.skill_tags(id) ON DELETE CASCADE;


--
-- Name: skills_dependencies skills_dependencies_depends_on_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skills_dependencies
    ADD CONSTRAINT skills_dependencies_depends_on_skill_id_fkey FOREIGN KEY (depends_on_skill_id) REFERENCES public.skills(id) ON DELETE CASCADE;


--
-- Name: skills_dependencies skills_dependencies_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skills_dependencies
    ADD CONSTRAINT skills_dependencies_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id) ON DELETE CASCADE;


--
-- Name: skills skills_roadmap_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_roadmap_id_fkey FOREIGN KEY (roadmap_id) REFERENCES public.roadmaps(id) ON DELETE CASCADE;


--
-- Name: user_achievements user_achievements_achievement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_achievement_id_fkey FOREIGN KEY (achievement_id) REFERENCES public.achievements(id) ON DELETE CASCADE;


--
-- Name: user_achievements user_achievements_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_favorite_roadmaps user_favorite_roadmaps_roadmap_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_favorite_roadmaps
    ADD CONSTRAINT user_favorite_roadmaps_roadmap_id_fkey FOREIGN KEY (roadmap_id) REFERENCES public.roadmaps(id) ON DELETE CASCADE;


--
-- Name: user_favorite_roadmaps user_favorite_roadmaps_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_favorite_roadmaps
    ADD CONSTRAINT user_favorite_roadmaps_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users_skill_progress users_skill_progress_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_skill_progress
    ADD CONSTRAINT users_skill_progress_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id) ON DELETE CASCADE;


--
-- Name: users_skill_progress users_skill_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_skill_progress
    ADD CONSTRAINT users_skill_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict BZQugsswsZlD5SoBvGBhbZPvT2oJAAoW7Zh1g40AU0vCXRoSRJNpHuJgUgV75rD

