FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx tsc
# FROM gcr.io/distroless/nodejs22-debian12:nonroot
FROM node:22-slim
# USER nonroot
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
CMD [ "dist/index.js" ]
