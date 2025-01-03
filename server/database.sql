CREATE DATABASE PERNTODO;

CREATE TABLE TODO(
    todo_id SERIAL PRIMARY KEY,
    description VARCHAR(255)
    is_completed BOOLEAN DEFAULT FALSE,
    user_id INT REFERENCES users(user_id)
);


CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);


