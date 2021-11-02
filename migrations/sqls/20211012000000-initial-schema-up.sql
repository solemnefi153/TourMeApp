-- Extensions should live outside the schema
DO $$
BEGIN
    EXECUTE 'set search_path TO ' || current_database() || ', public';
END;
$$;

-- Schema

-- sample customers table
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    hurley_account_id TEXT NOT NULL,
    platform_tenant_code VARCHAR(20) NOT NULL,
    created_at BIGINT DEFAULT EXTRACT(EPOCH FROM  now())
);

-- sample index
CREATE UNIQUE INDEX chameleon_customer_hurley_account_id
    ON customers USING btree (hurley_account_id, platform_tenant_code);

-- sample cards database
CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER,
    card_type VARCHAR(16) NOT NULL,
    last_four VARCHAR(4),
    association VARCHAR(16),
    created_at BIGINT DEFAULT EXTRACT(EPOCH FROM  now())
);

ALTER TABLE cards
ADD CONSTRAINT fk_customer_card
FOREIGN KEY (customer_id) REFERENCES customers(id);

CREATE INDEX customer_card_idx
    ON cards USING btree (customer_id);

-- Permissions
DO $$
BEGIN
-- Start Permissions
    EXECUTE 'GRANT SELECT ON customers TO ' || current_database() || '_look';
    EXECUTE 'GRANT SELECT ON cards TO ' || current_database() || '_look';
    EXECUTE 'GRANT DELETE, INSERT, SELECT, UPDATE ON customers TO ' || current_database() || '_upd';
    EXECUTE 'GRANT DELETE, INSERT, SELECT, UPDATE ON cards TO ' || current_database() || '_upd';
    EXECUTE 'GRANT USAGE ON SEQUENCE customers_id_seq TO ' || current_database() || '_upd';
    EXECUTE 'GRANT USAGE ON SEQUENCE cards_id_seq TO ' || current_database() || '_upd';
    EXECUTE 'ALTER TABLE customers OWNER TO ' || show_user ('admin');
    EXECUTE 'ALTER TABLE cards OWNER TO ' || show_user ('admin');
-- --End Change Ownership
END;
$$;