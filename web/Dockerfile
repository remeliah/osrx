FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY web/ ./
RUN bun install && bun run build

FROM oven/bun:1-alpine

WORKDIR /app

COPY --from=builder /app/package.json /app/bun.lock ./

RUN bun install --production
COPY --from=builder /app/build ./build

CMD ["bun", "build/index.js"]
