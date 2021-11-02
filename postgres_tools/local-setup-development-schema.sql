DROP SCHEMA IF EXISTS chameleon_development CASCADE;
CREATE SCHEMA IF NOT EXISTS chameleon_development;
GRANT USAGE ON SCHEMA chameleon_development TO chameleon_look;
GRANT USAGE ON SCHEMA chameleon_development TO chameleon_upd;
GRANT ALL PRIVILEGES ON SCHEMA chameleon_development TO migrations_user;

GRANT USAGE ON SCHEMA chameleon_development TO chameleon_look;
GRANT USAGE ON SCHEMA chameleon_development TO chameleon_upd;

ALTER ROLE chameleon_read  SET search_path = "chameleon_development";
ALTER ROLE chameleon_write SET search_path = "chameleon_development";
ALTER ROLE migrations_user
 SET search_path = "public","chameleon_development";