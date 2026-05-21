# dependencies
FROM node:18-alpine AS dependencies
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# lint
FROM dependencies AS lint
RUN npm run lint
RUN npm run type-check

# build
FROM dependencies AS build
RUN npm run build

# production
FROM node:18-alpine AS production
WORKDIR /app

COPY --from=build /app/dist /app/dist

CMD ["npm", "run", "serve"]