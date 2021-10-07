include Hurley-Make/Makefile.kubernetes
include Hurley-Make/Makefile.docker
include Hurley-Make/Makefile.node
include Hurley-Make/Makefile.common

ARTIFACT_MAINTAINER=data-reliability
SERVICE_PORT=3000
ARTIFACT_SERVICE_PORT=3000

STATSD_VERSION=0.8.0

# Flip these when you are ready to go to Production or SNP for your deployments
# Please contact @platforminfra if you have any questions
READY_FOR_RELEASE=false
READY_FOR_SNP=false

# For node-blueprint target
API_MD=src/api.md
SCHEMA_LOCATION=src/schemas

###################################################################################################
##     Building project
###################################################################################################

build: ensure-configs ## Metatarget for running build and unit test
	${INFO}"Building: $(call HLIGHT,$(ARTIFACT_NAME))..."
	make npm-ci
	make npm-run-script script=build
	make npm-test
	${OK}"...build success!"

docker: ensure-configs ## Build docker image for this service using current `node_modules`
	${INFO}"Building docker image: $(call HLIGHT,$(ARTIFACT_NAME):$(ARTIFACT_IMAGE_TAG))..."
	make npm-ci-production
	make npm-run-script script=build
	make node-blueprint
	make node-docker-prepare
	make docker-build image=$(ARTIFACT_NAME) tag=$(ARTIFACT_IMAGE_TAG)
	${OK}"...docker image built."

###################################################################################################
##     Running
###################################################################################################

start-dependencies: ## Starts service dependencies
	make docker-network-create
	make start-statsd version=$(STATSD_VERSION)

stop-dependencies: ## Stops service dependencies
	${INFO}"Stopping $(call HLIGHT,dependencies...)"
	make stop-statsd
	make docker-network-remove
	${OK}"...dependencies stopped."

start: stop ## Start (node-start) service for development
	${INFO}"Starting $(call HLIGHT,$(ARTIFACT_NAME))..."
	make start-dependencies
	make node-start
	${OK}"...started!"

service-test: ## Starts service in docker container, runs healthcheck and stops it
	make start-integration mode=docker
	make health-check
	make stop

show: ## Show running docker containers for a given service
	docker ps -f name=$(ARTIFACT_NAME)

stop: ## Stops running service
	${INFO}"Stopping $(call HLIGHT,$(ARTIFACT_CONTAINER_NAME))..."
	$(call docker-remove,$(ARTIFACT_CONTAINER_NAME))
	make stop-dependencies
	${OK}"...stopped."

# Usage: docker logs [-f --tail=100]
# See https://docs.docker.com/engine/reference/commandline/logs/ for a complete list of options list of options
logs: ## Prints service logs
	docker logs $(options) $(ARTIFACT_CONTAINER_NAME)

list-images: ## Shows docker images for this server
	docker images ${ARTIFACT_NAME}
	$(call ecr-get-registry,us-west-2)/${ARTIFACT_NAME} || true
	$(call ecr-get-registry,us-east-1)/${ARTIFACT_NAME} || true

# Integration Modes:
# - local: runs service using node build container and local project files. Typically used during local iterations.
# - docker: runs service using service's docker image. Typically used for build validation.
# Usage: make integration-test mode=[local,docker]
mode ?= local

# Usage: make start-integration [mode=integration_mode]
start-integration: stop ## Start service for integration using provided mode (defaults to local)
	make start-integration-$(mode)

start-integration-local: stop ## Start service for integration using local project files (npm run script=start)
	${INFO}"Starting $(call HLIGHT,$(ARTIFACT_NAME) integration) locally..."
	make start-dependencies
	make node-start NODE_ENV=integration
	make show
	${OK}"...started!"

start-integration-docker: stop ## Start service for integration using service's docker image
	${INFO}"Starting $(call HLIGHT,$(ARTIFACT_NAME) integration) with docker build..."
	make start-dependencies
	make node-docker-start NODE_ENV=integration node-volume-map='-v $(PROJECT_DIR)/config:$(APP_DIR)/config'
	make show
	${OK}"...started!"

# End-to-End integration test: setup, run-test, tear-down
define integration-test
	make -s start-integration-$(mode) && \
	make -s health-check && \
	make -s node-run-integration-test && \
	make -s stop
endef

# Run integration tests
integration-test:
	$(call integration-test)
	${OK}"Integration Tests passed."

run-integration-test: ## Run integration test
	make node-run-integration-test

#######################################################################################################################
##     Release and Deployment
#######################################################################################################################

# Release-prepare ## defaults to new-version=patch
release-prepare: ## Prepares the release for this project
	${INFO} "Preparing the release..."
	make refresh-registry
	make ensure-configs
	make version-update
	make create-configmaps
	make k8s-prepare-configmap
	make k8s-prepare-deployment
	${OK}"...release prepared."

create-configmaps: ## Creates configmap files for all environments
	${INFO}"Creating configmaps..."
	$(call create-configmap,$(ARTIFACT_NAME),snp.json=config/us-snp-us-east-1.json,kubernetes/us_snp_us-east-1/configmap.yaml)
	$(call create-configmap,$(ARTIFACT_NAME),snp.json=config/us-snp-us-west-2.json,kubernetes/us_snp_us-west-2/configmap.yaml)
	$(call create-configmap,$(ARTIFACT_NAME),staging.json=config/us-staging-us-east-1.json,kubernetes/us_staging_us-east-1/configmap.yaml)
	$(call create-configmap,$(ARTIFACT_NAME),staging.json=config/us-staging-us-west-2.json,kubernetes/us_staging_us-west-2/configmap.yaml)
	$(call create-configmap,$(ARTIFACT_NAME),production.json=config/emea-production-eu-central-1.json,kubernetes/emea_production_eu-central-1/configmap.yaml)
	$(call create-configmap,$(ARTIFACT_NAME),production.json=config/emea-production-eu-west-1.json,kubernetes/emea_production_eu-west-1/configmap.yaml)
	$(call create-configmap,$(ARTIFACT_NAME),production.json=config/us-production-us-east-1.json,kubernetes/us_production_us-east-1/configmap.yaml)
	$(call create-configmap,$(ARTIFACT_NAME),production.json=config/us-production-us-east-2.json,kubernetes/us_production_us-east-2/configmap.yaml)
	$(call create-configmap,$(ARTIFACT_NAME),production.json=config/us-production-us-west-2.json,kubernetes/us_production_us-west-2/configmap.yaml)
	$(call create-configmap,$(ARTIFACT_NAME),production.json=config/latam-production-us-east-1.json,kubernetes/latam_production_us-east-1/configmap.yaml)
	$(call create-configmap,$(ARTIFACT_NAME),production.json=config/latam-production-us-east-2.json,kubernetes/latam_production_us-east-2/configmap.yaml)
	${OK}"...configmaps created."
