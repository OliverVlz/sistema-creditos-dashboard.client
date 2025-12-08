# ================================
# Stage 1: Build
# ================================
FROM node:20-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./

# Instalar dependencias
RUN npm ci --legacy-peer-deps

# Copiar el resto del código fuente
COPY . .

# Argumentos de build para variables de entorno
ARG VITE_API_URL
ARG VITE_APP_NAME

# Establecer variables de entorno para el build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_NAME=$VITE_APP_NAME

# Construir la aplicación para producción
RUN npm run build

# ================================
# Stage 2: Production
# ================================
FROM nginx:alpine AS production

# Instalar gettext para envsubst
RUN apk add --no-cache gettext

# Crear directorio para templates
RUN mkdir -p /etc/nginx/templates

# Copiar template de configuración de nginx
COPY nginx.conf.template /etc/nginx/templates/nginx.conf.template

# Copiar script de inicio
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Copiar los archivos construidos desde la etapa de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Variable de entorno para la URL del backend (puede ser sobrescrita)
ENV BACKEND_URL=http://host.docker.internal:3000

# Usar el script de inicio
ENTRYPOINT ["/docker-entrypoint.sh"]

