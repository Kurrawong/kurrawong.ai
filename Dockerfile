ARG NODE_VERSION=21.7.1
FROM node:${NODE_VERSION}-alpine as base
ARG PORT=3000
WORKDIR /src

FROM base as build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY --link package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY --link . .
RUN pnpm build

FROM base

ENV PORT=$PORT
ENV NODE_ENV=production
COPY --from=build /src/.output /src/.output
EXPOSE $PORT
CMD [ "node", ".output/server/index.mjs" ]