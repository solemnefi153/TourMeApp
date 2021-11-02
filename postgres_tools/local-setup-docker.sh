#!/usr/bin/env bash

BASEDIR=$(dirname $0)

psql -h chameleon-postgres -U postgres -d postgres -f $BASEDIR/local-setup-common.sql -v PASS=$VAULT_PASSWORD &&
psql -h chameleon-postgres -U postgres -d chameleon_development -f $BASEDIR/local-setup-development-schema.sql &&
psql -h chameleon-postgres -U postgres -d chameleon_development -f $BASEDIR/local-setup-permission.sql &&
psql -h chameleon-postgres -U postgres -d chameleon_development -f $BASEDIR/local-function.sql &&
psql -h chameleon-postgres -U postgres -d chameleon_integration -f $BASEDIR/local-setup-integration-schema.sql &&
psql -h chameleon-postgres -U postgres -d chameleon_integration -f $BASEDIR/local-setup-permission.sql &&
psql -h chameleon-postgres -U postgres -d chameleon_integration -f $BASEDIR/local-function.sql