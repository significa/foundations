FROM node:lts-alpine AS base

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN corepack enable npm && npm install --frozen-lockfile && npm install --save-dev @tailwindcss/oxide-linux-x64-musl

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable npm && npm run build

# Stage 3: Production server
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
RUN if [ -d "/app/public" ]; then cp -r /app/public ./public; fi # Copy public folder if it exists

EXPOSE 3000
CMD ["node", "server.js"]