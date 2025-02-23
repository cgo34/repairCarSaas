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

# ✅ Stage de lint/type-check (facultatif si pas de test)
FROM build AS lint
RUN npm run lint && npm run type-check

# ✅ Stage final (production)
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=build /app/dist /app
CMD ["npm", "run", "serve"]
