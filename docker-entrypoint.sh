#!/bin/sh
set -e

# Usar BACKEND_URL de la variable de entorno o valor por defecto
# En Docker Desktop: usar host.docker.internal
# En Linux/WSL2: usar 172.17.0.1 o la IP de tu host
BACKEND_URL=${BACKEND_URL:-http://host.docker.internal:3000}

echo "Configurando nginx con BACKEND_URL: $BACKEND_URL"

# Reemplazar la variable en el template de nginx
envsubst '${BACKEND_URL}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf

# Ejecutar nginx
exec nginx -g 'daemon off;'

