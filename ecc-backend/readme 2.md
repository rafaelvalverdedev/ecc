# 🕊️ ECC Backend  
Sistema oficial do **Encontro de Casais com Cristo – ECC**  

Backend desenvolvido com **Node.js + Express + Supabase (Auth + PostgreSQL)**, com arquitetura modular, autenticação JWT via Supabase, controle de permissões por roles, seed automático e coleção completa para Insomnia.

---

# 📑 Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Arquitetura](#arquitetura)
- [Modelagem do Banco](#modelagem-do-banco)
- [Autenticação e Autorização](#autenticação-e-autorização)
- [Instalação](#instalação)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Rotas Disponíveis](#rotas-disponíveis)
- [Seed (Popular Banco)](#seed-popular-banco)
- [Coleção do Insomnia](#coleção-do-insomnia)
- [Fluxos do Sistema](#fluxos-do-sistema)
- [Roadmap](#roadmap)
- [Licença](#licença)

---

# 🧩 Sobre o Projeto

O backend do ECC foi projetado para gerenciar **eventos, equipes, encontristas, encontreiros e coordenadores**, seguindo uma estrutura clara e escalável.

### Principais papéis:

| Papel | Descrição |
|------|-----------|
| **Admin** | controla todo o sistema |
| **Coordenador** | gerencia sua equipe e seus encontreiros |
| **Encontreiro** | membro de uma equipe |
| **Encontrista** | participante do evento |

### Módulos principais implementados

- Pessoas (modelo unificado)
- Coordenadores
- Encontreiros (via teamrole)
- Encontristas (via inscrições)
- Eventos
- Equipes
- Momentos do evento
- Autenticação + Roles
- Seed automático

---

# 🏗️ Arquitetura

```
src/
 ├─ controllers/
 │   ├─ coordenadores.controller.js
 │   ├─ pessoas.controller.js
 │   ├─ equipes.controller.js
 │   ├─ eventos.controller.js
 │   ├─ inscricoes.controller.js
 │   └─ teamrole.controller.js
 ├─ routes/
 │   ├─ coordenadores.routes.js
 │   ├─ pessoas.routes.js
 │   ├─ equipe.routes.js
 │   ├─ eventos.routes.js
 │   ├─ inscricoes.routes.js
 │   └─ teamrole.routes.js
 ├─ middlewares/
 │   └─ auth.js
 ├─ config/
 │   └─ supabase.js
 ├─ scripts/
 │   └─ seed.js
 └─ server.js
```

---

# 🗄️ Modelagem do Banco

## 📌 Tabela **pessoas**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| nome | text | |
| email | text | |
| telefone | text | |
| auth_uid | uuid | ID do usuário no Supabase Auth |
| role | text | admin / coordenador / encontreiro / encontrista |
| created_at | timestamp | |

---

## 📌 Tabela **equipes**

| Campo | Tipo |
|-------|------|
| id | uuid |
| name | text |
| description | text |
| coordinator_1_id | uuid (FK pessoas.id) |
| coordinator_2_id | uuid (FK pessoas.id) |

---

## 📌 Tabela **teamrole** (membros da equipe)

| Campo | Tipo |
|-------|------|
| id | uuid |
| pessoa_id | uuid |
| equipe_id | uuid |
| is_leader | boolean |

---

## 📌 Tabela **inscricoes** (encontristas)

| Campo | Tipo |
|-------|------|
| id | uuid |
| evento_id | uuid |
| pessoa_id | uuid |
| status | pending / paid |

---

# 🔐 Autenticação e Autorização

## 🔑 Autenticação
Feita via **Supabase Auth**.

Login → retorna um JWT  
Backend valida assim:

```js
supabase.auth.getUser(token)
```

## 🔐 Autorização
Roles ficam em:

```
auth.users.raw_user_meta_data.role
```

Middleware:

```js
authRequired
requireRole(...)
```

Roles:

```js
admin
coordenador
encontreiro
encontrista
```

---

# ⚙️ Instalação

```bash
git clone <repo>
cd ecc-backend
npm install
```

---

# 📦 Variáveis de Ambiente

Crie `.env`:

```
SUPABASE_URL=https://isaxzkmswrnxjkbwcjcm.supabase.co
SUPABASE_SERVICE_ROLE_KEY=SUA_SERVICE_ROLE_KEY
PORT=3001
```

---

# ▶️ Rodar servidor

```bash
npm run dev
```

Ou:

```bash
node src/server.js
```

---

# 🔧 Scripts Disponíveis

| Script | Função |
|--------|--------|
| `npm run dev` | inicia em modo de desenvolvimento |
| `npm start` | inicia em produção |
| `npm run seed` | popula banco com dados aleatórios |

---

# 🧪 Rotas Disponíveis

## 🔐 AUTH
```
POST /auth/login
GET  /auth/me
```

## 👤 COORDENADORES
```
POST   /coordenadores
GET    /coordenadores
GET    /coordenadores/:id
PUT    /coordenadores/:id
DELETE /coordenadores/:id
```

## 🧍 PESSOAS
```
GET /pessoas
GET /pessoas/:id
```

## 🧑‍🔧 EQUIPES
```
POST /equipes
GET  /equipes
GET  /equipes/:id
```

## 🧱 TEAMROLE (encontreiros)
```
POST   /teamrole
GET    /teamrole/equipe/:id
DELETE /teamrole/:id
```

## 📋 INSCRIÇÕES
```
POST  /inscricoes
GET   /inscricoes
GET   /inscricoes/:id
PATCH /inscricoes/:id/pagar
```

---

# 🌱 Seed (Popular banco)

```bash
npm run seed
```

Funciona assim:

- limpa dados
- cria equipes
- cria encontristas
- cria encontreiros
- cria pessoas fictícias

---

# 🧪 Coleção do Insomnia

Inclui:

- Login
- Coordenadores
- Pessoas
- Equipes
- Inscrições
- Teamrole

Para importar:

**Insomnia → Preferences → Data → Import → From File**

---

# 🔄 Fluxos do Sistema

## 1) ADMIN
- cadastra coordenadores  
- gerencia tudo  
- possui login  

## 2) COORDENADOR
- tem login  
- gerencia equipe  
- cria encontreiros  

## 3) ENCONTREIRO
- membro da equipe  
- acesso limitado  

## 4) ENCONTRISTA
- participante do evento  
- não tem login  

---

# 📌 Roadmap

- [ ] Rota de criação de encontreiro  
- [ ] Controle de permissões avançado  
- [ ] Pagamento da inscrição  
- [ ] RLS no Supabase  
- [ ] Documentação Swagger  
- [ ] Painel frontend  

---

# 📄 Licença
Uso interno do ECC.
