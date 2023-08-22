-- Active: 1689243185538@@localhost@5001@spoons-test

-- Drop constrants
ALTER TABLE IF EXISTS users.admin_accounts DROP CONSTRAINT fk_admin_id;
ALTER TABLE IF EXISTS users.admin_accounts DROP CONSTRAINT fk_email_id;
ALTER TABLE IF EXISTS users.customer_accounts DROP CONSTRAINT fk_customer_id;
ALTER TABLE IF EXISTS users.customer_accounts DROP CONSTRAINT fk_email_id;
ALTER TABLE IF EXISTS users.customer_passwords DROP CONSTRAINT fk_customer_id;
ALTER TABLE IF EXISTS users.admin_otps DROP CONSTRAINT fk_admin_id;
ALTER TABLE IF EXISTS users.customer_otps DROP CONSTRAINT fk_customer_id;
ALTER TABLE IF EXISTS users.customer_identities DROP CONSTRAINT fk_customer_id;
ALTER TABLE IF EXISTS users.admins_roles DROP CONSTRAINT fk_admin_id;
ALTER TABLE IF EXISTS users.admins_roles DROP CONSTRAINT fk_role_id;
ALTER TABLE IF EXISTS users.addresses DROP CONSTRAINT fk_customer_id;
ALTER TABLE IF EXISTS users.admin_phones DROP CONSTRAINT fk_admin_id;
ALTER TABLE IF EXISTS users.admin_phones DROP CONSTRAINT fk_phone_id;
ALTER TABLE IF EXISTS users.customer_phones DROP CONSTRAINT fk_customer_id;
ALTER TABLE IF EXISTS users.customer_phones DROP CONSTRAINT fk_phone_id;

-- Drop tables
DROP TABLE IF EXISTS users.addresses;
DROP TABLE IF EXISTS users.customer_phones;
DROP TABLE IF EXISTS users.admin_phones;
DROP TABLE IF EXISTS users.phones;
DROP TABLE IF EXISTS users.admins_roles;
DROP TABLE IF EXISTS users.roles;
DROP TABLE IF EXISTS users.customer_identities;
DROP TABLE IF EXISTS users.customer_otps;
DROP TABLE IF EXISTS users.admin_otps;
DROP TABLE IF EXISTS users.customer_passwords;
DROP TABLE IF EXISTS users.customer_accounts;
DROP TABLE IF EXISTS users.admin_accounts;
DROP TABLE IF EXISTS users.customers;
DROP TABLE IF EXISTS users.admins;
DROP TABLE IF EXISTS users.emails;

-- Drop enums
DROP TYPE IF EXISTS users.enum_customer_phones_status;
DROP TYPE IF EXISTS users.enum_admin_phones_status;
DROP TYPE IF EXISTS users.enum_customer_identities_provider;
DROP TYPE IF EXISTS users.enum_customer_otps_type;
DROP TYPE IF EXISTS users.enum_admin_otps_type;
DROP TYPE IF EXISTS users.enum_customer_accounts_status;
DROP TYPE IF EXISTS users.enum_admin_accounts_status;

DROP SEQUENCE IF EXISTS users.admin_id_seq;
DROP SEQUENCE IF EXISTS users.customer_id_seq;

-- Drop schema
DROP SCHEMA IF EXISTS users;

-- Create schema
CREATE SCHEMA users;

CREATE SEQUENCE users.customer_id_seq START 1 INCREMENT 2;
CREATE SEQUENCE users.admin_id_seq START 2 INCREMENT 2;

-- Create enums
CREATE TYPE users.enum_admin_accounts_status AS ENUM ('active', 'pending', 'disabled');
CREATE TYPE users.enum_customer_accounts_status AS ENUM ('active', 'pending', 'suspended', 'deactivated');
CREATE TYPE users.enum_admin_otps_type AS ENUM ('email', 'password', 'phone');
CREATE TYPE users.enum_customer_otps_type AS ENUM ('email', 'password', 'phone');
CREATE TYPE users.enum_customer_identities_provider AS ENUM ('google', 'facebook');
CREATE TYPE users.enum_admin_phones_status AS ENUM ('active', 'pending');
CREATE TYPE users.enum_customer_phones_status AS ENUM ('active', 'pending');

