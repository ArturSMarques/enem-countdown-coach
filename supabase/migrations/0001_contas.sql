-- Reta Enem — fase 11: contas, perfil e progresso salvo na conta.
-- Como aplicar: Supabase → SQL Editor → New query → cole este arquivo inteiro → Run (docs/supabase.md).
-- Pode rodar de novo sem problema: tudo usa "if not exists" / "or replace".
--
-- Regras principais
-- * Cada aluno só lê e altera os próprios dados (Row Level Security).
-- * Menor de idade: o progresso só pode ir para o servidor depois que o responsável autorizar.
-- * O aluno só pode mudar o próprio apelido e avatar; consentimento e e-mail do responsável só mudam
--   pelas funções abaixo.
-- * Nada de nome, telefone ou escola: só o mínimo para a conta funcionar.

-- ---------------------------------------------------------------------------
-- Perfil (1 por conta de aluno). O responsável não tem perfil: só confirma por link.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  apelido text not null check (apelido ~ '^[A-Za-z0-9_.-]{3,20}$'),
  avatar text not null default 'a1' check (avatar ~ '^a([1-9]|10)$'),
  adulto boolean not null,
  responsavel_email text check (responsavel_email is null or position('@' in responsavel_email) > 1),
  consentimento_em timestamptz,
  consentimento_por text,
  termos_versao text not null,
  termos_em timestamptz not null default now(),
  criado_em timestamptz not null default now(),
  check (adulto or responsavel_email is not null)
);
create unique index if not exists profiles_apelido_unico on public.profiles (lower(apelido));
create index if not exists profiles_responsavel on public.profiles (lower(responsavel_email));

alter table public.profiles enable row level security;

drop policy if exists "perfil: ler o próprio" on public.profiles;
create policy "perfil: ler o próprio" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

drop policy if exists "perfil: alterar o próprio" on public.profiles;
create policy "perfil: alterar o próprio" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- O perfil é criado pelo gatilho do cadastro; o aluno só pode mudar apelido e avatar.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (apelido, avatar) on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Progresso: o mesmo conteúdo salvo no aparelho (plano, respostas, metas...), em JSON.
-- ---------------------------------------------------------------------------
create table if not exists public.progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null,
  atualizado_em timestamptz not null default now()
);

alter table public.progress enable row level security;

-- Adulto, ou menor com autorização do responsável.
create or replace function public.pode_sincronizar()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and (p.adulto or p.consentimento_em is not null)
  );
$$;

drop policy if exists "progresso: ler o próprio" on public.progress;
create policy "progresso: ler o próprio" on public.progress
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "progresso: criar o próprio, se autorizado" on public.progress;
create policy "progresso: criar o próprio, se autorizado" on public.progress
  for insert to authenticated
  with check ((select auth.uid()) = user_id and (select public.pode_sincronizar()));

drop policy if exists "progresso: alterar o próprio, se autorizado" on public.progress;
create policy "progresso: alterar o próprio, se autorizado" on public.progress
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id and (select public.pode_sincronizar()));

drop policy if exists "progresso: apagar o próprio" on public.progress;
create policy "progresso: apagar o próprio" on public.progress
  for delete to authenticated using ((select auth.uid()) = user_id);

revoke all on public.progress from anon, authenticated;
grant select, insert, update, delete on public.progress to authenticated;

-- ---------------------------------------------------------------------------
-- Cadastro: cria o perfil a partir dos dados enviados no signUp. Contas sem apelido (o responsável,
-- que entra só por link) não ganham perfil.
-- ---------------------------------------------------------------------------
create or replace function public.criar_perfil()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  responsavel text := nullif(trim(meta ->> 'responsavel_email'), '');
begin
  if meta ->> 'apelido' is null then
    return new;
  end if;
  if responsavel is not null and lower(responsavel) = lower(new.email) then
    raise exception 'O e-mail do responsável precisa ser diferente do e-mail do aluno.';
  end if;
  insert into public.profiles (id, apelido, avatar, adulto, responsavel_email, termos_versao)
  values (
    new.id,
    meta ->> 'apelido',
    coalesce(meta ->> 'avatar', 'a1'),
    coalesce((meta ->> 'adulto')::boolean, false),
    responsavel,
    coalesce(meta ->> 'termos_versao', '?')
  );
  return new;
