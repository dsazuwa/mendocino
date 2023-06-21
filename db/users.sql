CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TYPE IF EXISTS "enum_users_role" CASCADE;

DROP TYPE IF EXISTS "enum_users_status" CASCADE;

DROP TABLE IF EXISTS "users" CASCADE;

DROP TABLE IF EXISTS "addresses" CASCADE;

CREATE TYPE enum_users_role AS ENUM ('admin', 'client');

CREATE TYPE enum_users_status AS ENUM ('active', 'inactive', 'pending');

CREATE TABLE IF NOT EXISTS users (
  "id" SERIAL PRIMARY KEY,
  "uuid" UUID NOT NULL UNIQUE,
  "first_name" VARCHAR(255) NOT NULL,
  "last_name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "password" VARCHAR(255) NOT NULL,
  "role" enum_users_role NOT NULL DEFAULT 'client',
  "status" enum_users_status NOT NULL DEFAULT 'pending',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS addresses (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  "address_line1" VARCHAR(255) NOT NULL,
  "address_line2" VARCHAR(255),
  "city" VARCHAR(255) NOT NULL,
  "state" VARCHAR(255) NOT NULL,
  "postal_code" VARCHAR(10) NOT NULL
);

INSERT INTO
  users (
    "id",
    "uuid",
    "first_name",
    "last_name",
    "email",
    "password",
    "status",
    "created_at",
    "updated_at"
  )
VALUES
  (
    DEFAULT,
    uuid_generate_v4(),
    'Joe',
    'Doe',
    'joedoe@gmail.com',
    '$2a$10$XQ9.649wP9jV9.6dptwQv.5G2i5LwP6ZL/eihMCsxqV4imQTQXbuG',
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    uuid_generate_v4(),
    'Jane',
    'Doe',
    'janedoe@gmail.com',
    '$2a$10$XQ9.649wP9jV9.6dptwQv.5G2i5LwP6ZL/eihMCsxqV4imQTQXbuG',
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    uuid_generate_v4(),
    'Jay',
    'Doe',
    'jaydoe@gmail.com',
    '$2a$10$XQ9.649wP9jV9.6dptwQv.5G2i5LwP6ZL/eihMCsxqV4imQTQXbuG',
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    uuid_generate_v4(),
    'Josh',
    'Doe',
    'joshdoe@gmail.com',
    '$2a$10$XQ9.649wP9jV9.6dptwQv.5G2i5LwP6ZL/eihMCsxqV4imQTQXbuG',
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    uuid_generate_v4(),
    'June',
    'Doe',
    'junedoe@gmail.com',
    '$2a$10$XQ9.649wP9jV9.6dptwQv.5G2i5LwP6ZL/eihMCsxqV4imQTQXbuG',
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    uuid_generate_v4(),
    'Jen',
    'Doe',
    'jendoe@gmail.com',
    '$2a$10$XQ9.649wP9jV9.6dptwQv.5G2i5LwP6ZL/eihMCsxqV4imQTQXbuG',
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    uuid_generate_v4(),
    'Jax',
    'Doe',
    'jaxdoe@gmail.com',
    '$2a$10$XQ9.649wP9jV9.6dptwQv.5G2i5LwP6ZL/eihMCsxqV4imQTQXbuG',
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    uuid_generate_v4(),
    'Jeff',
    'Doe',
    'jeffdoe@gmail.com',
    '$2a$10$XQ9.649wP9jV9.6dptwQv.5G2i5LwP6ZL/eihMCsxqV4imQTQXbuG',
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    uuid_generate_v4(),
    'James',
    'Doe',
    'jamesdoe@gmail.com',
    '$2a$10$XQ9.649wP9jV9.6dptwQv.5G2i5LwP6ZL/eihMCsxqV4imQTQXbuG',
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    uuid_generate_v4(),
    'Jack',
    'Doe',
    'jackdoe@gmail.com',
    '$2a$10$XQ9.649wP9jV9.6dptwQv.5G2i5LwP6ZL/eihMCsxqV4imQTQXbuG',
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    DEFAULT,
    uuid_generate_v4(),
    'Joy',
    'Doe',
    'joydoe@gmail.com',
    '$2a$10$XQ9.649wP9jV9.6dptwQv.5G2i5LwP6ZL/eihMCsxqV4imQTQXbuG',
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );

INSERT INTO
  addresses (
    "id",
    "user_id",
    "address_line1",
    "city",
    "state",
    "postal_code"
  )
VALUES
  (
    DEFAULT,
    1,
    '2975 Arthur Avenue',
    'Freeport',
    'Illinois',
    '61032'
  ),
  (
    DEFAULT,
    1,
    '4050 Cecil Street',
    'Chicago',
    'Illinois',
    '61032'
  ),
  (
    DEFAULT,
    2,
    '1558 West Drive',
    'Chicago',
    'Illinois',
    '60603'
  ),
  (
    DEFAULT,
    3,
    '2349 Coburn Hollow Road',
    'Peoria',
    'Illinois',
    '61602'
  ),
  (
    DEFAULT,
    4,
    '1163 Lewis Street',
    'Arlington Heights',
    'Illinois',
    '60005'
  ),
  (
    DEFAULT,
    5,
    '2502 Oak Avenue',
    'Schaumburg',
    'Illinois',
    '60173'
  ),
  (
    DEFAULT,
    6,
    '2800 Oakmound Road',
    'Burr Ridge',
    'Illinois',
    '60527'
  ),
  (
    DEFAULT,
    6,
    '4716 Flinderation Road',
    'Blue Island',
    'Illinois',
    '60406'
  ),
  (
    DEFAULT,
    7,
    '142 Cardinal Lane',
    'Mattoon',
    'Illinois',
    '61938'
  ),
  (
    DEFAULT,
    8,
    '1533 Poplar Street',
    'Chicago',
    'Illinois',
    '60606'
  ),
  (
    DEFAULT,
    9,
    '1886 Pringle Drive',
    'Chicago',
    'Illinois',
    '60616'
  ),
  (
    DEFAULT,
    10,
    '3213 Dovetail Drive',
    'Chicago',
    'Illinois',
    '60606'
  ),
  (
    DEFAULT,
    11,
    '3206 Oakmound Road',
    'Chicago',
    'Illinois',
    '60661'
  );