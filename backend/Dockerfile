# Этап 1: сборка бинарника (подставь версию Go из своего go.mod, если отличается)
FROM golang:1.27.1-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY backend ./backend
RUN CGO_ENABLED=0 GOOS=linux go build -o /server ./backend/cmd/api

# Этап 2: минимальный образ для запуска
FROM alpine:3.20

# ca-certificates нужны для HTTPS-запросов (например, к hh.ru)
RUN apk --no-cache add ca-certificates

WORKDIR /app
COPY --from=builder /server /app/server

EXPOSE 8000
CMD ["/app/server"]