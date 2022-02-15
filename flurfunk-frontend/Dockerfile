# Install dependencies only when needed
FROM node:17.5.0-alpine3.15 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Production image, copy all the files and run next
FROM node:17.5.0-alpine3.15 AS runner

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1


WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN mkdir /app/.next
RUN chown nextjs:nodejs /app/.next

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD yarn build && yarn start