# Usar una imagen base de Node.js
FROM node:20.11.0 as base

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de package.json y pnpm-lock.yaml (si existe)
COPY package*.json ./

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Instalar Vite globalmente usando pnpm
RUN pnpm install -g create-vite

# Exponer el puerto 5173
EXPOSE 5173

# Crear una etapa de construcción
FROM base as builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar todos los archivos del proyecto
COPY . .

# Instalar las dependencias del proyecto usando pnpm
RUN pnpm install

# Construir el proyecto
RUN pnpm run build

# Crear una etapa de producción
FROM base as production

# Establecer el directorio de trabajo
WORKDIR /app

# Establecer la variable de entorno NODE_ENV a producción
ENV NODE_ENV=production

# Instalar las dependencias del proyecto usando pnpm
RUN pnpm ci

# Copiar los archivos de producción
COPY --from=builder /app/dist ./dist

# Copiar el archivo package.json
COPY --from=builder /app/package.json ./package.json

# Comando para iniciar la aplicación en producción
CMD ["pnpm", "run", "serve"]

# Crear una etapa de desarrollo
FROM base as dev

# Establecer la variable de entorno NODE_ENV a desarrollo
ENV NODE_ENV=development

# Instalar las dependencias del proyecto usando pnpm
RUN pnpm install

# Copiar todos los archivos del proyecto
COPY . .

# Comando para iniciar la aplicación en modo desarrollo
CMD ["pnpm", "run", "dev"]


# FROM node:20.11.0 as base

# WORKDIR /app
# COPY package*.json ./
# EXPOSE 3000
# RUN npm install -g pnpm

# FROM base as builder
# WORKDIR /app
# COPY . .
# RUN pnpm run build


# FROM base as production
# WORKDIR /app

# ENV NODE_ENV=production
# RUN pnpm ci

# RUN addgroup -g 1001 -S nodejs
# RUN adduser -S nextjs -u 1001
# USER nextjs


# COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/public ./public

# CMD pnpm start

# FROM base as dev
# ENV NODE_ENV=development
# RUN pnpm install 
# COPY . .
# CMD pnpm run dev

