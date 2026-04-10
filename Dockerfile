FROM node:22-alpine
RUN apk add --no-cache openssl

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma/

RUN pnpm install --frozen-lockfile

COPY . .

RUN npx prisma generate

ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY

RUN npx react-router build

EXPOSE 3000

CMD ["sh", "-c", "echo 'Step 1: migrations...' && npx prisma migrate deploy && echo 'Step 2: starting server...' && npx react-router-serve ./build/server/index.js"]
