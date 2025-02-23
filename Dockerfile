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

# ✅ Stage de test/lint
FROM build AS test
RUN npm run lint

# ✅ Stage final (production) basé sur Node.js (pas nginx)
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=build /app /app
CMD ["npm", "run", "serve"]
