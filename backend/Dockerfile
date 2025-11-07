# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=20-bullseye

FROM node:${NODE_VERSION} AS base
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY tsconfig.json eslint.config.js ./
COPY src ./src
COPY migrations ./migrations

FROM base AS build
RUN npm run build

FROM node:${NODE_VERSION}-slim AS production
ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --omit=dev

COPY --from=build /app/build ./build
COPY --from=build /app/migrations ./migrations

EXPOSE 3000

CMD ["node", "build/server.js"]

