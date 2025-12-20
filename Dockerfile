# 1. Etapa de Build (Compilação)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Etapa de Produção (Imagem leve para rodar)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
# Não definimos CMD aqui, vamos definir no Kubernetes (um para API, um para Worker)