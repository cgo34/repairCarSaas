FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

RUN echo "SUPABASE_URL=$VITE_SUPABASE_URL"
RUN echo "SUPABASE_KEY=$VITE_SUPABASE_KEY"

COPY . .
RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
