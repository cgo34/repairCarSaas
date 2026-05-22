# dependencies
FROM node:20-alpine AS dependencies
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# build
FROM dependencies AS build
RUN npm run build

# production
FROM node:20-alpine AS production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist /app/dist

EXPOSE 4173

CMD ["npm", "run", "serve"]
