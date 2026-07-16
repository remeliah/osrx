FROM node:22-alpine AS builder

WORKDIR /app

COPY web/ ./
RUN npm ci && npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./

RUN npm ci --omit=dev
COPY --from=builder /app/build ./build

CMD ["node", "build"]
