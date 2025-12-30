# Stage 1: Building
FROM node:20-alpine AS builder

WORKDIR /app
RUN apk add --no-cache git python3 make g++
COPY package.json package-lock.json ./
RUN npm pkg delete scripts.postinstall
RUN npm install --legacy-peer-deps --network-timeout=300000
COPY . .
RUN npx patch-package || true

# change addr in docker-compose.yml
ARG POCKBASE_ADDR
ENV POCKBASE_ADDR=$POCKBASE_ADDR
ENV CHATBOX_BUILD_PLATFORM=web
ENV NODE_ENV=production

RUN npm run build:renderer
RUN find release/app/dist/renderer -name "*.map" -type f -delete

# Stage 2: Run with PocketBase
FROM ghcr.io/muchobien/pocketbase:latest

# deploy static files
COPY --from=builder /app/release/app/dist/renderer /pb_public

EXPOSE 8090