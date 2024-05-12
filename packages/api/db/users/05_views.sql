CREATE VIEW users.basic_user_details AS
SELECT
  a.admin_id AS user_id,
  a.first_name,
  a.last_name,
  e.email AS email,
  a.status::VARCHAR,
  array_agg(DISTINCT r.name) AS roles
FROM users.admins a
JOIN users.admin_accounts aa ON aa.admin_id = a.admin_id
JOIN users.emails e ON e.email_id = aa.email_id
JOIN users.admins_roles ar ON ar.admin_id = a.admin_id
JOIN users.roles r ON r.role_id = ar.role_id
GROUP BY a.admin_id, a.first_name, a.last_name, e.email, a.status
UNION ALL
SELECT
  c.customer_id AS user_id,
  c.first_name,
  c.last_name,
  e.email,
  c.status::VARCHAR,
  ARRAY['customer'] AS roles
FROM users.customers c
JOIN users.customer_emails AS ce ON c.customer_id = ce.customer_id
JOIN users.emails e ON e.email_id = ce.email_id;

CREATE VIEW users.all_refresh_tokens AS
SELECT 
  true AS is_admin,
  art.admin_id AS user_id,
  ae.email AS email,
  art.token AS token,
  art.expires_at AS expires_at,
  art.created_at AS created_at
FROM users.admin_refresh_tokens art
JOIN users.admin_accounts aa ON aa.admin_id = art.admin_id
JOIN users.emails ae ON ae.email_id = aa.email_id
UNION ALL
SELECT
  false AS is_admin,
  crt.customer_id AS user_id,
  e.email AS email,
  crt.token AS token,
  crt.expires_at AS expires_at,
  crt.created_at AS created_at
FROM users.customer_refresh_tokens crt
JOIN users.customer_emails ce ON ce.customer_id = crt.customer_id
JOIN users.emails e ON e.email_id = ce.email_id;