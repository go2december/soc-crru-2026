# ---------------------------------------
# Base Image setup
# ---------------------------------------
FROM node:25-alpine AS base

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# ---------------------------------------
# Stage 1: Install Dependencies
# ---------------------------------------
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ---------------------------------------
# Stage 2: Builder
# ---------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ปิด Telemetry เพื่อความเป็นส่วนตัวและความเร็ว
ENV NEXT_TELEMETRY_DISABLED 1

# Note: ใน Docker Compose เราใช้ target: development จึงอาจไม่รัน build
# แต่ถ้าจะ Deploy จริง บรรทัดนี้จะทำงาน
RUN npm run build

# ---------------------------------------
# Stage 3: Development Runner
# ---------------------------------------
FROM base AS development
WORKDIR /app
ENV NODE_ENV development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
CMD ["npm", "run", "dev"]

# ---------------------------------------
# Stage 4: Production Runner (Standalone)
# ---------------------------------------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets
COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]