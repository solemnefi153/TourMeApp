-- Run by tools/local-setup.sh

DROP DATABASE IF EXISTS chameleon_development;
DROP DATABASE IF EXISTS chameleon_integration;

DROP OWNED BY migrations_user;
DROP ROLE IF EXISTS migrations_user;

DROP OWNED BY chameleon_admin;
DROP ROLE IF EXISTS chameleon_admin;

DROP OWNED BY chameleon_read;
DROP ROLE IF EXISTS chameleon_read;

DROP OWNED BY chameleon_write;
DROP ROLE IF EXISTS chameleon_write;


CREATE USER migrations_user WITH CREATEROLE INHERIT LOGIN PASSWORD ':PASS:';
ALTER USER migrations_user WITH SUPERUSER;

CREATE USER chameleon_admin WITH CREATEROLE INHERIT LOGIN PASSWORD ':PASS:';
ALTER USER chameleon_admin WITH SUPERUSER;

CREATE USER chameleon_integration_admin WITH CREATEROLE INHERIT LOGIN PASSWORD ':PASS:';
ALTER USER chameleon_integration_admin WITH SUPERUSER;

CREATE USER chameleon_development_admin WITH CREATEROLE INHERIT LOGIN PASSWORD ':PASS:';
ALTER USER chameleon_development_admin WITH SUPERUSER;

GRANT ALL PRIVILEGES ON SCHEMA public TO migrations_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO chameleon_admin;
GRANT ALL PRIVILEGES ON SCHEMA public TO chameleon_integration_admin;
GRANT ALL PRIVILEGES ON SCHEMA public TO chameleon_development_admin;


CREATE ROLE chameleon_look;
CREATE ROLE chameleon_upd;
CREATE USER chameleon_read   WITH INHERIT LOGIN PASSWORD ':PASS:' IN ROLE chameleon_look;
CREATE USER chameleon_write  WITH INHERIT LOGIN PASSWORD ':PASS:' IN ROLE chameleon_upd;

ALTER USER chameleon_read   VALID UNTIL 'infinity';
ALTER USER chameleon_write  VALID UNTIL 'infinity';

CREATE ROLE chameleon_integration_look;
CREATE ROLE chameleon_integration_upd;
CREATE USER chameleon_integration_read   WITH INHERIT LOGIN PASSWORD ':PASS:' IN ROLE chameleon_integration_look;
CREATE USER chameleon_integration_write  WITH INHERIT LOGIN PASSWORD ':PASS:' IN ROLE chameleon_integration_upd;

ALTER USER chameleon_integration_read   VALID UNTIL 'infinity';
ALTER USER chameleon_integration_write  VALID UNTIL 'infinity';

CREATE ROLE chameleon_development_look;
CREATE ROLE chameleon_development_upd;
CREATE USER chameleon_development_read   WITH INHERIT LOGIN PASSWORD ':PASS:' IN ROLE chameleon_development_look;
CREATE USER chameleon_development_write  WITH INHERIT LOGIN PASSWORD ':PASS:' IN ROLE chameleon_development_upd;

ALTER USER chameleon_development_read   VALID UNTIL 'infinity';
ALTER USER chameleon_development_write  VALID UNTIL 'infinity';

GRANT chameleon_integration_look TO chameleon_look;
GRANT chameleon_development_look TO chameleon_look;
GRANT chameleon_integration_upd TO chameleon_upd;
GRANT chameleon_development_upd TO chameleon_upd;

ALTER ROLE migrations_user
 SET search_path = "public","chameleon";

CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Roles/Users — these should all exist on the instance.

ALTER ROLE chameleon_write SET statement_timeout = 2000;
ALTER ROLE chameleon_read  SET statement_timeout = 2000;

ALTER ROLE chameleon_integration_read SET statement_timeout = 2000;
ALTER ROLE chameleon_integration_write  SET statement_timeout = 2000;

ALTER ROLE chameleon_development_read SET statement_timeout = 2000;
ALTER ROLE chameleon_development_write  SET statement_timeout = 2000;

CREATE DATABASE chameleon_development OWNER = migrations_user;
CREATE DATABASE chameleon_integration OWNER = migrations_user;