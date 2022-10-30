ARG NODE_VERSION=18.11.0
ARG NPM_VERSION=8.19.2

FROM docker.io/node:${NODE_VERSION}-bullseye-slim AS base
ARG NPM_VERSION=${NPM_VERSION}
RUN set -eu; \
    \
# Install pinned version of npm, regardless of node version, for stability
    npm install -g npm@${NPM_VERSION} ; \
# Install busybox for several Unix utilities
# and tini to act as our simple init
    apt-get update && apt-get upgrade --no-install-recommends -y \
        busybox-static \
        tini \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
# Using rootless user for better security
USER node
# Add node_modules location to PATH
ENV PATH /app/node_modules/.bin:$PATH
WORKDIR /app
# Copy package.json and lock for reproducible dependencies install
# COPY --chown=node:node package.json yarn.lock* ./
# Using tini as PID 1 and kernel signals handler
ENTRYPOINT ["/usr/bin/tini", "--"]
EXPOSE 3000

FROM base AS development
ENV NODE_ENV=development
CMD tail -f /dev/null
# CMD [ "/bin/sh", "-c", "yarn install; yarn watch" ]