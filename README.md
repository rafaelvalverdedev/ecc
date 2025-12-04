# ECC — Aplicação de Gestão do Encontro de Casais com Cristo

## Objetivo

Aplicação para gerenciar equipes, coordenadores e inscrições para o Encontro de Casais com Cristo (ECC). Permite cadastro de equipes, gerenciamento por coordenadores, organograma e fluxo de inscrições (com opção de pagamento integrado).

## MVP (Funcionalidades mínimas)

* Autenticação de coordenadores e administrador.
* CRUD de equipes e coordenadores.
* Formulário de inscrição para participantes (capturar dados básicos).
* Visualização de organograma por equipe.
* Painel do coordenador com lista de inscritos.
* Export CSV dos inscritos (básico).

## Tecnologias (propostas)

* Front/Fullstack: Next.js (React)
* Banco de dados: PostgreSQL (ex.: Supabase)
* ORM: Prisma (opcional)
* Autenticação: Supabase Auth ou NextAuth
* Pagamento: Integração posterior com Stripe / Mercado Pago / PagSeguro
* Estilização: Tailwind CSS

## Estrutura inicial

* `src/` - código fonte
* `docs/` - documentação e modelagem (ER, user stories)
* `.env` - variáveis de ambiente (não commitar)

basch
```
git init
npm init -y
```

basch
```
# criar .gitignore
echo "node_modules\n.env\n.DS_Store" > .gitignore
```

# criar estrutura mínima
mkdir src
mkdir docs
touch README.md

# Instalar Next.js
basch
```
npm install next react react-dom
# adiciona scripts ao package.json (ou edite manualmente)
# no package.json, em "scripts" adicione:
# "dev": "next dev", "build": "next build", "start": "next start"
```

-----
## Próximos passos (Passo 2)

1. Definir os campos do banco (modelo de dados).
2. Escolher provedor do DB (Supabase recomendado).
3. Implementar endpoints básicos (autenticação, equipes, inscrições).

## Como executar (desenvolvimento)

1. Instalar dependências: `npm install`
2. Rodar em modo dev: `npm run dev`


# ECC — Documentação (Passos realizados até aqui)
# ECC — Documentação (Passos realizados até aqui)

Este README documenta **passo a passo tudo o que foi planejado e executado** até o momento na construção da aplicação para o *Encontro de Casais com Cristo (ECC)* usando **Supabase** como backend. Serve como documentação/tutor para você (ou qualquer outra pessoa) no futuro.

> Observação: este documento registra apenas o trabalho concluído até a etapa atual (modelagem, criação de tabelas, RLS e dados de teste). O próximo ciclo inclui front-end, pagamentos e deploy.

---

## Sumário

1. Objetivo do projeto
2. Escolha de stack
3. Modelo de dados (entidades e relacionamentos)
4. SQL executado (ordem e trechos principais)
5. Ativação e configuração de RLS (políticas)
6. Inserção de dados de teste (passo a passo)
7. Como validar manualmente (testes e procedimentos)
8. Próximos passos recomendados

---

## 1 — Objetivo do projeto

Construir uma aplicação para gerenciar o ECC com:

* Perfis: `admin`, `coordinator`, `attendee` (inscrito).
* Equipes responsáveis por momentos do evento.
* Cronograma (momentos do evento) onde cada bloco tem uma equipe responsável.
* Inscrições de usuários para eventos.
* Controle de acesso via RLS (Row-Level Security) para garantir que:

  * `admin` pode tudo;
  * `coordinator` edita apenas momentos da sua(s) equipe(s);
  * `attendee` tem apenas leitura.

---

## 2 — Escolha de stack

* **Backend / DB / Auth**: Supabase (PostgreSQL + Auth + API automática)
* **Motivo**: reduz complexidade para um dev solo — autenticação pronta, painel visual, RLS via SQL, API gerada automaticamente.

---

## 3 — Modelo de dados (entidades principais)

Entidades usadas:

* `users` — todos os usuários (admin, coordinator, attendee)
* `teams` — equipes (cada equipe representa uma responsabilidade)
* `teamrole` — relação N:N entre `users` e `teams` (com `is_leader`)
* `eventos` — eventos (ex.: ECC 2025)
* `momentos_do_evento` — cronograma (cada momento pertence a um evento e a uma equipe)
* `inscricoes` — inscrições dos usuários em eventos

Relacionamentos principais:

* `users` ⇄ `teamrole` ⇄ `teams`
* `eventos` 1:N `momentos_do_evento`
* `eventos` N:N `users` via `inscricoes`
* `momentos_do_evento` → `teams` (cada momento tem equipe responsável)

---

## 4 — SQL executado (em ordem)

> Executei os comandos no SQL Editor do Supabase nesta ordem. Abaixo estão os trechos usados.

### 4.1 — Types e tabela `users`

