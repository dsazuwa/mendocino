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

CREATE TRIGGER before_update_email
BEFORE UPDATE ON users.emails
FOR EACH ROW
EXECUTE FUNCTION users.prevent_update_email();

CREATE TRIGGER before_update_phone
BEFORE UPDATE ON users.phones
FOR EACH ROW
EXECUTE FUNCTION users.prevent_update_phone();