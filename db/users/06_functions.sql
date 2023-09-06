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

  -- Check if the user_id exists in admin accounts
  IF EXISTS (
    SELECT 1
    FROM users.emails e
    JOIN users.admin_accounts aa ON aa.email_id = e.email_id AND e.email = p_email
  ) THEN
    RETURN QUERY
    SELECT 
      true AS is_admin,
      art.admin_id AS user_id,
      ae.email AS email,
      aa.status::VARCHAR AS status,
      art.token AS token,
      art.expires_at AS expires_at,
      art.created_at AS created_at
    FROM users.emails e
    JOIN users.admin_accounts aa ON aa.email_id = e.email_id AND e.email = p_email
    JOIN users.admin_refresh_tokens art ON art.admin_id = aa.admin_id
    WHERE art.token = p_token;

  -- Check if the user_id exists in customer accounts
  ELSIF EXISTS (
    SELECT 1
    FROM users.emails e
    JOIN users.customer_accounts ca ON ca.email_id = e.email_id AND e.email = p_email
  ) THEN
    RETURN QUERY
    SELECT
      false AS is_admin,
      crt.customer_id AS user_id,
      ce.email AS email,
      ca.status::VARCHAR AS status,
      crt.token AS token,
      crt.expires_at AS expires_at,
      crt.created_at AS created_at
    FROM users.emails e
    JOIN users.customer_accounts ca ON ca.email_id = e.email_id AND e.email = p_email
    JOIN users.customer_refresh_tokens crt ON crt.customer_id = ca.customer_id
    WHERE crt.token = p_token;
  
  -- If the user_id doesn't exist in either admin or customer accounts
  ELSE RETURN;
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
  roles TEXT[]
) AS $$
BEGIN
  IF p_email IS NULL THEN
    RAISE EXCEPTION 'p_email cannot be null';
  END IF;

  RETURN QUERY
    SELECT
      CASE WHEN EXISTS ( SELECT 1 FROM users.admins WHERE admin_id = aa.admin_id )
        THEN aa.admin_id
        ELSE ca.customer_id
      END AS user_id,
      CASE WHEN EXISTS ( SELECT 1 FROM users.admins WHERE admin_id = aa.admin_id ) 
        THEN a.first_name
        ELSE c.first_name
      END AS first_name,
      CASE WHEN EXISTS ( SELECT 1 FROM users.admins WHERE admin_id = aa.admin_id )
        THEN a.last_name
        ELSE c.last_name
      END AS last_name,
      e.email AS email,
      CASE WHEN EXISTS ( SELECT 1 FROM users.admins WHERE admin_id = aa.admin_id )
        THEN aa.status::VARCHAR
        ELSE ca.status::VARCHAR
      END AS status,
      CASE WHEN EXISTS ( SELECT 1 FROM users.admins WHERE admin_id = aa.admin_id )
        THEN array_agg(DISTINCT r.name)
        ELSE ARRAY['customer']
      END AS roles
    FROM (
      SELECT *
      FROM users.emails e
      WHERE e.email = p_email
    ) as e
    LEFT JOIN
      users.admin_accounts aa ON aa.email_id = e.email_id
    LEFT JOIN 
      users.customer_accounts ca ON ca.email_id = e.email_id
    LEFT JOIN
      users.admins a ON a.admin_id = aa.admin_id
    LEFT JOIN
      users.admins_roles ar ON ar.admin_id = a.admin_id
    LEFT JOIN
      users.roles r ON r.role_id = ar.role_id
    LEFT JOIN
      users.customers c ON c.customer_id = ca.customer_id
    GROUP BY
      e.email, aa.admin_id, ca.customer_id, a.first_name, c.first_name, a.last_name, c.last_name, aa.status, ca.status;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION users.get_customer_from_payload(p_email VARCHAR, p_provider users.enum_customer_identities_provider)
RETURNS TABLE (
  user_id INTEGER,
  first_name VARCHAR,
  last_name VARCHAR,
  email VARCHAR,
  status users.enum_customer_accounts_status,
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
      ca.status AS status,
      ARRAY['customer'] AS roles
    FROM
      users.emails e
    JOIN
      users.customer_accounts ca ON ca.email_id = e.email_id AND e.email = p_email
    JOIN
      users.customers c ON c.customer_id = ca.customer_id
    JOIN
      users.customer_identities ci ON ci.customer_id = c.customer_id AND ci.provider = p_provider;
END;
$$ LANGUAGE plpgsql;
