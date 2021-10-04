# Hurley-Chameleon

Mock service to perform load test on the database to benchmark performance. - `Hurley-Chameleon` is written for NodeJS with TypeScript.

# Metadata
- servicename: **chameleon**
- shortdescription: **Mock service to perform load test on the database to benchmark performance.**
- slack: ##dre-notifications (for notifications),TODO: #team's-slack-or-@groupname-goes-here
- VictorOps Routing Key: DA
- team: data-reliability
- email: (comma separated list)
- jenkinsjobs: [Hurley-Chameleon's Jenkins Folder](https://jenkins-pi3.hurley.hbo.com/job/chameleon/)
- logs: (link to Splunk or Kibana query)
- monitoring: (link to Grafana, AppDynamics or Circonus)
- bugs: (link to Jira or Asana ticket queue)
- backlog: (link to Jira or Asana backlog queue)

# *TODO* to finish your service
- [ ] Write the code :)
- [ ] Flip `READY_FOR_SNP` and `READY_FOR_RELEASE` to `true` to start deploying to those envs 
- [ ] Add staging tests

# Description

Please finish describing your service here!  Right now, it's just a rudimentary
framework to get your Hurley service off and running without your having to 
go through quite all the tedium of setting up all the boilerplate yourself. 

1.   Keep it brief, but provide as much information as necessary to be complete 
2.   Describe what the service does 


# Requirements and dependencies

1.   Software - versions should be defined in the makefile/dockerfile 
2.   Integration points - such as other services required 
3.   For running in different environments - locally, staging, snp, production


# Installing / Building / Setting up

1.   Include commands for how to install, build, and set up the service
     - The Generator already provided this, please make sure to keep this up to date in general.
2.   List common pitfalls encountered and how to work around them 
3.   List resources that might be helpful 

Building the code, running tests, performing code coverage analysis, etc. are
performed using either locally install `node/npm` or `docker`

You can build `Hurley-Chameleon` using the included [Makefile](./Makefile)-based Docker container.

-   `$ make` - To get a complete list of the make targets and their descriptions. 
-   `$ make configs` - To generate config files from the master config.
-   `$ make build` - To build the service locally (including the dev
    dependencies) using a Docker container. 

