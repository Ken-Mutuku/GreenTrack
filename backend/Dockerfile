FROM node:18-alpine
WORKDIR /app

# Install dependencies (including devDependencies for building)
COPY package*.json ./
RUN npm ci --include=dev

# Copy source
COPY . .

# Build (if needed) and clean dev dependencies
RUN npm run build --if-present && \
    npm prune --production

# Runtime config
EXPOSE 3000
ENV NODE_ENV=production
USER node
CMD ["node", "index.js"]