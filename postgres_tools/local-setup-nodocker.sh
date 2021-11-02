
#!/usr/bin/env bash
# In local development we will only setup `chameleon_development` for running manual test, `chameleon_integration` is reserved for running test in docker

BASEDIR=$(dirname $0)
VAULT_PASSWORD=$(vault read  -address=$VAULT_ENDPOINT_WEST -field=ddl_password secret/hurley/chameleon/development/postgres/v1)

psql -h 127.0.0.1 -d postgres -f $BASEDIR/local-setup-common.sql -v PASS=$VAULT_PASSWORD &&
psql -h 127.0.0.1 -d chameleon_development -f $BASEDIR/local-setup-permission.sql &&
psql -h 127.0.0.1 -d chameleon_development -f $BASEDIR/local-setup-development-schema.sql &&
psql -h 127.0.0.1 -d chameleon_development -f $BASEDIR/local-function.sql &&
NODE_ENV=development postgres_tools/migrate up