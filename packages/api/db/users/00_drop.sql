-- Drop populators
DROP FUNCTION IF EXISTS users.create_mock_admin_user(VARCHAR, INTEGER);

-- Drop triggers
DROP TRIGGER IF EXISTS before_update_prevent_admin_id  ON users.admins;
DROP TRIGGER IF EXISTS before_update_prevent_customer_id  ON users.customers;
DROP TRIGGER IF EXISTS before_update_email ON users.emails;
DROP TRIGGER IF EXISTS before_update_phone ON users.phones;

-- Drop trigger functions
DROP FUNCTION IF EXISTS users.prevent_admin_id_update();
DROP FUNCTION IF EXISTS users.prevent_customer_id_update();
DROP FUNCTION IF EXISTS users.prevent_update_email();
DROP FUNCTION IF EXISTS users.prevent_update_phone();

-- Drop functions
DROP FUNCTION IF EXISTS users.get_refresh_token(VARCHAR, INTEGER);
DROP FUNCTION IF EXISTS users.get_admin(INTEGER);
DROP FUNCTION IF EXISTS users.get_customer(INTEGER);
DROP FUNCTION IF EXISTS users.get_user_by_email(VARCHAR);
DROP FUNCTION IF EXISTS users.get_user_with_password(VARCHAR);
DROP FUNCTION IF EXISTS users.get_customer_from_payload(VARCHAR, users.enum_customer_identities_provider);
DROP FUNCTION IF EXISTS users.get_user_for_social_authentication(VARCHAR, VARCHAR, users.enum_customer_identities_provider);
DROP FUNCTION IF EXISTS users.get_user_for_recovery(VARCHAR);
DROP FUNCTION IF EXISTS users.get_customer_profile(INTEGER);
DROP FUNCTION IF EXISTS users.get_customer_for_revoke_social_auth(INTEGER, users.enum_customer_identities_provider);

-- Drop views
DROP VIEW IF EXISTS users.basic_user_details;
DROP VIEW IF EXISTS users.all_refresh_tokens;

-- Drop indexes
DROP INDEX IF EXISTS users.idx_email_lower_unique;
DROP INDEX IF EXISTS users.idx_role_lower_unique;

-- Drop constraints
ALTER TABLE IF EXISTS users.admin_accounts DROP CONSTRAINT fk_admin_id;
ALTER TABLE IF EXISTS users.admin_accounts DROP CONSTRAINT fk_email_id;
ALTER TABLE IF EXISTS users.customer_emails DROP CONSTRAINT fk_customer_id;
ALTER TABLE IF EXISTS users.customer_emails DROP CONSTRAINT fk_email_id;
ALTER TABLE IF EXISTS users.customer_passwords DROP CONSTRAINT fk_customer_id;
ALTER TABLE IF EXISTS users.admin_otps DROP CONSTRAINT fk_admin_id;
ALTER TABLE IF EXISTS users.customer_otps DROP CONSTRAINT fk_customer_id;
ALTER TABLE IF EXISTS users.customer_identities DROP CONSTRAINT fk_customer_id;
ALTER TABLE IF EXISTS users.admins_roles DROP CONSTRAINT fk_admin_id;
ALTER TABLE IF EXISTS users.admins_roles DROP CONSTRAINT fk_role_id;
ALTER TABLE IF EXISTS users.admin_phones DROP CONSTRAINT fk_admin_id;
ALTER TABLE IF EXISTS users.admin_phones DROP CONSTRAINT fk_phone_id;
ALTER TABLE IF EXISTS users.customer_phones DROP CONSTRAINT fk_customer_id;
ALTER TABLE IF EXISTS users.customer_phones DROP CONSTRAINT fk_phone_id;
ALTER TABLE IF EXISTS users.guest_addresses DROP CONSTRAINT fk_guest_id;
ALTER TABLE IF EXISTS users.guest_addresses DROP CONSTRAINT fk_address_id;
ALTER TABLE IF EXISTS users.customer_addresses DROP CONSTRAINT fk_customer_id;
ALTER TABLE IF EXISTS users.customer_addresses DROP CONSTRAINT fk_address_id;
ALTER TABLE IF EXISTS users.admin_refresh_tokens DROP CONSTRAINT fk_admin_id;
ALTER TABLE IF EXISTS users.customer_refresh_tokens DROP CONSTRAINT fk_customer_id;

-- Drop tables
DROP TABLE IF EXISTS users.customer_refresh_tokens;
DROP TABLE IF EXISTS users.admin_refresh_tokens;
DROP TABLE IF EXISTS users.customer_addresses;
DROP TABLE IF EXISTS users.guest_addresses;
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
DROP TABLE IF EXISTS users.customer_emails;
DROP TABLE IF EXISTS users.admin_accounts;
DROP TABLE IF EXISTS users.customers;
DROP TABLE IF EXISTS users.admins;
DROP TABLE IF EXISTS users.emails;
DROP TABLE IF EXISTS users.guests;

-- Drop sequences
DROP SEQUENCE IF EXISTS users.admin_id_seq;
DROP SEQUENCE IF EXISTS users.customer_id_seq;

DROP EXTENSION IF EXISTS "uuid-ossp";

-- Drop enums
DROP TYPE IF EXISTS users.enum_drop_off_option;
DROP TYPE IF EXISTS users.enum_customer_phones_status;
DROP TYPE IF EXISTS users.enum_admin_phones_status;
DROP TYPE IF EXISTS users.enum_customer_identities_provider;
DROP TYPE IF EXISTS users.enum_customer_otps_type;
DROP TYPE IF EXISTS users.enum_admin_otps_type;
DROP TYPE IF EXISTS users.enum_customer_status;
DROP TYPE IF EXISTS users.enum_admin_status;

-- Drop schema
DROP SCHEMA IF EXISTS users;