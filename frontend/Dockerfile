# syntax=docker/dockerfile:1

# ---- 依存関係のインストール ----
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- ビルド ----
FROM node:20-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* はビルド時にバンドルへ埋め込まれる。
# 値は docker build の --build-arg（CD ワークフロー / docker compose）で渡す。
# 未指定なら API はリバースプロキシ経由の相対パス /api を使う。
ARG NEXT_PUBLIC_API_ORIGIN=""
ARG NEXT_PUBLIC_ADOBE_FONTS_KIT_ID=juv0bpv
ENV NEXT_PUBLIC_API_ORIGIN=$NEXT_PUBLIC_API_ORIGIN \
    NEXT_PUBLIC_ADOBE_FONTS_KIT_ID=$NEXT_PUBLIC_ADOBE_FONTS_KIT_ID \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---- 本番ランタイム ----
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts

EXPOSE 3000
CMD ["npm", "run", "start"]
