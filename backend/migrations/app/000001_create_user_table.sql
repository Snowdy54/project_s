CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(100) NOT NULL
);

CREATE TABLE skills(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE professions(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE skills_dependencies(
    skill_id INTEGER REFERENCES skills(id),
    depends_on_skill_id INTEGER REFERENCES skills(id),
    PRIMARY KEY (skill_id, depends_on_skill_id)
);

CREATE TABLE professions_skills(
    skill_id INTEGER REFERENCES skills (id),
    profession_id INTEGER REFERENCES professions (id),
    PRIMARY KEY (skill_id, profession_id)
);

CREATE TABLE users_skill_progress(
    user_id INTEGER REFERENCES users (id),
    skill_id INTEGER REFERENCES skills (id),
    status VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, skill_id)
)