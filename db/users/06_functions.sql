CREATE OR REPLACE FUNCTION users.get_refresh_token(p_user_id INTEGER, p_token VARCHAR)
RETURNS TABLE (
  is_admin BOOLEAN,
  user_id INTEGER,
  email VARCHAR,
  token VARCHAR,
  revoked BOOLEAN,
  expires_at TIMESTAMP,
  created_at TIMESTAMP
)
AS $$
BEGIN
  ASSERT p_user_id IS NOT NULL, 'p_user_id cannot be null';
  ASSERT LENGTH(p_token) > 0, 'p_token cannot be empty';

  -- Check if the user_id exists in admin accounts
  IF EXISTS (SELECT 1 FROM users.admin_accounts WHERE admin_id = p_user_id) THEN
    RETURN QUERY
    SELECT 
      true AS is_admin,
      art.admin_id AS user_id,
      ae.email AS email,
      art.token AS token,
      art.revoked AS revoked,
      art.expires_at AS expires_at,
      art.created_at AS created_at
    FROM users.admin_refresh_tokens art
    JOIN users.admin_accounts aa ON aa.admin_id = art.admin_id AND art.admin_id = p_user_id
    JOIN users.emails ae ON ae.email_id = aa.email_id
    WHERE art.token = p_token;

  -- Check if the user_id exists in customer accounts
  ELSIF EXISTS (SELECT 1 FROM users.customer_accounts WHERE customer_id = p_user_id) THEN
    RETURN QUERY
    SELECT
      false AS is_admin,
      crt.customer_id AS user_id,
      ce.email AS email,
      crt.token AS token,
      crt.revoked AS revoked,
      crt.expires_at AS expires_at,
      crt.created_at AS created_at
    FROM users.customer_refresh_tokens crt
    JOIN users.customer_accounts ca ON ca.customer_id = crt.customer_id AND crt.customer_id = p_user_id
    JOIN users.emails ce ON ce.email_id = ca.email_id
    WHERE crt.token = p_token;
  
  -- If the user_id doesn't exist in either admin or customer accounts
  ELSE RETURN;
  END IF;
END;
$$ LANGUAGE plpgsql;
