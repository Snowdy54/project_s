-- Сбрасываем старые тестовые таблицы
DROP TABLE IF EXISTS gap_question_tags, gap_questions, hh_key_skills,
    users_skill_progress, skill_tag_links, skill_tags, skills_dependencies,
    skills, user_favorite_roadmaps, roadmap_tag_links, roadmap_tags,
    roadmap_relations, roadmaps, users CASCADE;

-- 1. Пользователи (Личный кабинет)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    nickname VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(30) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    github_url VARCHAR(255) DEFAULT '',
    vk_url VARCHAR(255) DEFAULT '',
    telegram_url VARCHAR(255) DEFAULT '',
    website_url VARCHAR(255) DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_user_contact CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- 2. Интерактивные карты (Направления)
CREATE TABLE roadmaps (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    short_description TEXT NOT NULL DEFAULT '',
    required_skills_desc TEXT NOT NULL DEFAULT '',
    typical_tasks_desc TEXT NOT NULL DEFAULT '',
    ai_impact_notes TEXT NOT NULL DEFAULT '',
    practice_base_url VARCHAR(500) NOT NULL DEFAULT '',
    hh_search_query VARCHAR(255) NOT NULL DEFAULT '',
    hh_last_error TEXT DEFAULT NULL,
    hh_retry_count INT NOT NULL DEFAULT 0,
    hh_updated_at TIMESTAMPTZ DEFAULT NULL
);

-- Связанные направления (блок в инфопанели и продолжение в конце дерева)
CREATE TABLE roadmap_relations (
    roadmap_id BIGINT REFERENCES roadmaps(id) ON DELETE CASCADE,
    related_roadmap_id BIGINT REFERENCES roadmaps(id) ON DELETE CASCADE,
    relation_type VARCHAR(20) NOT NULL DEFAULT 'related' CHECK (relation_type IN ('related', 'next_step')),
    PRIMARY KEY (roadmap_id, related_roadmap_id, relation_type)
);

-- Теги карточек карт для каталога
CREATE TABLE roadmap_tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(30) NOT NULL CHECK (category IN ('language', 'direction', 'basics'))
);

CREATE TABLE roadmap_tag_links (
    roadmap_id BIGINT REFERENCES roadmaps(id) ON DELETE CASCADE,
    tag_id BIGINT REFERENCES roadmap_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (roadmap_id, tag_id)
);

-- Избранные карты (закладки)
CREATE TABLE user_favorite_roadmaps (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    roadmap_id BIGINT REFERENCES roadmaps(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, roadmap_id)
);

-- 3. Узлы дерева навыков
CREATE TABLE skills (
    id BIGSERIAL PRIMARY KEY,
    roadmap_id BIGINT NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    difficulty VARCHAR(20) NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'advanced', 'deep')),
    pos_x INT NOT NULL DEFAULT 0,
    pos_y INT NOT NULL DEFAULT 0
);

-- Связи между узлами
CREATE TABLE skills_dependencies (
    skill_id BIGINT REFERENCES skills(id) ON DELETE CASCADE,
    depends_on_skill_id BIGINT REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (skill_id, depends_on_skill_id)
);

-- Унифицированные теги узлов (для фильтров и Gap Analysis)
CREATE TABLE skill_tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE skill_tag_links (
    skill_id BIGINT REFERENCES skills(id) ON DELETE CASCADE,
    tag_id BIGINT REFERENCES skill_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (skill_id, tag_id)
);

-- Прогресс пользователя по узлам
CREATE TABLE users_skill_progress (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    skill_id BIGINT REFERENCES skills(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'skipped')),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_skill UNIQUE (user_id, skill_id)
);

-- 4. Внешние интеграции: ключевые навыки с hh.ru
CREATE TABLE hh_key_skills (
    id BIGSERIAL PRIMARY KEY,
    roadmap_id BIGINT NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
    skill_name VARCHAR(150) NOT NULL,
    frequency INT NOT NULL DEFAULT 1,
    UNIQUE (roadmap_id, skill_name)
);

-- 5. Gap Analysis: вопросы опроса
CREATE TABLE gap_questions (
    id BIGSERIAL PRIMARY KEY,
    roadmap_id BIGINT NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    order_num INT NOT NULL DEFAULT 1
);

CREATE TABLE gap_question_tags (
    question_id BIGINT REFERENCES gap_questions(id) ON DELETE CASCADE,
    tag_id BIGINT REFERENCES skill_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (question_id, tag_id)
);