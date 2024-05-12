-- #region insert_modifier_option
CREATE OR REPLACE FUNCTION users.create_mock_admin_user(
  p_name VARCHAR,
  role_id INTEGER
) RETURNS INTEGER AS $$
DECLARE
  email_id INTEGER;
  admin_id INTEGER;
BEGIN
  INSERT INTO users.emails ("email_id", "email", "created_at")
  VALUES (DEFAULT, 'admin@gmail.com', '2023-01-01 00:00:00')
  RETURNING "email_id" INTO email_id;

  INSERT INTO users.admins ("admin_id", "first_name", "last_name", "status", "created_at", "updated_at")
  VALUES (DEFAULT, 'admin', 'Doe', 'active', '2023-01-01 00:00:00', '2023-01-01 00:00:00')
  RETURNING "admin_id" INTO admin_id;

  INSERT INTO users.admin_accounts ("admin_id", "email_id", "password", "created_at", "updated_at")
  VALUES (admin_id, email_id, '$2a$10$jMi7MIm2ahA/Om/EpztbDexrMSFizl.dmJjDv1OpvU2sWPOWyfeoC', '2023-01-01 00:00:00', '2023-01-01 00:00:00');

  INSERT INTO users.admins_roles ("admin_id", "role_id", "created_at", "updated_at")
  VALUES (admin_id, root_id, '2023-01-01 00:00:00', '2023-01-01 00:00:00');

  return admin_id;
END;
$$ LANGUAGE plpgsql;
-- #endregion