
FROM node:20.11.0 as base

WORKDIR /app
COPY package*.json ./
EXPOSE 3000
RUN npm install -g pnpm

FROM base as builder
WORKDIR /app
COPY . .
RUN pnpm run build


FROM base as production
WORKDIR /app

ENV NODE_ENV=production
RUN pnpm ci

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs


COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

CMD pnpm start

FROM base as dev
ENV NODE_ENV=development
RUN pnpm install 
COPY . .
CMD pnpm run dev





# FROM node:20.11.0 as base

# WORKDIR /app
# COPY package*.json ./
# EXPOSE  3000
# RUN npm install -g pnpm

# FROM base as builder
# WORKDIR /app
# COPY . .
# RUN pnpm run build

# FROM base as production
# WORKDIR /app
# ENV NODE_ENV=production
# RUN pnpm ci

# RUN addgroup -g  1001 -S nodejs
# RUN adduser -S nextjs -u  1001
# USER nextjs

# COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/public ./public

# CMD pnpm start

# FROM base as dev
# ENV NODE_ENV=development
# RUN pnpm install
# # Elimina la siguiente línea si no deseas sobrescribir node_modules
# # COPY . .
# CMD pnpm run dev
