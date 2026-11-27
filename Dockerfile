# ==========================================
# 1. Base stage: установка зависимостей
# ==========================================
FROM node:22-alpine AS base
WORKDIR /app

# Копируем манифесты зависимостей
COPY package.json package-lock.json ./

# Устанавливаем зависимости с чистой фиксацией версий
RUN npm ci

# ==========================================
# 2. Development stage (для локальной разработки с HMR)
# ==========================================
FROM base AS development
WORKDIR /app
COPY . .
ENV PORT=5173
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ==========================================
# 3. Build stage: сборка React SPA
# ==========================================
FROM base AS builder
WORKDIR /app
COPY . .

# Переменная окружения для базового URL бэкенда при сборке
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Сборка проекта (TypeScript + Vite)
RUN npm run build

# ==========================================
# 4. Production stage: Nginx для раздачи статики и проксирования бэкенда
# ==========================================
FROM nginx:alpine AS production

# Настройка переменных окружения для Nginx
ENV BACKEND_URL=http://backend:8000
ENV NGINX_ENVSUBST_FILTER="BACKEND_URL"

# Копируем скомпилированное React-приложение из builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем конфигурационный шаблон Nginx (обрабатывается встроенным envsubst на старте)
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
