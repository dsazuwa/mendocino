-- Create sequences
CREATE SEQUENCE users.customer_id_seq START 1 INCREMENT 2;
CREATE SEQUENCE users.admin_id_seq START 2 INCREMENT 2;

-- Create tables
CREATE TABLE users.emails (
  email_id SERIAL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  PRIMARY KEY (email_id)
);

CREATE TABLE users.admins (
  admin_id INTEGER DEFAULT nextval('users.admin_id_seq'),
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  status users.enum_admin_status NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  CHECK (admin_id % 2 = 0),
  PRIMARY KEY (admin_id)
);

CREATE TABLE users.customers (
  customer_id INTEGER DEFAULT nextval('users.customer_id_seq'),
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  status users.enum_customer_status NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  CHECK (customer_id % 2 = 1),
  PRIMARY KEY (customer_id)
);

CREATE TABLE users.admin_accounts (
  admin_id INTEGER NOT NULL,
  email_id INTEGER NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (admin_id),
  CONSTRAINT fk_admin_id FOREIGN KEY (admin_id) REFERENCES users.admins (admin_id) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT fk_email_id FOREIGN KEY (email_id) REFERENCES users.emails (email_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE users.customer_emails (
  customer_id INTEGER NOT NULL,
  email_id INTEGER NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL,
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
  CONSTRAINT fk_customer_id FOREIGN KEY (customer_id) REFERENCES users.customers (customer_id) ON DELETE CASCADE ON UPDATE NO ACTION
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
  name VARCHAR(50) NOT NULL,
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
  phone_number VARCHAR(10) UNIQUE CHECK (phone_number ~ '^[0-9]+$') NOT NULL,
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

CREATE TABLE users.customer_addresses (
  address_id SERIAL,
  customer_id INTEGER NOT NULL,
  place_id VARCHAR(255) NOT NULL,
  suite VARCHAR(50),
  name VARCHAR(100) NOT NULL,
  address VARCHAR(100) NOT NULL,
  zip_code VARCHAR(5) NOT NULL,
  lat VARCHAR(32) NOT NULL,
  lng VARCHAR(32) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (address_id),
  CONSTRAINT fk_customer_id FOREIGN KEY (customer_id) REFERENCES users.customers (customer_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CREATE TABLE users.default_customer_addresses (
--   customer_id INTEGER NOT NULL,
--   address_id INTEGER NOT NULL,
--   created_at TIMESTAMP NOT NULL,
--   updated_at TIMESTAMP NOT NULL,
--   PRIMARY KEY (customer_id),
--   CONSTRAINT fk_customer_id FOREIGN KEY (customer_id) REFERENCES users.customers (customer_id) ON DELETE CASCADE ON UPDATE NO ACTION,
--   CONSTRAINT fk_address_id FOREIGN KEY (address_id) REFERENCES users.customer_addresses (address_id) ON DELETE CASCADE ON UPDATE NO ACTION
-- );

CREATE TABLE users.admin_refresh_tokens (
  token_id SERIAL,
  admin_id INTEGER NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL,
  PRIMARY KEY (token_id),
  UNIQUE (admin_id, token),
  CONSTRAINT fk_admin_id FOREIGN KEY (admin_id) REFERENCES users.admins (admin_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE users.customer_refresh_tokens (
  token_id SERIAL,
  customer_id INTEGER NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL,
  PRIMARY KEY (token_id),
  UNIQUE (customer_id, token),
  CONSTRAINT fk_customer_id FOREIGN KEY (customer_id) REFERENCES users.customers (customer_id) ON DELETE CASCADE ON UPDATE NO ACTION
);