-- 1) Função utilitária: atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- 2) Attach trigger to common tables (if they exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='pessoas') THEN
    DROP TRIGGER IF EXISTS trg_set_updated_at_pessoas ON public.pessoas;
    CREATE TRIGGER trg_set_updated_at_pessoas
      BEFORE UPDATE ON public.pessoas
      FOR EACH ROW
      EXECUTE PROCEDURE public.set_updated_at();
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='equipes') THEN
    DROP TRIGGER IF EXISTS trg_set_updated_at_equipes ON public.equipes;
    CREATE TRIGGER trg_set_updated_at_equipes
      BEFORE UPDATE ON public.equipes
      FOR EACH ROW
      EXECUTE PROCEDURE public.set_updated_at();
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='eventos') THEN
    DROP TRIGGER IF EXISTS trg_set_updated_at_eventos ON public.eventos;
    CREATE TRIGGER trg_set_updated_at_eventos
      BEFORE UPDATE ON public.eventos
      FOR EACH ROW
      EXECUTE PROCEDURE public.set_updated_at();
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='inscricoes') THEN
    DROP TRIGGER IF EXISTS trg_set_updated_at_inscricoes ON public.inscricoes;
    CREATE TRIGGER trg_set_updated_at_inscricoes
      BEFORE UPDATE ON public.inscricoes
      FOR EACH ROW
      EXECUTE PROCEDURE public.set_updated_at();
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='teamrole') THEN
    DROP TRIGGER IF EXISTS trg_set_updated_at_teamrole ON public.teamrole;
    CREATE TRIGGER trg_set_updated_at_teamrole
      BEFORE UPDATE ON public.teamrole
      FOR EACH ROW
      EXECUTE PROCEDURE public.set_updated_at();
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='momentos_do_evento') THEN
    DROP TRIGGER IF EXISTS trg_set_updated_at_momentos ON public.momentos_do_evento;
    CREATE TRIGGER trg_set_updated_at_momentos
      BEFORE UPDATE ON public.momentos_do_evento
      FOR EACH ROW
      EXECUTE PROCEDURE public.set_updated_at();
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='equipes_evento') THEN
    DROP TRIGGER IF EXISTS trg_set_updated_at_equipes_evento ON public.equipes_evento;
    CREATE TRIGGER trg_set_updated_at_equipes_evento
      BEFORE UPDATE ON public.equipes_evento
      FOR EACH ROW
      EXECUTE PROCEDURE public.set_updated_at();
  END IF;
END
$$;


-- 3) Função + trigger para limitar líderes por equipe (até 2)
--    A trigger verifica INSERT/UPDATE: se NEW.is_leader = true então conta líderes existentes (exceto se atualizar mesmo registro)
CREATE OR REPLACE FUNCTION public.check_team_leaders_limit()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  leaders_count int;
  current_id uuid;
BEGIN
  -- If the incoming row is not setting is_leader true, nothing to check
  IF COALESCE(NEW.is_leader, false) = false THEN
    RETURN NEW;
  END IF;

  -- On UPDATE, exclude the current row id from the count (if present)
  current_id := NULL;
  IF TG_OP = 'UPDATE' THEN
    current_id := NEW.id;
  END IF;

  SELECT COUNT(*) INTO leaders_count
  FROM public.teamrole
  WHERE equipe_id = NEW.equipe_id
    AND is_leader = true
    AND (current_id IS NULL OR id IS DISTINCT FROM current_id);

  IF leaders_count >= 2 THEN
    RAISE EXCEPTION 'A equipe já possui o número máximo de líderes (2)';
  END IF;

  RETURN NEW;
END;
$$;

-- Attach trigger to teamrole table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='teamrole') THEN
    DROP TRIGGER IF EXISTS trg_check_team_leaders_limit ON public.teamrole;
    CREATE TRIGGER trg_check_team_leaders_limit
      BEFORE INSERT OR UPDATE OF is_leader, equipe_id ON public.teamrole
      FOR EACH ROW
      EXECUTE PROCEDURE public.check_team_leaders_limit();
  END IF;
END
$$;


-- 4) Optional: ensure that equipes_evento unique constraint exists (you already have unique index)
-- If not present, create unique constraint (safe if index exists, will fail otherwise so we check)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname='public' AND tablename='equipes_evento' AND indexname='unique_equipe_evento'
  ) THEN
    -- index already exists, nothing to do
    RAISE NOTICE 'index unique_equipe_evento already exists';
  ELSE
    -- create unique constraint if possible (requires equipe_id and evento_id columns exist)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='equipes_evento' AND column_name='equipe_id')
    AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='equipes_evento' AND column_name='evento_id') THEN
      ALTER TABLE public.equipes_evento
        ADD CONSTRAINT unique_equipe_evento UNIQUE (equipe_id, evento_id);
    END IF;
  END IF;
END
$$;


-- 5) Helpful: function to normalize ordem (order) on momentos_do_evento is optional
-- (we won't implement complex logic here; you can request later)

-- 6) Grants (examples) — typically Supabase already granted appropriate rights.
--    We ensure service_role has full rights (service_role is a special role on Supabase).
--    NOTE: service_role exists in Supabase environment; if you run as superuser these grants are no-op.
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;

-- 7) Recommended: create indexes if missing (most already exist in your DB)
-- Example (safe if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname='public' AND tablename='inscricoes' AND indexname='idx_inscricoes_evento') THEN
    CREATE INDEX idx_inscricoes_evento ON public.inscricoes (evento_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname='public' AND tablename='momentos_do_evento' AND indexname='idx_momentos_evento') THEN
    CREATE INDEX idx_momentos_evento ON public.momentos_do_evento (evento_id);
  END IF;
END
$$;

-- 8) Clean up: ensure foreign keys exist (no action here if already present)

-- Done.
