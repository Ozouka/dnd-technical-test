FROM node:22-alpine
RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npx react-router-serve ./build/server/index.js"]
