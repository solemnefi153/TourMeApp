DROP SCHEMA IF EXISTS chameleon_integration CASCADE;
CREATE SCHEMA IF NOT EXISTS chameleon_integration;
GRANT USAGE ON SCHEMA chameleon_integration TO chameleon_look;
GRANT USAGE ON SCHEMA chameleon_integration TO chameleon_upd;
GRANT ALL PRIVILEGES ON SCHEMA chameleon_integration TO migrations_user;

GRANT USAGE ON SCHEMA chameleon_integration TO chameleon_look;
GRANT USAGE ON SCHEMA chameleon_integration TO chameleon_upd;

ALTER ROLE chameleon_read  SET search_path = "chameleon_integration";
ALTER ROLE chameleon_write SET search_path = "chameleon_integration";
ALTER ROLE migrations_user
 SET search_path = "public","chameleon_integration";