```sql
create type user_role as enum ('admin', 'coordinator', 'attendee');

create table users (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null unique,
    phone text not null,
    role user_role not null,
    created_at timestamp default now(),
    updated_at timestamp default now()
);
```

### 4.2 — Tabela `teams`

```sql
create table teams (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    created_at timestamp default now(),
    updated_at timestamp default now()
);
```

### 4.3 — Tabela `eventos`

```sql
create table eventos (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    local text,
    start_date date not null,
    end_date date not null,
    capacity int,
    created_at timestamp default now(),
    updated_at timestamp default now()
);
```

### 4.4 — Tabela `momentos_do_evento`

```sql
create table momentos_do_evento (
    id uuid primary key default gen_random_uuid(),
    evento_id uuid not null references eventos(id) on delete cascade,
    equipe_id uuid not null references teams(id) on delete restrict,
    title text not null,
    description text,
    start_time timestamp not null,
    end_time timestamp not null,
    order_position int not null,
    previous_step_id uuid references momentos_do_evento(id),
    created_at timestamp default now(),
    updated_at timestamp default now()
);
```

### 4.5 — Types e tabela `inscricoes`

```sql
create type registration_status as enum ('pending', 'confirmed', 'cancelled');

create table inscricoes (
    id uuid primary key default gen_random_uuid(),
    evento_id uuid not null references eventos(id) on delete cascade,
    user_id uuid not null references users(id) on delete cascade,
    status registration_status not null default 'pending',
    created_at timestamp default now(),
    updated_at timestamp default now()
);
```

### 4.6 — Tabela `teamrole`

```sql
create table teamrole (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    team_id uuid references teams(id) on delete cascade,
    is_leader boolean default false,
    created_at timestamp default now()
);
```

---

## 5 — Ativação e políticas RLS principais

### 5.1 — Ativar RLS nas tabelas

```sql
alter table users enable row level security;
alter table teams enable row level security;
alter table eventos enable row level security;
alter table momentos_do_evento enable row level security;
alter table inscricoes enable row level security;
```

### 5.2 — Policies exemplares aplicadas

* **Users**

```sql
create policy "Admin full access on users" 
on users
for all
using (auth.jwt() ->> 'role' = 'admin');

create policy "User can read own profile" 
on users
for select
using (id = auth.uid());

create policy "User cannot modify others" 
on users
for update
using (auth.jwt() ->> 'role' = 'admin');
```

* **Momentos do evento**

```sql
create policy "Admin full access on momentos" 
on momentos_do_evento
for all
using (auth.jwt() ->> 'role' = 'admin');

create policy "Coordinator can edit own team moments"
on momentos_do_evento
for update
using (
  auth.jwt() ->> 'role' = 'coordinator' AND 
  equipe_id IN (
    SELECT team_id FROM teamrole tr WHERE tr.user_id = auth.uid()
  )
);

create policy "Anyone can read cronograma"
on momentos_do_evento
for select
using (true);
```

> Nota: no código acima substituí a subquery para checar `teamrole`, pois a implementação final usa essa tabela.

* **Inscricoes**

```sql
create policy "Admin full access on inscricoes"
on inscricoes
for all
using (auth.jwt() ->> 'role' = 'admin');

create policy "User can read own inscricoes"
on inscricoes
for select
using (user_id = auth.uid());

create policy "User can insert own inscricoes"
on inscricoes
for insert
with check (user_id = auth.uid());

create policy "Only admin can update inscricoes"
on inscricoes
for update
using (auth.jwt() ->> 'role' = 'admin');
```

* **Teams / Eventos**

```sql
create policy "Admin full access on teams" 
on teams
for all
using (auth.jwt() ->> 'role' = 'admin');

create policy "Everyone can read teams" 
on teams
for select
using (true);

create policy "Admin full access on eventos" 
on eventos
for all
using (auth.jwt() ->> 'role' = 'admin');

create policy "Everyone can read eventos" 
on eventos
for select
using (true);
```

---

## 6 — Inserção de dados de teste (passo a passo)

### 6.1 — Inserir usuários de teste

```sql
insert into users (name, email, phone, role) values
('Admin Test', 'admin@test.com', '11999999999', 'admin'),
('Coord 1', 'coord1@test.com', '11988888888', 'coordinator'),
('Coord 2', 'coord2@test.com', '11977777777', 'coordinator'),
('Inscrito 1', 'inscrito1@test.com', '11966666666', 'attendee'),
('Inscrito 2', 'inscrito2@test.com', '11955555555', 'attendee');
```

> Obs: para testes de RLS também é necessário criar as contas correspondentes no **Authentication → Users** com as mesmas emails e uma senha qualquer (ex.: `123456`) — o registro em `users` é meta-dado; o Auth do Supabase gera `auth.uid()`.

### 6.2 — Inserir equipes

