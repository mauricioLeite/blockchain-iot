# Get Makefile full path
mkfile_path := $(abspath $(lastword $(MAKEFILE_LIST)))
# Get Makefile dir name only
root_dir := $(notdir $(patsubst %/,%,$(dir $(mkfile_path))))

# Force to use buildkit for all images and for docker-compose to invoke
# Docker via CLI (otherwise buildkit isn't used for those images)
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Compose DEV commands
up: # Start development containers.
	@docker-compose up

CONTAINER ?= ${root_dir}
sh: # Execute a shell inside project container (Container with root dir name).
	@docker-compose exec \
		${CONTAINER} sh -c "(bash || ash || sh)"

logs: # Display logs from all containers with timestamps.
	@docker-compose logs \
		--timestamps

ps: # List all containers from project.
	@docker-compose ps \
		--all

build: # Build docker images for development.
	@docker-compose build \
		--progress plain

build-nc: ## Rebuild docker images ignoring cache.
	@docker-compose build \
		--progress plain \
		--no-cache

recreate: # Force recreate all containers.
	@docker-compose up \
		--force-recreate

reload: build recreate # Build and force recreate all containers (using cache).

reload-nc: build-nc recreate ## Build and force recreate all containers (ignore existing cache).

down: # Stop and delete containers.
	@docker-compose down \
		--remove-orphans