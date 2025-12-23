# TicketBlast - Plataforma de Ingressos com IA e Processamento Assíncrono

![TicketBlast](./web/public/img/Gemini_Generated_Image_n5k0ssn5k0ssn5k0.png)
![Next.js 15](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

## Sobre o Projeto

O **TicketBlast** é uma aplicação Full Stack de venda de ingressos desenvolvida para explorar arquiteturas modernas e resilientes. O objetivo foi criar um sistema capaz de lidar com picos de acesso, processamento pesado em segundo plano e oferecer suporte automatizado via Inteligência Artificial.

Diferente de um CRUD simples, este projeto foca em **User Experience (UX)** e **Performance**, garantindo que o usuário não fique travado esperando a geração de ingressos ou o envio de e-mails.

---

## Funcionalidades Principais

- 🎟️ **Compra de Ingressos:** Fluxo completo de seleção e "pagamento".
- ⚡ **Filas de Processamento (Background Jobs):** Uso de **Redis** e **BullMQ** para gerar PDFs e enviar e-mails fora da thread principal, evitando travamentos.
- 🤖 **AI Chatbot Integrado:** Suporte inteligente powered by **Google Gemini 2.0 Flash**, capaz de responder dúvidas sobre preços, datas e disponibilidade com contexto dinâmico.
- 📄 **Geração de PDF Server-Side:** Criação dinâmica de comprovantes personalizados.
- 📧 **Notificações:** Envio automatizado de e-mails transacionais.

---

## Tech Stack & Arquitetura

### Frontend

- **Framework:** Next.js 15 (App Router & Server Actions)
- **Linguagem:** TypeScript
- **Estilização:** TailwindCSS + Lucide React
- **State Management:** React Hooks

### Backend & Infraestrutura

- **Database:** PostgreSQL (via Supabase)
- **ORM:** Prisma
- **Filas/Cache:** Redis (Upstash/Local)
- **AI SDK:** Vercel AI SDK + Google Generative AI
- **Deploy:** Render (Node.js Service)

---

## Desafios de Engenharia & Soluções

Este projeto foi um laboratório de resolução de problemas reais de infraestrutura:

### 1. Connection Pooling em Ambiente Serverless

**O Problema:** Ao realizar o deploy, enfrentei erros de `prepared statement already exists` e exaustão de conexões no PostgreSQL, causados pela natureza efêmera das funções serverless/containers.
**A Solução:** Configuração do **PgBouncer** em modo _Transaction_ no Supabase e ajuste na string de conexão do Prisma (`pgbouncer=true`), estabilizando a comunicação com o banco.

### 2. Latência na Geração de Ingressos

**O Problema:** A geração de PDF e upload síncrono fazia o checkout demorar +5 segundos.
**A Solução:** Implementação de arquitetura de filas (Producer/Consumer). O usuário recebe a confirmação imediata na tela, enquanto um _Worker_ processa o PDF e o e-mail em segundo plano.

### 3. Integração com LLMs (IA)

**O Problema:** Gerenciar cotas de API e versionamento de modelos (_Model Not Found_ / _429 Too Many Requests_).
**A Solução:** Implementação de tratamento de erros robusto e fallback, utilizando modelos Flash otimizados para latência baixa.

---

## Como Rodar Localmente

### Pré-requisitos

- Node.js 18+
- Instância do Redis (Local via Docker ou URL externa)
- Conta no Supabase e Google AI Studio

### Passo a Passo

1. **Clone o repositório:**

    ```bash
    git clone [https://github.com/seu-usuario/TicketBlast.git](https://github.com/seu-usuario/TicketBlast.git)
    cd TicketBlast/web
    ```

2. **Instale as dependências:**

    ```bash
    npm install
    ```

3. **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz baseado no exemplo abaixo:

    ```env
    DATABASE_URL="sua_string_supabase_connection_pooling"
    DIRECT_URL="sua_string_supabase_direct"
    GOOGLE_GENERATIVE_AI_API_KEY="sua_chave_gemini"
    REDIS_URL="sua_url_redis"
    ```

4. **Rode as migrações do Banco:**

    ```bash
    npx prisma migrate dev
    ```

5. **Inicie o Servidor de Desenvolvimento:**

    ```bash
    npm run dev
    ```

    Acesse `http://localhost:3000`.

---

## 🤝 Autor

Desenvolvido por **Hyarlei Silva**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/hyarlei-silva/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/hyarlei)

---

_Este projeto é para fins de estudo e portfólio._
