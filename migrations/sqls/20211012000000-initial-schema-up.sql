-- Function to get the user details for executing the migration sqls
CREATE OR REPLACE FUNCTION public.show_user (rolename character)
    RETURNS character
    LANGUAGE 'plpgsql'
    COST 100
    AS $BODY$
DECLARE
    db_name character (50);
BEGIN
    SELECT
        current_database() INTO db_name;
    IF rolename = 'admin' THEN
        RETURN db_name || '_admin';
    elsif rolename = 'ro' THEN
        RETURN db_name || '_read';
    elsif rolename = 'rw' THEN
        RETURN db_name || '_write';
    elsif rolename = 'ddl' THEN
        RETURN CURRENT_USER;
    elsif rolename = 'cron' THEN
        RETURN db_name || '_cron_rw';
    END IF;
END;
$BODY$;

GRANT ALL PRIVILEGES ON FUNCTION public.show_user TO migrations_user;

-- Extensions should live outside the schema
DO $$
BEGIN
    EXECUTE 'set search_path TO ' || current_database() || ', public';
END;
$$;

-- Schema

-- sample customers table
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    created_at BIGINT DEFAULT EXTRACT(EPOCH FROM  now())
);

-- Permissions
DO $$
BEGIN
-- Start Permissions
    EXECUTE 'GRANT SELECT ON customers TO ' || current_database() || '_look';
    EXECUTE 'GRANT DELETE, INSERT, SELECT, UPDATE ON customers TO ' || current_database() || '_upd';
    EXECUTE 'GRANT USAGE ON SEQUENCE customers_customer_id_seq TO ' || current_database() || '_upd';
    EXECUTE 'ALTER TABLE customers OWNER TO ' || show_user ('admin');
-- --End Change Ownership
END;
$$;