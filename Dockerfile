FROM node:16-alpine AS builder

COPY . /app
WORKDIR /app

RUN npm install && npm run build

FROM node:16-alpine

RUN npm install -g serve@14.0.0

COPY --from=builder /app/build /app

EXPOSE 8080
ENTRYPOINT [ "serve", "--single", "--no-clipboard", "--listen", "8080", "/app" ]
