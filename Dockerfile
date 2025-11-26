## =========================================
## Stage 1: Install dependencies
## =========================================
ARG NODE_VERSION=22-alpine

FROM node:${NODE_VERSION} AS deps

WORKDIR /app

# Install OS dependencies (e.g. openssl for Prisma + Postgres)
RUN apk add --no-cache openssl

# Copy package files
COPY package.json package-lock.json* ./

# Install Node dependencies
RUN npm ci

## =========================================
## Stage 2: Build the Next.js application
## =========================================
FROM node:${NODE_VERSION} AS builder

WORKDIR /app

# Install OS deps again (needed for Prisma during generate)
RUN apk add --no-cache openssl

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the source code
COPY . .

# Disable Next telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma client (in case it's not generated yet)
RUN npx prisma generate

# Build Next.js app
RUN npm run build

## =========================================
## Stage 3: Production runner
## =========================================
FROM node:${NODE_VERSION} AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Install minimal runtime dependencies (Prisma needs openssl, libc6-compat)
RUN apk add --no-cache openssl libc6-compat

# Copy application files needed at runtime
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 3000

# Set hostname and port envs for Next.js
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Switch to non-root user
USER nextjs

# Healthcheck (expects /api/health endpoint; adjust if needed)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))" || exit 1

# Start Next.js (через `next start`) с прогоном миграций Prisma
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]


