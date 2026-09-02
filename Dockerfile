# syntax=docker/dockerfile:1

FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY client/package.json client/
COPY server/package.json server/
RUN npm ci
COPY client ./client
RUN npm run build -w client

FROM node:24-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
ENV DATA_DIR=/data
COPY package.json package-lock.json ./
COPY client/package.json client/
COPY server/package.json server/
RUN npm ci --omit=dev
COPY server ./server
COPY --from=build /app/client/dist ./client/dist
EXPOSE 8080
CMD ["node", "server/server.js"]
