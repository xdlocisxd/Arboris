# Estágio de Build
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependências para o Prisma no Alpine
RUN apk add --no-cache openssl

# Copiar arquivos de configuração
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.json ./

# Instalar dependências
RUN npm install

# Gerar Prisma Client
RUN npx prisma generate

# Copiar código fonte e buildar
COPY src ./src
RUN npm run build

# Estágio de Produção
FROM node:20-alpine

WORKDIR /app

# Reinstalar dependências de sistema no estágio final
RUN apk add --no-cache openssl

# Copiar apenas os arquivos necessários para produção
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Variáveis de Ambiente padrões
ENV NODE_ENV=production
ENV PORT=5000

# Expor a porta
EXPOSE 5000

# Script para garantir que o banco está sincronizado antes de rodar
CMD ["sh", "-c", "npx prisma db push && npm start"]
