   
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