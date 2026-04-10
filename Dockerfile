FROM node:22-alpine
RUN apk add --no-cache openssl

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma/

RUN pnpm install --frozen-lockfile

COPY . .

ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY

RUN npx prisma generate
RUN npx react-router build

EXPOSE 3000
ENV PORT=3000

CMD ["sh", "-c", "echo 'PORT IS:' $PORT && echo 'Step 1: migrations...' && npx prisma migrate deploy && echo 'Step 2: starting server on port' $PORT && npx react-router-serve ./build/server/index.js"]
