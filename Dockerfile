FROM node:20-bookworm AS builder
WORKDIR /app
ENV NODE_ENV=development

COPY package*.json ./
RUN npm ci --no-fund

COPY . .
RUN npm run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Lightweight tooling for healthchecks
RUN apt-get update \
  && apt-get install -y --no-install-recommends curl \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev --no-fund

COPY --from=builder /app/dist ./dist
COPY server ./server

USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD ["sh", "-c", "curl -f http://127.0.0.1:${PORT}/healthz || exit 1"]
CMD ["node", "server/index.js"]
