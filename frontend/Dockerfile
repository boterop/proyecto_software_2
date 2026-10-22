ARG NODE_VERSION=26.12.0

FROM node:${NODE_VERSION}-alpine AS build
ARG VITE_API_URL

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@latest
RUN pnpm i
COPY . .

ENV VITE_API_URL=$VITE_API_URL

RUN pnpm build

FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

