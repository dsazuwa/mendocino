CREATE UNIQUE INDEX idx_email_lower_unique ON users.emails (LOWER(email));
CREATE UNIQUE INDEX idx_role_lower_unique ON users.roles (LOWER(name));