-- Refresh db
\i db/menu/00_drop.sql
\i db/users/00_drop.sql

-- users schema
\i db/users/01_schema.sql
\i db/users/02_enums.sql
\i db/users/03_tables.sql
\i db/users/04_views.sql
\i db/users/05_triggers.sql

-- menu schema
\i db/menu/01_schema.sql
\i db/menu/02_enums.sql
\i db/menu/03_tables.sql
\i db/menu/04_views.sql

-- populate db
\i db/menu/05_data.sql