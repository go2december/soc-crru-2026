# ---------------------------------------
# Stage 1: Development
# ---------------------------------------
FROM node:25-alpine AS development

WORKDIR /usr/src/app

# Copy package files first to cache dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Run the development server with hot-reload
CMD ["npm", "run", "start:dev"]

# ---------------------------------------
# Stage 2: Production (Antigravity Mode)
# ---------------------------------------
FROM node:25-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

# Install only production dependencies to keep image small
RUN npm install --only=production

COPY . .

# Copy built files from development stage
COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]