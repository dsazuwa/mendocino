-- Create views
CREATE MATERIALIZED VIEW users.user_type_view AS
SELECT
  CASE
    WHEN EXISTS (
      SELECT 1 FROM users.admins WHERE admin_id = aa.admin_id
    ) THEN aa.admin_id
    ELSE ca.customer_id
  END AS "userId",
  EXISTS (
    SELECT 1 FROM users.admins WHERE admin_id = aa.admin_id
  ) AS "isAdmin",
  e.email AS email
FROM
  users.admin_accounts aa
FULL JOIN
  users.customer_accounts ca ON ca.email_id = aa.email_id
JOIN
  users.emails e ON e.email_id = aa.email_id OR e.email_id = ca.email_id;

CREATE INDEX idx_user_type_view_email ON users.user_type_view ("email");
CREATE INDEX idx_user_type_view_userId ON users.user_type_view ("userId");
