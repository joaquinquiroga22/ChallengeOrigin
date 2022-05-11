CREATE DATABASE accionsdb
CREATE TABLE login(
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(255) UNIQUE,
    password VARCHAR(255) UNIQUE
);
CREATE TABLE accions(
    id SERIAL PRIMARY KEY,
    simbolo VARCHAR(40) UNIQUE,
    nombre VARCHAR(255) UNIQUE,
    moneda VARCHAR(40) 
);