# Stage 1: Building
FROM node:20-alpine AS builder

WORKDIR /app
RUN apk add --no-cache git python3 make g++
COPY package.json package-lock.json ./
RUN npm pkg delete scripts.postinstall
RUN npm install --legacy-peer-deps --network-timeout=300000
COPY . .
RUN npx patch-package || true

# addr can be change in docker-compose.yml
ARG POCKBASE_ADDR
ENV POCKBASE_ADDR=${POCKBASE_ADDR:-/}
ENV CHATBOX_BUILD_PLATFORM=web
ENV NODE_ENV=production

RUN npm run build:renderer
RUN find release/app/dist/renderer -name "*.map" -type f -delete
# To allow pb_hooks to hijack "/", there must not be an index.html file in the root directory
RUN mv /app/release/app/dist/renderer/index.html /app/release/app/dist/renderer/dash.html

# Stage 2: Run with PocketBase
FROM ghcr.io/muchobien/pocketbase:latest

# deploy static files
COPY --from=builder /app/release/app/dist/renderer /pb_public

# login page
COPY deploy/login.html /pb_public/login.html

EXPOSE 8090