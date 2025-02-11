# Stage de base
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

# Stage de dépendances
FROM base AS dependencies
RUN npm ci
COPY . .

# Stage de build
FROM dependencies AS build
RUN npm run build

# Stage de production (optionnel)
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html