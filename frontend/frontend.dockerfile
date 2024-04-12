# Use a Node.js base image
FROM node:20.11.0 as base

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml (if exists)
COPY package*.json ./

# Set the PNPM_HOME environment variable
ENV PNPM_HOME=/root/.local/share/pnpm

# Update the PATH to include the global bin directory
ENV PATH=$PNPM_HOME:$PATH

# Install pnpm globally
RUN npm install -g pnpm

# Set the SHELL environment variable explicitly
ENV SHELL=/bin/bash

# Install Vite globally using pnpm
RUN pnpm install -g create-vite

# Expose port 5173
EXPOSE 5173

# Create a build stage
FROM base as builder

# Set the working directory
WORKDIR /app

# Copy all project files
COPY . .

# Install project dependencies using pnpm
RUN pnpm install

# Build the project
RUN pnpm run build

# Create a production stage
FROM base as production

# Set the working directory
WORKDIR /app

# Set the NODE_ENV environment variable to production
ENV NODE_ENV=production

# Install project dependencies using pnpm
RUN pnpm ci

# Copy production files
COPY --from=builder /app/dist ./dist

# Copy package.json
COPY --from=builder /app/package.json ./package.json

# Command to start the application in production
CMD ["pnpm", "run", "serve"]

# Create a development stage
FROM base as dev

# Set the NODE_ENV environment variable to development
ENV NODE_ENV=development

# Install project dependencies using pnpm
RUN pnpm install

# Copy all project files
COPY . .

# Command to start the application in development mode
CMD ["pnpm", "run", "dev"]
