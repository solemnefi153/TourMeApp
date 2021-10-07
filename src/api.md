FORMAT: 1A
HOST: https://chameleon.api.hbo.com

# Hurley-Chameleon API

# Group Overview

The Hurley-Chameleon API is Mock service to perform load test on the database to benchmark performance.

# Healthcheck
## Health Check [/healthcheck]
Checks if service is UP or not

### Run health check [GET]
Returns the result of the health check

+ Response 200 (text/plain; charset=utf-8)

# Other routes setup for example from The Generator
## Send an example request [/example/:pathParamValue]
This is an example request to get you started with how to do more interesting things than GETs.

### Send an example object [POST]
Send an example object, which currently has the schema defined in exampleRequestSchema.json.

+ Response 202 (text/html; charset=utf-8)

# Group Hurley-Loader
Default Routes provided by Hurley-Loader
# Ready
## Ready [/ready]
Comes with Hurley-Loader. Skips most middleware.
Returns the result of the health check

+ Response 200 (text/plain; charset=utf-8)

### Check if READY [GET]

+ Response 200
