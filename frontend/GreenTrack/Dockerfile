# Stage 1: Build the React app
FROM node:18-alpine as builder
WORKDIR /app

# Cache dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy and build
COPY . .
RUN yarn build

# Stage 2: Serve with Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy build output and NGINX config
COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cleanup
RUN rm -rf /usr/share/nginx/html/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]