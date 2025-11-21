# TicketBlast - High Performance Ticket System 🎫

Uma prova de conceito (PoC) de um sistema de venda de ingressos de alta concorrência, projetado para lidar com picos de tráfego (ex: vendas do Rock in Rio) sem derrubar o banco de dados.

## 🏗 Arquitetura

O projeto utiliza uma arquitetura orientada a eventos para garantir escalabilidade e consistência:

1. **API Gateway (Node.js + Express)**: Recebe as requisições HTTP.
2. **Redis (Cache)**: Atua como um "porteiro" de alta velocidade, gerenciando o estoque em tempo real e bloqueando requisições excedentes antes que elas toquem no banco de dados (Rate Limiting).
3. **RabbitMQ (Mensageria)**: Garante que os pedidos aceitos não sejam perdidos e permite o processamento assíncrono.
4. **Worker (Node.js)**: Consome a fila e processa a compra pesada no seu próprio ritmo.

## 🚀 Tech Stack

- **Node.js & TypeScript**
- **Docker & Docker Compose** (Infraestrutura completa com um comando)
- **RabbitMQ** (Filas e Exchange)
- **Redis** (Cache e Atomic Counters)
- **PostgreSQL** (Banco Relacional - Simulado na arquitetura)

## ⚡ Como rodar

1. Suba a infraestrutura (Redis + RabbitMQ):

   ```bash
   docker compose up -d
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie a API:

   ```bash
   npm run dev
   ```

4. Inicie o Worker:

   ```bash
   npx ts-node-dev src/worker.ts
   ```
