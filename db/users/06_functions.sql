-- #region get_refresh_token
CREATE OR REPLACE FUNCTION users.get_refresh_token(p_email VARCHAR, p_token_id INTEGER)
RETURNS TABLE (
  is_admin BOOLEAN,
  user_id INTEGER,
  email VARCHAR,
  status VARCHAR,
  token_id INTEGER,
  token VARCHAR,
  expires_at TIMESTAMP,
  created_at TIMESTAMP
) AS $$
BEGIN
  IF p_email IS NULL OR p_token_id IS NULL THEN
    RAISE EXCEPTION 'p_email AND p_token_id cannot be null';
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
      a.status::VARCHAR AS status,
      art.token_id AS token_id,
      art.token AS token,
      art.expires_at AS expires_at,
      art.created_at AS created_at
    FROM users.emails e
    JOIN users.admin_accounts aa ON aa.email_id = e.email_id AND e.email = p_email
    JOIN users.admins a ON a.admin_id = aa.admin_id
    JOIN users.admin_refresh_tokens art ON art.admin_id = aa.admin_id
    WHERE art.token_id = p_token_id;

  ELSE
    RETURN QUERY
    SELECT
      false AS is_admin,
      c.customer_id AS user_id,
      e.email AS email,
      c.status::VARCHAR AS status,
      crt.token_id AS token_id,
      crt.token AS token,
      crt.expires_at AS expires_at,
      crt.created_at AS created_at
    FROM users.emails e
    JOIN users.customer_emails ce ON ce.email_id = e.email_id AND e.email = p_email
    JOIN users.customers c ON c.customer_id = ce.customer_id
    JOIN users.customer_refresh_tokens crt ON crt.customer_id = ce.customer_id
    WHERE crt.token_id = p_token_id;
  END IF;
END;
$$ LANGUAGE plpgsql;
-- #endregion

-- #region get_admin
CREATE OR REPLACE FUNCTION users.get_admin(p_admin_id INTEGER)
RETURNS TABLE (
  user_id INTEGER,
  first_name VARCHAR,
  last_name VARCHAR,
  email VARCHAR,
  status users.enum_admin_status,
  roles VARCHAR[]
) AS $$
BEGIN
  IF p_admin_id IS NULL THEN
    RAISE EXCEPTION 'p_admin_id cannot be null';
  END IF;

  RETURN QUERY
    SELECT
      a.admin_id AS user_id,
      a.first_name AS first_name,
      a.last_name AS last_name,
      e.email AS email,
      a.status AS status,
      array_agg(DISTINCT r.name) AS roles
    FROM users.admins a
    JOIN users.admin_accounts aa ON aa.admin_id = a.admin_id AND a.admin_id = p_admin_id
    JOIN users.emails e ON e.email_id = aa.email_id
    JOIN users.admins_roles ar ON ar.admin_id = a.admin_id
    JOIN users.roles r ON r.role_id = ar.role_id
    GROUP BY a.admin_id, a.first_name, a.last_name, e.email, a.status;
END;
$$ LANGUAGE plpgsql;
-- #endregion

-- #region get_customer
CREATE OR REPLACE FUNCTION users.get_customer(p_customer_id INTEGER)
RETURNS TABLE (
  user_id INTEGER,
  first_name VARCHAR,
  last_name VARCHAR,
  email VARCHAR,
  status users.enum_customer_status,
  roles TEXT[]
) AS $$
BEGIN
  IF p_customer_id IS NULL THEN
    RAISE EXCEPTION 'p_customer_id cannot be null';
  END IF;

  RETURN QUERY
    SELECT
      c.customer_id AS user_id,
      c.first_name AS first_name,
      c.last_name AS last_name,
      e.email AS email,
      c.status AS status,
      ARRAY['customer'] AS roles
    FROM users.customers c
    JOIN users.customer_emails ce ON ce.customer_id = c.customer_id AND ce.customer_id = p_customer_id
    JOIN users.emails e on e.email_id = ce.email_id;
END;
$$ LANGUAGE plpgsql;
-- #endregion

