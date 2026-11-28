# Этап 1: сборка бинарника (подставь версию Go из своего go.mod, если отличается)
FROM golang:1.27.1-alpine AS builder

WORKDIR /app

ENV GOPROXY=https://proxy.golang.org,https://goproxy.io,direct

COPY go.mod go.sum ./
COPY backend ./backend

# Если локально присутствует vendor/, собираем полностью автономно; иначе скачиваем модули
RUN --mount=type=bind,source=.,target=/src \
    if [ -d /src/vendor ]; then \
      cp -r /src/vendor ./vendor && \
      CGO_ENABLED=0 GOOS=linux go build -mod=vendor -ldflags="-s -w" -o /server ./backend/cmd/api; \
    else \
      go mod download && \
      CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /server ./backend/cmd/api; \
    fi

# Этап 2: минимальный образ для запуска
FROM alpine:3.20

# ca-certificates нужны для HTTPS-запросов (например, к hh.ru)
RUN apk --no-cache add ca-certificates

WORKDIR /app
COPY --from=builder /server /app/server

EXPOSE 8000
CMD ["/app/server"]
