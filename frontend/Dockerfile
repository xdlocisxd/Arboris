# Estágio de Build
FROM node:20-alpine AS build-stage

WORKDIR /app

# Copiar arquivos de configuração e dependências
COPY package*.json ./
RUN npm install

# Copiar código e buildar
COPY . .

# Ignorar checagem de tipos (tsc) no build de produção
RUN npx vite build

# Estágio de Servidor Nginx
FROM nginx:stable-alpine AS production-stage

# Copiar build gerado
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta 80
EXPOSE 80

# Nginx roda por padrão
CMD ["nginx", "-g", "daemon off;"]