-- #region get_user_by_email
CREATE OR REPLACE FUNCTION users.get_user_by_email(p_email VARCHAR)
RETURNS TABLE (
  is_admin BOOLEAN,
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
      true AS is_admin,
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
      false AS is_admin,
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
-- #endregion

-- #region get_user_with_password
CREATE OR REPLACE FUNCTION users.get_user_with_password(p_email VARCHAR)
RETURNS TABLE (
  is_admin BOOLEAN,
  user_id INTEGER,
  first_name VARCHAR,
  last_name VARCHAR,
  email VARCHAR,
  password VARCHAR,
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
      true AS is_admin,
      a.admin_id AS user_id,
      a.first_name AS first_name,
      a.last_name AS last_name,
      e.email AS email,
      aa.password AS password,
      a.status::VARCHAR AS status,
      array_agg(DISTINCT r.name) AS roles
    FROM users.emails e
    JOIN users.admin_accounts aa ON aa.email_id = e.email_id AND e.email = p_email
    JOIN users.admins a ON a.admin_id = aa.admin_id
    JOIN users.admins_roles AS ar ON ar.admin_id = a.admin_id
    JOIN users.roles r ON r.role_id = ar.role_id
    GROUP BY a.admin_id, a.first_name, a.last_name, e.email, aa.password, a.status;

  ELSE
    RETURN QUERY
    SELECT
      false AS is_admin,
      c.customer_id AS user_id,
      c.first_name AS first_name,
      c.last_name AS last_name,
      e.email AS email,
      cp.password AS password,
      c.status::VARCHAR AS status,
      ARRAY['customer']::VARCHAR[] AS roles
    FROM users.emails e
    JOIN users.customer_emails ce ON ce.email_id = e.email_id AND e.email = p_email
    JOIN users.customers c ON c.customer_id = ce.customer_id
    JOIN users.customer_passwords cp ON cp.customer_id = c.customer_id;
  END IF;
END;
$$ LANGUAGE plpgsql;
-- #endregion

-- #region get_customer_from_payload
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
-- #endregion

-- #region get_user_for_social_authentication
CREATE OR REPLACE FUNCTION users.get_user_for_social_authentication(p_email VARCHAR, p_identity_id VARCHAR, p_provider users.enum_customer_identities_provider)
RETURNS TABLE (
  is_admin BOOLEAN,
  identity_exists BOOLEAN,
  user_id INTEGER,
  first_name VARCHAR,
  last_name VARCHAR,
  email VARCHAR,
  status VARCHAR,
  roles VARCHAR[]
) AS $$
BEGIN
  IF p_email IS NULL OR p_identity_id IS NULL OR p_provider IS NULL THEN
    RAISE EXCEPTION 'p_email and p_identity_id and p_provider cannot be null';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM users.emails e
    JOIN users.admin_accounts aa ON aa.email_id = e.email_id AND e.email = p_email
  ) THEN
    RETURN QUERY
    SELECT 
      true AS is_admin,
      false AS identity_exists,
      a.admin_id AS user_id,
      a.first_name AS first_name,
      a.last_name AS last_name,
      e.email AS email,
      a.status::VARCHAR AS status,
      array_agg(DISTINCT r.name) AS roles
    FROM users.emails e
    JOIN users.admin_accounts aa ON aa.email_id = e.email_id AND e.email = p_email
    JOIN users.admins a ON a.admin_id = aa.admin_id
    JOIN users.admins_roles ar ON ar.admin_id = a.admin_id
    JOIN users.roles r ON r.role_id = ar.role_id
    GROUP BY a.admin_id, a.first_name, a.last_name, e.email, a.status;

  ELSE
    RETURN QUERY
    SELECT
      false AS is_admin,
      CASE WHEN ci.identity_id IS NOT NULL THEN TRUE ELSE FALSE END AS identity_exists,
      c.customer_id AS user_id,
      c.first_name AS first_name,
      c.last_name AS last_name,
      e.email AS email,
      c.status::VARCHAR AS status,
      ARRAY['customer']::VARCHAR[] AS roles
    FROM users.emails e
    JOIN users.customer_emails ce ON ce.email_id = e.email_id
    JOIN users.customers c ON c.customer_id = ce.customer_id
    LEFT JOIN users.customer_identities ci ON ci.customer_id = c.customer_id
    WHERE e.email = p_email OR (ci.identity_id = p_identity_id AND ci.provider = p_provider);
  END IF;
END;
$$ LANGUAGE plpgsql;
-- #endregion

-- #region get_user_for_recovery
CREATE OR REPLACE FUNCTION users.get_user_for_recovery(p_email VARCHAR)
RETURNS TABLE (
  is_admin BOOLEAN,
  has_password BOOLEAN,
  user_id INTEGER,
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
      true AS has_password,
      a.admin_id AS user_id,
      a.status::VARCHAR AS status
    FROM users.emails e
    JOIN users.admin_accounts aa ON aa.email_id = e.email_id AND e.email = p_email
    JOIN users.admins a ON a.admin_id = aa.admin_id;

  ELSE
    RETURN QUERY
    SELECT
      false AS is_admin,
      CASE WHEN cp.password IS NOT NULL THEN TRUE ELSE FALSE END AS has_password,
      c.customer_id AS user_id,
      c.status::VARCHAR AS status
    FROM users.emails e
    JOIN users.customer_emails ce ON ce.email_id = e.email_id AND e.email = p_email
    JOIN users.customers c ON c.customer_id = ce.customer_id
    LEFT JOIN users.customer_passwords cp ON cp.customer_id = c.customer_id;
  END IF;
END;
$$ LANGUAGE plpgsql;
-- #endregion

-- #region get_customer_profile
CREATE OR REPLACE FUNCTION users.get_customer_profile(p_customer_id INTEGER)
RETURNS TABLE (
  "firstName" VARCHAR,
  "lastName" VARCHAR,
  "phone" JSONB,
  email JSONB,
  "hasPassword" BOOLEAN,
  "authProviders" users.enum_customer_identities_provider[],
  addresses JSONB
) AS $$
BEGIN
  IF p_customer_id IS NULL THEN
    RAISE EXCEPTION 'p_customer_id cannot be null';
  END IF;

  RETURN QUERY
  SELECT
    c.first_name as "firstName",
    c.last_name as "lastName",
    jsonb_build_object(
      'number', phone.phone_number,
      'isVerified', CASE WHEN c_phone.status = 'active' THEN true ELSE false END
    ) AS "phone",
    jsonb_build_object(
      'address', email.email,
      'isVerified', CASE WHEN c.status = 'pending' THEN false ELSE true END
    ) AS "email",
    CASE WHEN c_password.password IS NOT NULL 
      THEN true 
      ELSE false 
    END AS "hasPassword",
    ARRAY(
      SELECT provider
      FROM users.customer_identities i
      WHERE i.customer_id = p_customer_id
    ) AS "authProviders",
    (
      SELECT 
        jsonb_agg(jsonb_build_object(
          'addressLine1', a.address_line1,
          'addressLine2', COALESCE(a.address_line2, ''),
          'city', a.city,
          'state', a.state,
          'zipCode', a.zip_code
        ))
      FROM users.customer_addresses a
      WHERE a.customer_id = p_customer_id
    ) AS addresses
  FROM
    users.customers c
  JOIN 
    users.customer_emails ce ON ce.customer_id = c.customer_id AND c.customer_id = p_customer_id
  JOIN
    users.emails email ON email.email_id = ce.email_id
  LEFT JOIN
    users.customer_passwords c_password ON c_password.customer_id = c.customer_id
  LEFT JOIN
    users.customer_phones c_phone ON c_phone.customer_id = c.customer_id
  LEFT JOIN
    users.phones phone ON phone.phone_id = c_phone.phone_id;
END;
$$ LANGUAGE plpgsql;
-- #endregion

-- #region get_customer_for_revoke_social_auth
CREATE OR REPLACE FUNCTION users.get_customer_for_revoke_social_auth(p_customer_id INTEGER, p_provider users.enum_customer_identities_provider)
RETURNS TABLE (
  email VARCHAR,
  "passwordExists" BOOLEAN,
  "otherIdentities" users.enum_customer_identities_provider[]
) AS $$
BEGIN
  IF p_customer_id IS NULL OR p_provider IS NULL THEN
    RAISE EXCEPTION 'p_customer_id and p_provider cannot be null';
  END IF;

  RETURN QUERY
  SELECT
    e.email AS email,
    CASE WHEN cp.customer_id IS NOT NULL THEN TRUE ELSE FALSE END AS "passwordExists",
    ARRAY(
      SELECT provider
      FROM users.customer_identities i
      WHERE i.customer_id = c.customer_id AND i.provider <> p_provider
    ) AS "otherIdentities"
  FROM
    users.customers c
  JOIN 
    users.customer_emails ce ON ce.customer_id = c.customer_id AND c.customer_id = p_customer_id
  JOIN
    users.emails e ON e.email_id = ce.email_id
  LEFT JOIN
    users.customer_passwords cp ON cp.customer_id = c.customer_id;
END;
$$ LANGUAGE plpgsql;
-- #endregion