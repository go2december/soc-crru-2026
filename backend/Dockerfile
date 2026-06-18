FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ARG APP_NAME
RUN npm run build ${APP_NAME}

FROM node:22-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

COPY . .

# Copy build output for the specific app
ARG APP_NAME
COPY --from=builder /usr/src/app/dist/apps/${APP_NAME} ./dist/apps/${APP_NAME}

ENV APP_NAME=${APP_NAME}
CMD node dist/apps/${APP_NAME}/main.js