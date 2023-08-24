CREATE OR REPLACE FUNCTION users.update_user_type_view() RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW users.user_type_view;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION users.prevent_update_email()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email <> OLD.email THEN
    RAISE EXCEPTION 'Updating email in emails table is not allowed.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION users.prevent_update_phone()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.phone_number <> OLD.phone_number THEN
    RAISE EXCEPTION 'Updating phone in phones table is not allowed.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_insert_admin
AFTER INSERT ON users.admins
FOR EACH STATEMENT
EXECUTE FUNCTION users.update_user_type_view();

CREATE TRIGGER after_insert_customer
AFTER INSERT ON users.customers
FOR EACH STATEMENT
EXECUTE FUNCTION users.update_user_type_view();

CREATE TRIGGER before_update_email
BEFORE UPDATE ON users.emails
FOR EACH ROW
EXECUTE FUNCTION users.prevent_update_email();

CREATE TRIGGER before_update_phone
BEFORE UPDATE ON users.phones
FOR EACH ROW
EXECUTE FUNCTION users.prevent_update_phone();