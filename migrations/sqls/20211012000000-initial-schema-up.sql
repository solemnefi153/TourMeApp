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