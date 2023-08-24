-- Drop triggers
DROP TRIGGER IF EXISTS after_insert_admin ON users.admins;
DROP TRIGGER IF EXISTS after_insert_customer ON users.customers;
DROP TRIGGER IF EXISTS before_update_email ON users.emails;
DROP TRIGGER IF EXISTS before_update_phone ON users.phones;

-- Drop functions
DROP FUNCTION IF EXISTS users.update_user_type_view();
DROP FUNCTION IF EXISTS users.prevent_update_email();
DROP FUNCTION IF EXISTS users.prevent_update_phone();

-- Indexes
DROP INDEX IF EXISTS idx_user_type_view_email;
DROP INDEX IF EXISTS idx_user_type_view_userId;

-- Drop views
DROP MATERIALIZED VIEW IF EXISTS users.user_type_view;

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