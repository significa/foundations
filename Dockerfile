FROM node:20.18.1-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY ./package.json ./package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

ARG APP_VERSION="0.1.0-untagged"
ENV APP_VERSION=$APP_VERSION
RUN npm version --no-git-tag-version "$APP_VERSION"

FROM node:20.18.1-alpine AS runner
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

ARG APP_VERSION="0.1.0-untagged"
ENV APP_VERSION=$APP_VERSION

COPY --from=builder /app/node_modules/ /app/node_modules/
COPY --from=builder /app/package.json /app/package-lock.json /app/
COPY --from=builder /app/public/ /app/public/
COPY --from=builder /app/.next/ /app/.next/

CMD ["npm", "run", "start"]