end;
$$;

drop trigger if exists ao_criar_usuario on auth.users;
create trigger ao_criar_usuario
  after insert on auth.users
  for each row execute function public.criar_perfil();

-- ---------------------------------------------------------------------------
-- Funções chamadas pelo app
-- ---------------------------------------------------------------------------

-- Apelido livre? (para avisar antes do cadastro; não revela mais nada)
create or replace function public.apelido_disponivel(p_apelido text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select not exists (select 1 from public.profiles where lower(apelido) = lower(p_apelido));
$$;

-- Responsável logado pelo link: alunos que indicaram este e-mail e ainda esperam autorização.
create or replace function public.consentimentos_pendentes()
returns table (id uuid, apelido text, criado_em timestamptz, autorizado boolean)
language sql
stable
security definer
set search_path = ''
as $$
  select p.id, p.apelido, p.criado_em, p.consentimento_em is not null
  from public.profiles p
  where not p.adulto
    and lower(p.responsavel_email) = lower(auth.jwt() ->> 'email');
$$;

create or replace function public.autorizar_aluno(p_aluno uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set consentimento_em = now(), consentimento_por = auth.jwt() ->> 'email'
  where id = p_aluno
    and not adulto
    and lower(responsavel_email) = lower(auth.jwt() ->> 'email');
  return found;
end;
$$;

-- O responsável pode retirar a autorização: o progresso salvo no servidor é apagado.
create or replace function public.revogar_autorizacao(p_aluno uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set consentimento_em = null, consentimento_por = null
  where id = p_aluno
    and not adulto
    and lower(responsavel_email) = lower(auth.jwt() ->> 'email');
  if found then
    delete from public.progress where user_id = p_aluno;
  end if;
  return found;
end;
$$;

-- Aluno ainda sem autorização pode corrigir o e-mail do responsável.
create or replace function public.trocar_responsavel(p_email text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_email is null or position('@' in p_email) <= 1 then
    raise exception 'E-mail do responsável inválido.';
  end if;
  if lower(p_email) = lower(auth.jwt() ->> 'email') then
    raise exception 'O e-mail do responsável precisa ser diferente do e-mail do aluno.';
  end if;
  update public.profiles
  set responsavel_email = trim(p_email)
  where id = auth.uid() and not adulto and consentimento_em is null;
  return found;
end;
$$;

-- Excluir a própria conta: apaga o usuário, o perfil e o progresso (em cascata).
create or replace function public.excluir_minha_conta()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from auth.users where id = auth.uid();
$$;

revoke all on function public.pode_sincronizar() from public, anon;
revoke all on function public.criar_perfil() from public, anon, authenticated;
revoke all on function public.consentimentos_pendentes() from public, anon;
revoke all on function public.autorizar_aluno(uuid) from public, anon;
revoke all on function public.revogar_autorizacao(uuid) from public, anon;
revoke all on function public.trocar_responsavel(text) from public, anon;
revoke all on function public.excluir_minha_conta() from public, anon;
grant execute on function public.apelido_disponivel(text) to anon, authenticated;
grant execute on function public.pode_sincronizar() to authenticated;
grant execute on function public.consentimentos_pendentes() to authenticated;
grant execute on function public.autorizar_aluno(uuid) to authenticated;
grant execute on function public.revogar_autorizacao(uuid) to authenticated;
grant execute on function public.trocar_responsavel(text) to authenticated;
grant execute on function public.excluir_minha_conta() to authenticated;
