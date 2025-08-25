# Use official Bun image
FROM oven/bun:1 AS runtime

# Create app directory
WORKDIR /app

# Copy manifests first to leverage Docker layer caching
# Include lockfiles if present
COPY package.json bun.lockb* package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Install only production dependencies
RUN bun install --production

# Copy the rest of the source code
COPY . .

# Environment
ENV NODE_ENV=production

# The app listens on PORT (default 3000)
ENV PORT=3000
EXPOSE 3000

# Start the server (Bun can run TypeScript directly)
CMD ["bun", "src/index.ts"]