## More Setting Up Notes
### Git Submodules Setup
The [`Makefile`](./Makefile) uses `git-submodule` dependencies:
    [Hurley-Make](https://github.com/HBOCodeLabs/Hurley-Make),
 in order to get modules please run (or let the `make init` script do this for you):

	$ git submodule update --init --recursive

This will pull `checked-in` version of `Hurley-Make`. If you would like to pull the latest `Hurley-Make`, please run:

	$ git submodule update --init --recursive --remote

For a complete list of targets and brief description run:

    $ make

### Local Docker

*NOTE*: The build process uses a Docker container that is stored in [AWS
ECR](http://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html),
containing the Nodejs toolchain.  If you've never used an image from ECR
before, you may need to follow [these
instructions](https://github.com/HBOCodeLabs/Hurley-Docker/tree/doc-reference-1.0#configure-docker-for-aws-ecr-access)
in order to get your ECR access set up.

We are using `make` with a predefined set of `make-targets` and `make-rules`.

## Building locally

### Building and Testing

    $ make build

This target runs `npm ci` and `npm test`, which is equivalent to

    $ make npm-ci
    $ make npm-test

**Note**: `npm-test` is a composite (meta) target itself and contains of what is an equivalent of:

    $ make npm-run-script script=test
    $ make npm-run-script script=coverage
    $ npm-run-script script=static-analysis

### Build Docker Image
**Note**: Typically you want to generate docker image at the very end of your development iteration cycle, i.e. when you
 are ready to run `Integration Tests` in `Docker` mode.

    $ make docker

This will rebuild Nodejs project using `--production` dependencies only, in addition running all auxiliary targets
 (`blueprint`, etc.) needed for building the Docker image for this service

## Running
You can run this service using either `Local NPM` or `Local Docker` mode.

### Local NPM
      $ npm install
      $ npm run build
      $ npm run test
      $ npm run startdev
Make sure you have also ran `make configs` as detailed in the setting up section above.

To specify a different `NODE_ENV`,
```
$ NODE_ENV=foobar npm run start     # read config/foobar.json
```
You will need to have a corresponding `[NODE_ENV].json` in `config` directory in order for the app to start.

### Local Docker

    $ make start

This target will start up and configure all needed dependencies and will run service using `Nodejs` Docker image.
**Note**: you don't need to build docker image for this step, i.e. this call is analogous to `npm run startdev`, except
 `npm` is provided by a `Nodejs` Docker image

To stop service run:

    $ make stop

This will stop running service and all the dependency containers.

# Deployment

## TODO: complete me

1.   Note where and how configuration values are stored
     - *NOTE* if you are using [PiConfig](https://wiki.hbo.com/x/AxBYB), then this was setup by The Generator
     to use the [master.config.json](./master.config.json) and all configuration may be defined there.
2.   Describe how to deploy to different environments (locally, staging, snp, production) 
3.   Include any special notes for running this server with Kubernetes 
     (k8s) or Docker. Link to the Kubernetes README; do not duplicate 
     information.
4.   TODO (Important *NOTE* Before going to production):  One thing as required by the
       [Platform Infrastructure Team](https://github.com/orgs/HBOCodeLabs/teams/platform-infrastructure)
       is to be sure to flip the `READY_FOR_RELEASE` to `true` in the [`Makefile`](./Makefile).

#### Running
Initial run is automatically triggered as a result of the successful `Release` job.
However, you can re-run any given release branch to redeploy a particular version.


# Usage 

1.   Examples and sample calls - Write one (or a few) that infers how the 
     service works 
2.   List common use cases 
3.   Note where to see the API 
4.   Refer to examples in other services

# Testing 
    $ make build

This target runs `npm ci` and `npm test`, which is equivalent to

    $ make npm-ci
    $ make npm-test

**Note**: `npm-test` is a composite (meta) target itself and contains of what is an equivalent of:

    $ make npm-run-script script=test
    $ make npm-run-script script=coverage
    $ npm-run-script script=static-analysis

## Integration Tests
You can test and run the Hurley-Chameleon service using Docker container.

-   `$ make start` - Run the service in a Docker container. 
-   `$ make integration-test` - To run integration tests locally against the
    service running inside a Docker container. 

## Note on Jest Test Config
* Contrary to the default, in the testing library `jest`, we enable `clearMocks` for the newly generated code.
  This is done in order to reset mock function call count after each test is finished.
  Note that this does NOT revert the mocked entity to its original form, merely resets how many times it was called.
  For more information, (read jest documentation.)(https://jestjs.io/docs/en/configuration.html#clearmocks-boolean)

# Jenkins CI/CD

-   Jenkins [Project Folder](https://jenkins-pi3.hurley.hbo.com/job/chameleon/)
	- [CI/CD](https://jenkins-pi3.hurley.hbo.com/job/chameleon/job/continuous-integration/)
	- [HotFix PreProd](https://jenkins-pi3.hurley.hbo.com/job/chameleon/job/hotfix-preproduction/)
	- [HotFix Production](https://jenkins-pi3.hurley.hbo.com/job/chameleon/job/hotfix-production/)
	- [Pull Requests](https://jenkins-pi3.hurley.hbo.com/job/chameleon/job/pull-requests/)

*For more info*: Please visit [The Pi3 Wiki](https://wiki.hbo.com/x/nzn2B)
 or contact the @platforminfra team in #platform.

# Monitoring and alerting 

1.   Note applications used for monitoring/alerting, such as Grafana
     and Circonus  
     a.   Include links to dashboards 
2.   Describe where/how to find service logs.
     a.   Include links to ELK or Splunk queries that might help start 
          investigations (these might or might not be present in runbooks, 
          but do not replace runbooks)
3.   Include links to external components such as ELB, EC2, and other Amazon 
     web services 
4.   Include links to runbooks 

## Recommendations

-   Use ELK for querying logs via [Kibana](https://kibana.hurley.hbo.com/), 
    instead of Splunk. The ELK stack is configured automatically after
    setting up your service on Kubernetes. 
-   Use [Grafana dashboards](https://grafana.hurley.hbo.com/dashboard/)
    to monitor service health and performance. Reference existing dashboards
    for examples of how to set one up for your service.
    -   A template is provided for you to import to Grafana in the [dashboards folder](./dashboards).

# Developing
## Submitting a PR
### Before
Before submitting a pull request (PR), please ensure that:
- your commit messages are informative (no "fixes stuff" messages)
- all unit and integration tests pass

### During
After submitting the PR, a github webhook will cause Jenkins to run all the
tests and static analysis mentioned above, and will report the results.

Please ensure that your PR contains:
- a descriptive title
- a comprehensive description of the change(s), so that a reviewer has full context for the change

**Note** Merging a PR to `master` **Will Not** trigger a CI/CD deployment to *PRODUCTION*.
Roll out int *PRODUCTION* is handled by the Release phase of the project

### After
Finally, don't forget to delete your branch after you've merged your PR.  :-)
