-- =====================================================================
-- Script de inicialización para base de datos PostgreSQL de Bookshop
-- Crea tablas, secuencias, datos iniciales y relaciones básicas
-- =====================================================================

-- Elimina tablas y secuencias si existen (para reinicializar el esquema)
DROP TABLE IF EXISTS users_roles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS categories;

DROP SEQUENCE IF EXISTS categories_id_seq;
DROP SEQUENCE IF EXISTS authors_id_seq;
DROP SEQUENCE IF EXISTS roles_id_seq;
DROP SEQUENCE IF EXISTS users_id_seq;

-- =====================
-- Tabla de Categorías
-- =====================
CREATE SEQUENCE categories_id_seq START 1;

CREATE TABLE categories (
    id BIGINT PRIMARY KEY DEFAULT nextval('categories_id_seq'), -- Identificador único
    name VARCHAR(50) NOT NULL                                   -- Nombre de la categoría
);

-- =====================
-- Tabla de Autores
-- =====================
CREATE SEQUENCE authors_id_seq START 1;

CREATE TABLE authors (
    id BIGINT PRIMARY KEY DEFAULT nextval('authors_id_seq'), -- Identificador único
    name TEXT,                                              -- Nombre del autor
    birth_date DATE,                                        -- Fecha de nacimiento
    nationality TEXT,                                       -- Nacionalidad
    biography TEXT                                          -- Biografía
);

-- =====================
-- Tabla de Libros
-- =====================
CREATE TABLE books (
    isbn TEXT PRIMARY KEY,                                  -- ISBN como identificador único
    title TEXT,                                             -- Título del libro
    author_id BIGINT REFERENCES authors(id),                -- Relación con autores
    category_id BIGINT REFERENCES categories(id)           -- Relación con categorías
);

-- =====================
-- Tabla de Roles
-- =====================
CREATE SEQUENCE roles_id_seq START 1;

CREATE TABLE roles (
    id BIGINT PRIMARY KEY DEFAULT nextval('roles_id_seq'),  -- Identificador único
    name VARCHAR(50) NOT NULL UNIQUE                        -- Nombre del rol (único)
);

-- =====================
-- Tabla de Usuarios
-- =====================
CREATE SEQUENCE users_id_seq START 1;

CREATE TABLE users (
    id BIGINT PRIMARY KEY DEFAULT nextval('users_id_seq'),  -- Identificador único
    username VARCHAR(50) NOT NULL UNIQUE,                   -- Nombre de usuario (único)
    password VARCHAR(100) NOT NULL,                         -- Contraseña encriptada
    enabled BOOLEAN NOT NULL,                               -- ¿Está habilitado?
    account_non_expired BOOLEAN NOT NULL,                   -- ¿Cuenta no expirada?
    account_non_locked BOOLEAN NOT NULL,                    -- ¿Cuenta no bloqueada?
    credentials_non_expired BOOLEAN NOT NULL                -- ¿Credenciales no expiradas?
);

-- =====================
-- Tabla de Relación Usuarios-Roles (muchos a muchos)
-- =====================
CREATE TABLE users_roles (
    user_id BIGINT NOT NULL REFERENCES users(id),           -- Usuario
    role_id BIGINT NOT NULL REFERENCES roles(id),           -- Rol
    PRIMARY KEY (user_id, role_id)
);

-- =====================
-- Datos iniciales
-- =====================
-- Inserta roles básicos
INSERT INTO roles (name) VALUES ('ROLE_ADMIN');
INSERT INTO roles (name) VALUES ('ROLE_USER');

-- Inserta usuarios de ejemplo (contraseñas encriptadas)
-- admin: admin123, user: user123 (cambiar en producción)
INSERT INTO users (username, password, enabled, account_non_expired, account_non_locked, credentials_non_expired)
VALUES ('admin', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', true, true, true, true);

INSERT INTO users (username, password, enabled, account_non_expired, account_non_locked, credentials_non_expired)
VALUES ('user', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG', true, true, true, true);

-- Asigna roles a los usuarios
INSERT INTO users_roles (user_id, role_id)
VALUES ((SELECT id FROM users WHERE username = 'admin'), (SELECT id FROM roles WHERE name = 'ROLE_ADMIN'));

INSERT INTO users_roles (user_id, role_id)
VALUES ((SELECT id FROM users WHERE username = 'admin'), (SELECT id FROM roles WHERE name = 'ROLE_USER'));

INSERT INTO users_roles (user_id, role_id)
VALUES ((SELECT id FROM users WHERE username = 'user'), (SELECT id FROM roles WHERE name = 'ROLE_USER'));

-- =====================
-- Índices para mejorar el rendimiento de búsquedas
-- =====================
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_roles_name ON roles(name);

-- =====================
-- Fin del script
-- =====================