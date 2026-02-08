-- RUN THIS IN PGADMIN 4 (Query Tool)
-- Connect to your local server 'PostgreSQL 16' (or similar) as user 'postgres'

-- 1. Create the application user (if not exists)
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'hms_admin') THEN
      CREATE ROLE hms_admin LOGIN PASSWORD 'ChangeMe123!'; -- We will update this later or matches your .env
   END IF;
END
$do$;

-- 2. Grant privileges
ALTER USER hms_admin CREATEDB;

-- 3. Create the database (if not exists)
-- Note: You usually cannot run CREATE DATABASE inside a transaction block in PgAdmin.
-- If this fails, just run: CREATE DATABASE hms_prod OWNER hms_admin; separately.
SELECT 'Please run: CREATE DATABASE hms_prod OWNER hms_admin; in a separate query window if not exists' as instruction;

-- 4. Grant schema access (Run this AFTER creating hms_prod and connecting TO hms_prod)
-- GRANT ALL ON SCHEMA public TO hms_admin;