```sql
insert into teams (name, description) values
('Equipe A', 'Responsável momentos A'),
('Equipe B', 'Responsável momentos B');
```

### 6.3 — Inserir teamrole (atribuir coordenadores)

```sql
-- Coord 1 lidera Equipe A
insert into teamrole (user_id, team_id, is_leader)
select u.id, t.id, true
from users u, teams t
where u.email='coord1@test.com' and t.name='Equipe A';

-- Coord 2 lidera Equipe B
insert into teamrole (user_id, team_id, is_leader)
select u.id, t.id, true
from users u, teams t
where u.email='coord2@test.com' and t.name='Equipe B';
```

### 6.4 — Inserir evento de teste

```sql
insert into eventos (name, description, local, start_date, end_date) values
('ECC Teste 2025', 'Evento de teste ECC', 'Igreja Central', '2025-12-01', '2025-12-03');
```

### 6.5 — Inserir momentos do evento (cronograma)

```sql
insert into momentos_do_evento (evento_id, equipe_id, title, start_time, end_time, order_position)
select e.id, t.id, 'Acolhida', '2025-12-01 08:00', '2025-12-01 09:00', 1
from eventos e, teams t
where e.name='ECC Teste 2025' and t.name='Equipe A';

-- (repetir para demais momentos, alternando equipe B e A conforme planejamento)
```

### 6.6 — Inserir inscricoes de teste (opcional)

```sql
insert into inscricoes (evento_id, user_id, status)
select e.id, u.id, 'pending'
from eventos e, users u
where e.name='ECC Teste 2025' and u.email = 'inscrito1@test.com';
```

---

## 7 — Como validar manualmente (passo a passo que você pode seguir)

### 7.1 — Verificar existência das tabelas

No SQL Editor:

```sql
select * from users limit 1;
select * from teams limit 1;
select * from eventos limit 1;
select * from momentos_do_evento limit 1;
select * from inscricoes limit 1;
```

* Resultado “No rows returned” é ok se ainda não houver dados.
* Erros indicam problema na criação.

### 7.2 — Criar contas no Supabase Auth

Vá em **Authentication → Users → Add User** e crie contas com os emails usados nos inserts, ex.: `coord1@test.com` com senha `123456`.

### 7.3 — Testar RLS usando “Run as user”

No SQL Editor do Supabase existe a opção **“Run as user”** (ou “Execute as”) — escolha o usuário para simular `auth.uid()`:

* **Como Coord 1**:

  * `select * from momentos_do_evento;` → leitura de todo cronograma
  * `update momentos_do_evento set title='Teste' where title='Acolhida';` → deve **suceder** (momento da Equipe A)
  * Tentar editar momento da Equipe B → **deve falhar**

* **Como Coord 2**: mesma lógica, mas só pode editar momentos da Equipe B.

* **Como Inscrito**:

  * `select * from momentos_do_evento;` → leitura OK
  * `update ...` → **falha** (sem permissão)

* **Como Admin**:

  * Pode executar selects, inserts, updates e deletes em todas as tabelas.

### 7.4 — Testar integridade referencial

* Tentar inserir `momentos_do_evento` com `evento_id` inválido → deve falhar.
* Deletar evento → momentos relacionados devem ser removidos (ON DELETE CASCADE).

---

## 8 — Próximos passos recomendados (após validação)

1. **Front-end inicial (MVP)**

   * Recomendo Next.js com Supabase JS para autenticação e consumo de dados.
   * Telas mínimas: Login, Dashboard (admin), Painel do Coordenador, Cronograma (visualização pública), Formulário de inscrição.

2. **Integração de pagamentos (opcional para MVP)**

   * Stripe ou Mercado Pago; crie fluxo em sandbox antes de produção.

3. **Endpoints e funções serverless (se necessário)**

   * Para lógica sensível (ex.: confirmar pagamento e criar inscrição), crie pequenas functions (Supabase Edge Functions ou API própria).

4. **Backups e monitoramento**

   * Configure backups periódicos do DB (Supabase oferece opções) antes de entrar em produção.

5. **Documentação API / Postman**

   * Gerar collection com endpoints que o front consumirá.

6. **Aprimorar RLS/Policies**

   * Revisar políticas quando o front estiver pronto porque mudanças de UI podem exigir ajustes.

---

## Anexos rápidos (onde encontrar cada coisa no Supabase)

* **Table Editor** → visualização e edição de dados.
* **SQL Editor** → rodar os SQL scripts listados acima.
* **Authentication → Users** → gerenciar contas para testes.
* **Policies / Row Level Security** → revisar políticas aplicadas (menu da tabela específica).

---

Se quiser, eu posso:

* Gerar um arquivo `.sql` contendo todos os comandos acima (para importar/backup).
* Criar um diagrama ER em texto/imagem.
* Preparar um **README específico para o front-end** (Next.js + Supabase) com exemplos de login e chamadas.

