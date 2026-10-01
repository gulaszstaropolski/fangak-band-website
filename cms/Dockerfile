FROM node:22-bookworm-slim AS dependencies
WORKDIR /app
COPY package*.json ./
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*
RUN npm ci

FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN APP_KEYS=build-key-1,build-key-2 API_TOKEN_SALT=build-salt ADMIN_JWT_SECRET=build-admin-secret TRANSFER_TOKEN_SALT=build-transfer-salt JWT_SECRET=build-jwt-secret ENCRYPTION_KEY=build-encryption-key npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app ./
EXPOSE 1337
CMD ["npm", "run", "start"]
