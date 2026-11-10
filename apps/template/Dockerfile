# syntax=docker/dockerfile:1.7
# Build from the monorepo root:
#   docker build -f apps/template/Dockerfile -t dertour/template .
ARG NODE_VERSION=26-alpine
# Keep in sync with "packageManager" in the root package.json (Node 25+ ships without corepack).
ARG PNPM_VERSION=10.18.0
ARG APP=@dertour/template
ARG APP_DIR=apps/template

FROM node:${NODE_VERSION} AS base
ARG PNPM_VERSION
RUN npm install -g pnpm@${PNPM_VERSION}
WORKDIR /repo

# 1) Only the files this app needs (turbo prune keeps the lockfile consistent).
FROM base AS prune
ARG APP
COPY . .
RUN pnpm dlx turbo@2.11.10 prune ${APP} --docker

# 2) Install dependencies (cached as long as package.json/lockfile don't change).
FROM base AS deps
COPY --from=prune /repo/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

# 3) Build (generates the API clients from OPENAPI_*_URL, or the demo spec when unset).
FROM deps AS build
ARG APP
ARG OPENAPI_OFFERS_URL
ARG NEXT_PUBLIC_SITE_URL=https://www.example.com
ARG NEXT_PUBLIC_API_BASE_URL=https://api.example.com
ENV NEXT_TELEMETRY_DISABLED=1 SKIP_ENV_VALIDATION=1 \
    OPENAPI_OFFERS_URL=${OPENAPI_OFFERS_URL} \
    NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
COPY --from=prune /repo/out/full/ .
RUN pnpm turbo run build --filter=${APP}

# 4) Minimal runtime image: standalone server, static assets, non-root user.
FROM node:${NODE_VERSION} AS runner
ARG APP_DIR
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001 -G nodejs
COPY --from=build --chown=nextjs:nodejs /repo/${APP_DIR}/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /repo/${APP_DIR}/.next/static ./${APP_DIR}/.next/static
COPY --from=build --chown=nextjs:nodejs /repo/${APP_DIR}/public ./${APP_DIR}/public
USER nextjs
EXPOSE 3000
ENV APP_DIR=${APP_DIR}
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1
CMD ["sh", "-c", "node ${APP_DIR}/server.js"]