-- Create tables
CREATE TABLE users.emails (
  email_id SERIAL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL,
  PRIMARY KEY (email_id)
);

CREATE TABLE users.admins (
  admin_id INTEGER DEFAULT nextval('users.admin_id_seq'),
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (admin_id)
);

CREATE TABLE users.customers (
  customer_id INTEGER DEFAULT nextval('users.customer_id_seq'),
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (customer_id)
);

CREATE TABLE users.admin_accounts (
  admin_id INTEGER NOT NULL,
  email_id INTEGER NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  status users.enum_admin_accounts_status NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (admin_id),
  CONSTRAINT fk_admin_id FOREIGN KEY (admin_id) REFERENCES users.admins (admin_id) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT fk_email_id FOREIGN KEY (email_id) REFERENCES users.emails (email_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE users.customer_accounts (
  customer_id INTEGER NOT NULL,
  email_id INTEGER NOT NULL UNIQUE,
  status users.enum_customer_accounts_status NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (customer_id),
  CONSTRAINT fk_customer_id FOREIGN KEY (customer_id) REFERENCES users.customers (customer_id) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT fk_email_id FOREIGN KEY (email_id) REFERENCES users.emails (email_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE users.customer_passwords (
  customer_id INTEGER NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (customer_id),
  CONSTRAINT fk_customer_id FOREIGN KEY (customer_id) REFERENCES users.customer_accounts (customer_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE users.admin_otps (
  otp_id SERIAL,
  admin_id INTEGER NOT NULL,
  type users.enum_admin_otps_type NOT NULL,
  password VARCHAR(100) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  PRIMARY KEY (otp_id),
  UNIQUE (admin_id, type),
  CONSTRAINT fk_admin_id FOREIGN KEY (admin_id) REFERENCES users.admins (admin_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE users.customer_otps (
  otp_id SERIAL,
  customer_id INTEGER NOT NULL,
  type users.enum_customer_otps_type NOT NULL,
  password VARCHAR(100) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  PRIMARY KEY (otp_id),
  UNIQUE (customer_id, type),
  CONSTRAINT fk_customer_id FOREIGN KEY (customer_id) REFERENCES users.customers (customer_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE users.customer_identities (
  identity_id VARCHAR(50),
  customer_id INTEGER,
  provider users.enum_customer_identities_provider,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (identity_id, customer_id, provider),
  CONSTRAINT fk_customer_id FOREIGN KEY (customer_id) REFERENCES users.customers (customer_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE users.roles (
  role_id SERIAL,
  name VARCHAR(50) UNIQUE NOT NULL,
  PRIMARY KEY (role_id)
);

CREATE TABLE users.admins_roles (
  admin_id INTEGER NOT NULL,
  role_id INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  UNIQUE (admin_id, role_id),
  CONSTRAINT fk_admin_id FOREIGN KEY (admin_id) REFERENCES users.admins (admin_id) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES users.roles (role_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE users.phones (
  phone_id SERIAL,
  phone_number VARCHAR(10) UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL,
  PRIMARY KEY (phone_id)
);

CREATE TABLE users.admin_phones (
  admin_id INTEGER,
  phone_id INTEGER UNIQUE NOT NULL,
  status users.enum_admin_phones_status NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (admin_id),
  CONSTRAINT fk_admin_id FOREIGN KEY (admin_id) REFERENCES users.admins (admin_id) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT fk_phone_id FOREIGN KEY (phone_id) REFERENCES users.phones (phone_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE users.customer_phones (
  customer_id INTEGER NOT NULL,
  phone_id INTEGER UNIQUE NOT NULL,
  status users.enum_customer_phones_status NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (customer_id),
  CONSTRAINT fk_customer_id FOREIGN KEY (customer_id) REFERENCES users.customers (customer_id) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT fk_phone_id FOREIGN KEY (phone_id) REFERENCES users.phones (phone_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE users.addresses (
  address_id SERIAL,
  customer_id INTEGER NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  postal_code VARCHAR(5) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (address_id),
  CONSTRAINT fk_customer_id FOREIGN KEY (customer_id) REFERENCES users.customers (customer_id) ON DELETE CASCADE ON UPDATE NO ACTION
);