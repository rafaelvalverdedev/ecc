# ECC Backend

Backend para o projeto **ECC** (Encontro de Casais com Cristo)
Modelo baseado em `pessoas`, `equipes`, `teamrole`, `eventos`, `momentos_do_evento` e `inscricoes`.
Banco: Supabase (PostgreSQL)
Servidor: Node.js + Express
Cliente DB: Supabase-js usando `service_role`.

---
## Sumário
- Visão Geral
- Estrutura do Projeto
- Pré-requisitos
- Variáveis de Ambiente
- SQL - Criação do Schema
- Permissões (RLS / ACL)
- Iniciando o Servidor
- Rotas Disponíveis
- Seed Automático
- Reset do Banco
- Testes (Insomnia e REST Client)
- Scripts Úteis
- Problemas Comuns
- Próximos Passos

---
## Visão Geral
Este backend gerencia:
- **Pessoas** – toda entidade humana cadastrada
- **Equipes** – grupos de trabalho
- **Teamrole** – vínculo pessoa↔equipe
- **Eventos** – eventos oficiais
- **Momentos do Evento** – agenda
- **Inscrições** – encontristas e pagamentos

Regras:
- **Coordenador** → `teamrole.is_leader = true`
- **Encontreiro** → `teamrole.is_leader = false`
- **Encontrista** → registrado em `inscricoes`

---
## Estrutura do Projeto
```
/src
  /controllers
  /routes
  supabase.js
  server.js
/scripts
  seed.js
/tests
  tests-ecc.rest
.env
README.md
```
---
## Pré-requisitos
- Node 18+
- npm
- Projeto Supabase

---
## Variáveis de Ambiente
```
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
PORT=3001
```

---
## SQL - Criação do Schema
(Conteúdo completo igual ao gerado anteriormente — tabelas `pessoas`, `equipes`, `teamrole`, `eventos`, `momentos_do_evento` e `inscricoes`.)

---
## Permissões / ACL
Necessário após recriar schema:
```
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;
```
E se estiver sem RLS:
```
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
```

---
## Iniciando o Servidor
```
npm install
node ./src/server.js
```
Servidor: `http://localhost:3001`

---
## Rotas Disponíveis
### Pessoas
- POST /pessoas
- GET /pessoas
- GET /pessoas/:id
- PUT /pessoas/:id
- DELETE /pessoas/:id

### Equipes
- POST /equipes
- GET /equipes
- GET /equipes/:id
- PUT /equipes/:id
- DELETE /equipes/:id

### Teamrole
- POST /teamrole
- GET /teamrole
- GET /teamrole/equipe/:id
- DELETE /teamrole/:id

### Eventos
- POST /eventos
- GET /eventos
- GET /eventos/:id
- PUT /eventos/:id
- DELETE /eventos/:id

### Momentos
- POST /momentos
- GET /momentos/evento/:id
- GET /momentos/:id
- DELETE /momentos/:id

### Inscrições
- POST /inscricoes
- GET /inscricoes
- GET /inscricoes/:id
- PATCH /inscricoes/:id/pagamento
- DELETE /inscricoes/:id

### Rota DEV
- DELETE /dev/reset → Truncate seguro

---
## Seed Automático
```
npm run seed
```
Cria:
- 10 coordenadores
- 20 equipes
- 200 encontreiros
- 1 evento
- momentos padrão
- 100 encontristas
- pagamentos automáticos

---
## Reset do Banco
Usa function:
```
select reset_ecc_data();
```
Ou rota:
```
DELETE http://localhost:3001/dev/reset
```

---
## Testes Manuais
### Insomnia
Importar o arquivo `.json` fornecido.

### VSCode REST Client
Executar requisições do arquivo:
```
/tests/tests-ecc.rest
```

---
## Scripts Úteis
```
"start": "node ./src/server.js",
"dev": "nodemon ./src/server.js",
"seed": "node scripts/seed.js"
```

---
## Problemas Comuns
### ❌ permission denied
Causas:
- `.env` não carregado
- usando `anon` ao invés de `service_role`
- ACL perdida após recriação

Solução:
- confirmar `dotenv.config()` no início
- rodar GRANTS
- confirmar que `supabase.js` usa SERVICE_ROLE

---
## Próximos Passos
- Autenticação Supabase
- Dashboard
- Tests automáticos
- Swagger/OpenAPI
- Deploy + CI/CD

---
## Onboarding para novos devs
1. Clonar o repo
2. Criar `.env`
3. Executar SQL do schema
4. Rodar GRANTS
5. `npm install`
6. `npm run seed`
7. Testar via Insomnia ou REST Client

---
Documentação gerada automaticamente com base no processo de desenvolvimento completo do backend ECC.

