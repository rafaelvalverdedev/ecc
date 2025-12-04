-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.equipes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome text NOT NULL UNIQUE,
  descricao text,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT equipes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.equipes_evento (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  equipe_id uuid NOT NULL,
  evento_id uuid NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT equipes_evento_pkey PRIMARY KEY (id),
  CONSTRAINT equipes_evento_equipe_id_fkey FOREIGN KEY (equipe_id) REFERENCES public.equipes(id),
  CONSTRAINT equipes_evento_evento_id_fkey FOREIGN KEY (evento_id) REFERENCES public.eventos(id)
);
CREATE TABLE public.eventos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome text NOT NULL UNIQUE,
  descricao text,
  local text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  capacity integer,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT eventos_pkey PRIMARY KEY (id)
);
CREATE TABLE public.inscricoes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  evento_id uuid NOT NULL,
  pessoa_id uuid NOT NULL,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'cancelled'::text])),
  paid_by_pessoa_id uuid,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  tipo text DEFAULT 'encontrista'::text CHECK (tipo = ANY (ARRAY['encontrista'::text, 'encontreiro'::text])),
  CONSTRAINT inscricoes_pkey PRIMARY KEY (id),
  CONSTRAINT fk_inscricoes_evento FOREIGN KEY (evento_id) REFERENCES public.eventos(id),
  CONSTRAINT fk_inscricoes_pessoa FOREIGN KEY (pessoa_id) REFERENCES public.pessoas(id),
  CONSTRAINT fk_inscricoes_paid_by FOREIGN KEY (paid_by_pessoa_id) REFERENCES public.pessoas(id)
);
CREATE TABLE public.momentos_do_evento (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  evento_id uuid NOT NULL,
  equipe_id uuid,
  titulo text NOT NULL,
  descricao text,
  start_time timestamp without time zone,
  end_time timestamp without time zone,
  ordem integer,
  previous_step_id uuid,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT momentos_do_evento_pkey PRIMARY KEY (id),
  CONSTRAINT fk_momentos_evento FOREIGN KEY (evento_id) REFERENCES public.eventos(id),
  CONSTRAINT fk_momentos_equipe FOREIGN KEY (equipe_id) REFERENCES public.equipes(id),
  CONSTRAINT fk_momentos_previous FOREIGN KEY (previous_step_id) REFERENCES public.momentos_do_evento(id)
);
CREATE TABLE public.pessoas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text,
  telefone text,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  auth_uid text UNIQUE,
  role text,
  CONSTRAINT pessoas_pkey PRIMARY KEY (id)
);
CREATE TABLE public.teamrole (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pessoa_id uuid NOT NULL,
  equipe_id uuid NOT NULL,
  is_leader boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT teamrole_pkey PRIMARY KEY (id),
  CONSTRAINT fk_teamrole_equipe FOREIGN KEY (equipe_id) REFERENCES public.equipes(id),
  CONSTRAINT fk_teamrole_pessoa FOREIGN KEY (pessoa_id) REFERENCES public.pessoas(id)
);