FROM node:carbon as base

WORKDIR     /usr/src/app

COPY package.json           package.json
COPY package-lock.json      package-lock.json
COPY config/default.json    config/default.json
COPY config/custom-environment-variables.json config/custom-environment-variables.json
COPY version.json           version.json

RUN npm install --production --no-optionals --no-bin-links && \
    npm cache clean --force

COPY src src

FROM  base as test

ARG NODE_ENV=test

COPY test test

RUN npm install && \
    npm test

FROM base as release

COPY bin bin

ENTRYPOINT  ["bin/smallGroup"]
HEALTHCHECK CMD ["/usr/src/app/bin/healthcheck"]
USER node
