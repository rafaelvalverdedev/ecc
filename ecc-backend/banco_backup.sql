-- ============================================
-- ECC - ESTRUTURA COMPLETA DO BANCO (ATUALIZADA)
-- ============================================

-- EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABELA: pessoas
-- Base de usuários do sistema (inclui admin, encontreiros etc.)
-- ============================================
CREATE TABLE public.pessoas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text UNIQUE,
  telefone text,
  password_hash text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- ============================================
-- TABELA: eventos
-- ============================================
CREATE TABLE public.eventos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL UNIQUE,
  descricao text,
  local text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  capacity integer,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- ============================================
-- TABELA: equipes
-- ============================================
CREATE TABLE public.equipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL UNIQUE,
  descricao text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- ============================================
-- TABELA: equipes_evento
-- Liga uma equipe a um evento
-- ============================================
CREATE TABLE public.equipes_evento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipe_id uuid NOT NULL REFERENCES public.equipes(id) ON DELETE CASCADE,
  evento_id uuid NOT NULL REFERENCES public.eventos(id) ON DELETE CASCADE,
  created_at timestamp DEFAULT now()
);

-- ============================================
-- TABELA: teamrole
-- Liga pessoa + equipe + evento
-- Isso define quem é membro e líder de equipe
-- ============================================
CREATE TABLE public.teamrole (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pessoa_id uuid NOT NULL REFERENCES public.pessoas(id) ON DELETE CASCADE,
  equipe_id uuid NOT NULL REFERENCES public.equipes(id) ON DELETE CASCADE,
  evento_id uuid REFERENCES public.eventos(id) ON DELETE CASCADE,
  is_leader boolean DEFAULT false,
  pagou boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

-- ============================================
-- TABELA: inscricoes
-- Inscrição de uma pessoa em um evento
-- tipo: encontrista ou encontreiro
-- ============================================
CREATE TABLE public.inscricoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id uuid NOT NULL REFERENCES public.eventos(id) ON DELETE CASCADE,
  pessoa_id uuid NOT NULL REFERENCES public.pessoas(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  tipo text DEFAULT 'encontrista' CHECK (tipo IN ('encontrista', 'encontreiro')),
  valor numeric,
  paid_by_pessoa_id uuid REFERENCES public.pessoas(id),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- ============================================
-- TABELA: pagamento da inscrição
-- Mercado Pago
-- ============================================
CREATE TABLE public.pagamentos_inscricao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inscricao_id uuid NOT NULL REFERENCES public.inscricoes(id) ON DELETE CASCADE,
  gateway text NOT NULL DEFAULT 'MERCADO_PAGO',
  mp_payment_id text,
  mp_preference_id text,
  mp_status text,
  mp_status_detail text,
  metodo text NOT NULL,
  valor numeric NOT NULL,
  moeda char(3) NOT NULL DEFAULT 'BRL',
  raw_payload jsonb,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- ============================================
-- TABELA: pagamentos de encontreiros (quando pagam para participar)
-- ============================================
CREATE TABLE public.pagamentos_encontreiro_evento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pessoa_id uuid NOT NULL REFERENCES public.pessoas(id) ON DELETE CASCADE,
  evento_id uuid NOT NULL REFERENCES public.eventos(id) ON DELETE CASCADE,
  pagou boolean DEFAULT false,
  data_pagamento timestamp,
  valor numeric,
  metodo text
);

-- ============================================
-- TABELA: ficha completa do encontrista
-- Grande formulário casal
-- ============================================
CREATE TABLE public.encontrista_inscricao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  nome_completo_esposo text,
  data_nascimento_esposo date,
  profissao_esposo text,
  como_chamar_esposo text,
  igreja_esposo text,
  local_trabalho_esposo text,
  celular_esposo text,
  instagram_esposo text,
  restricoes_alimentares_esposo text,
  medicamentos_alergias_esposo text,
  religiao_esposo text,
  escolaridade_esposo text,

  nome_completo_esposa text,
  data_nascimento_esposa date,
  profissao_esposa text,
  como_chamar_esposa text,
  igreja_esposa text,
  local_trabalho_esposa text,
  celular_esposa text,
  instagram_esposa text,
  restricoes_alimentares_esposa text,
  medicamentos_alergias_esposa text,
  religiao_esposa text,
  escolaridade_esposa text,

  endereco text,
  numero text,
  complemento text,
  bairro text,
  cidade text,
  uf text,
  cep text,

  data_casamento date,
  telefone_principal text,
  email text,

  possui_filhos boolean,
  quantidade_filhos integer,
  grau_parentesco_outro text,
  nome_responsavel_filhos text,
  endereco_responsavel text,
  numero_responsavel text,
  complemento_responsavel text,
  bairro_responsavel text,
  cidade_responsavel text,
  telefone_responsavel text,

  casal_que_convidou text,
  telefone_casal_que_convidou text,

  created_at timestamp DEFAULT now()
);

-- ============================================
-- TABELA: momentos do evento
-- ============================================
CREATE TABLE public.momentos_do_evento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id uuid NOT NULL REFERENCES public.eventos(id) ON DELETE CASCADE,
  equipe_id uuid REFERENCES public.equipes(id),
  titulo text NOT NULL,
  descricao text,
  start_time timestamp,
  end_time timestamp,
  ordem integer,
  previous_step_id uuid REFERENCES public.momentos_do_evento(id),
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
