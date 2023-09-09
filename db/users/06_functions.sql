CREATE OR REPLACE FUNCTION users.get_refresh_token(p_email VARCHAR, p_token VARCHAR)
RETURNS TABLE (
  is_admin BOOLEAN,
  user_id INTEGER,
  email VARCHAR,
  status VARCHAR,
  token VARCHAR,
  expires_at TIMESTAMP,
  created_at TIMESTAMP
) AS $$
BEGIN
  ASSERT p_email IS NOT NULL, 'p_email cannot be null';
  ASSERT LENGTH(p_token) > 0, 'p_token cannot be empty';

  IF EXISTS (
    SELECT 1
    FROM users.emails e
    JOIN users.admin_accounts aa ON aa.email_id = e.email_id AND e.email = p_email
  ) THEN
    RETURN QUERY
    SELECT 
      true AS is_admin,
      a.admin_id AS user_id,
      e.email AS email,
      a.status::VARCHAR AS status,
      art.token AS token,
      art.expires_at AS expires_at,
      art.created_at AS created_at
    FROM users.emails e
    JOIN users.admin_accounts aa ON aa.email_id = e.email_id AND e.email = p_email
    JOIN users.admins a ON a.admin_id = aa.admin_id
    JOIN users.admin_refresh_tokens art ON art.admin_id = aa.admin_id
    WHERE art.token = p_token;

  ELSE
    RETURN QUERY
    SELECT
      false AS is_admin,
      c.customer_id AS user_id,
      e.email AS email,
      c.status::VARCHAR AS status,
      crt.token AS token,
      crt.expires_at AS expires_at,
      crt.created_at AS created_at
    FROM users.emails e
    JOIN users.customer_emails ce ON ce.email_id = e.email_id AND e.email = p_email
    JOIN users.customers c ON c.customer_id = ce.customer_id
    JOIN users.customer_refresh_tokens crt ON crt.customer_id = ce.customer_id
    WHERE crt.token = p_token;

  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION users.get_user_by_email(p_email VARCHAR)
RETURNS TABLE (
  user_id INTEGER,
  first_name VARCHAR,
  last_name VARCHAR,
  email VARCHAR,
  status VARCHAR,
  roles VARCHAR[]
) AS $$
BEGIN
  IF p_email IS NULL THEN
    RAISE EXCEPTION 'p_email cannot be null';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM users.emails e
    JOIN users.admin_accounts aa ON aa.email_id = e.email_id AND e.email = p_email
  ) THEN
    RETURN QUERY
    SELECT
      a.admin_id AS user_id,
      a.first_name AS first_name,
      a.last_name AS last_name,
      e.email AS email,
      a.status::VARCHAR AS status,
      array_agg(DISTINCT r.name) AS roles
    FROM (
      SELECT *
      FROM users.emails e
      WHERE e.email = p_email
    ) AS e
    JOIN users.admin_accounts AS aa ON aa.email_id = e.email_id
    JOIN users.admins AS a ON a.admin_id = aa.admin_id
    JOIN users.admins_roles AS ar ON ar.admin_id = a.admin_id
    JOIN users.roles r ON r.role_id = ar.role_id
    GROUP BY a.admin_id, a.first_name, a.last_name, e.email, a.status;

  ELSE
    RETURN QUERY
    SELECT
      c.customer_id AS user_id,
      c.first_name AS first_name,
      c.last_name AS last_name,
      e.email AS email,
      c.status::VARCHAR AS status,
      ARRAY['customer']::VARCHAR[] AS roles
    FROM (
      SELECT *
      FROM users.emails e
      WHERE e.email = p_email
    ) AS e
    JOIN users.customer_emails AS ce ON ce.email_id = e.email_id
    JOIN users.customers AS c ON c.customer_id = ce.customer_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION users.get_user_with_password(p_email VARCHAR)
RETURNS TABLE (
  is_admin BOOLEAN,
  user_id INTEGER,
  email VARCHAR,
  password VARCHAR,
  status VARCHAR
) AS $$
BEGIN
  IF p_email IS NULL THEN
    RAISE EXCEPTION 'p_email cannot be null';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM users.emails e
    JOIN users.admin_accounts aa ON aa.email_id = e.email_id AND e.email = p_email
  ) THEN
    RETURN QUERY
    SELECT 
      true AS is_admin,
      a.admin_id AS user_id,
      e.email AS email,
      aa.password AS password,
      a.status::VARCHAR AS status
    FROM users.emails e
    JOIN users.admin_accounts aa ON aa.email_id = e.email_id AND e.email = p_email
    JOIN users.admins a ON a.admin_id = aa.admin_id;

  ELSE
    RETURN QUERY
    SELECT
      false AS is_admin,
      c.customer_id AS user_id,
      e.email AS email,
      cp.password AS password,
      c.status::VARCHAR AS status
    FROM users.emails e
    JOIN users.customer_emails ce ON ce.email_id = e.email_id AND e.email = p_email
    JOIN users.customers c ON c.customer_id = ce.customer_id
    JOIN users.customer_passwords cp ON cp.customer_id = c.customer_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION users.get_customer_from_payload(p_email VARCHAR, p_provider users.enum_customer_identities_provider)
RETURNS TABLE (
  user_id INTEGER,
  first_name VARCHAR,
  last_name VARCHAR,
  email VARCHAR,
  status users.enum_customer_status,
  roles TEXT[]
) AS $$
BEGIN
  IF p_email IS NULL OR p_provider IS NULL THEN
    RAISE EXCEPTION 'p_email and p_provider cannot be null';
  END IF;

  RETURN QUERY
    SELECT
      c.customer_id AS user_id,
      c.first_name AS first_name,
      c.last_name AS last_name,
      e.email AS email,
      c.status AS status,
      ARRAY['customer'] AS roles
    FROM
      users.emails e
    JOIN
      users.customer_emails ce ON ce.email_id = e.email_id AND e.email = p_email
    JOIN
      users.customers c ON c.customer_id = ce.customer_id
    JOIN
      users.customer_identities ci ON ci.customer_id = c.customer_id AND ci.provider = p_provider;
END;
$$ LANGUAGE plpgsql;
