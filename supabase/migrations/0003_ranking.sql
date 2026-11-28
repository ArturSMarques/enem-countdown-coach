-- Reta Enem — fase 12: ranking compartilhado com proteção contra trapaça.
-- Rode depois do 0001 e do 0002 (SQL Editor → New query → colar → Run) e, em seguida, rode
-- supabase/gabarito.sql (o gabarito das questões). Pode rodar de novo sem problema.
--
-- Como funciona
-- * O app manda só "qual questão, qual alternativa e quanto tempo levou". Quem confere o gabarito e
--   calcula os pontos é o servidor (a mesma regra do XP: 2 por resposta, +5/+10/+20 por acerto
--   conforme a dificuldade). Nenhum número de pontos vindo do navegador é aceito.
-- * Resposta em menos de 3 segundos, a mesma questão de novo em menos de 24 horas ou acima dos
--   limites por minuto, hora e dia: fica registrada, mas vale 0 ponto.
-- * Casos estranhos vão para a tabela "suspeitas" para a equipe olhar. Quem a equipe marcar com
--   profiles.sinalizado = true sai do ranking (Table Editor → profiles).
-- * O ranking mostra só apelido, avatar e pontos. Menor sem autorização do responsável não envia
--   nada e não aparece; qualquer aluno pode escolher não aparecer.
-- * O ranking começa do zero: só contam respostas registradas a partir desta fase.
-- Os números abaixo estão também em src/lib/ranking-config.ts (um teste confere os dois).

-- ---------------------------------------------------------------------------
-- Gabarito no servidor (preenchido por supabase/gabarito.sql, gerado com `bun run gabarito`).
-- Ninguém de fora lê esta tabela: só as funções abaixo.
-- ---------------------------------------------------------------------------
create table if not exists public.gabarito (
  questao text primary key,
  resposta smallint not null check (resposta >= 0),
  alternativas smallint not null check (alternativas between 2 and 6),
  nivel text not null check (nivel in ('facil', 'media', 'dificil')),
  check (resposta < alternativas)
);
alter table public.gabarito enable row level security;
revoke all on public.gabarito from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Perfil: marcação da equipe e escolha do aluno de aparecer ou não.
-- ---------------------------------------------------------------------------
alter table public.profiles add column if not exists sinalizado boolean not null default false;
alter table public.profiles add column if not exists aparecer_no_ranking boolean not null default true;

-- ---------------------------------------------------------------------------
-- Respostas registradas com a conta (só pelo servidor, pela função registrar_respostas).
-- motivo: vazio = contou; rapida, sem_tempo, repetida, limite_minuto, limite_hora, limite_dia = 0 ponto.
-- ---------------------------------------------------------------------------
create table if not exists public.respostas (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  questao text not null,
  escolha smallint not null,
  acertou boolean not null,
  ms integer,
  pontos smallint not null default 0,
  motivo text,
  respondido_em timestamptz not null default now()
);
create index if not exists respostas_usuario_quando on public.respostas (user_id, respondido_em desc);
create index if not exists respostas_usuario_questao on public.respostas (user_id, questao, respondido_em desc);
create index if not exists respostas_quando on public.respostas (respondido_em);

alter table public.respostas enable row level security;
drop policy if exists "respostas: ler as próprias" on public.respostas;
create policy "respostas: ler as próprias" on public.respostas
  for select to authenticated using ((select auth.uid()) = user_id);
revoke all on public.respostas from anon, authenticated;
grant select on public.respostas to authenticated;

-- ---------------------------------------------------------------------------
-- Casos para a equipe revisar (sem acesso pelo app; ver no Table Editor).
-- ---------------------------------------------------------------------------
create table if not exists public.suspeitas (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  motivo text not null,
  detalhe jsonb not null default '{}'::jsonb,
  criado_em timestamptz not null default now(),
  revisada boolean not null default false
);
create index if not exists suspeitas_usuario on public.suspeitas (user_id, motivo, criado_em desc);
alter table public.suspeitas enable row level security;
revoke all on public.suspeitas from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Registrar respostas (uma ou várias de uma vez, como no mini-simulado).
-- p_respostas: [{"q": "id da questão", "c": alternativa (0 = A), "ms": tempo em milissegundos}]
-- ---------------------------------------------------------------------------
create or replace function public.registrar_respostas(p_respostas jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  ms_minimo constant int := 3000;
  horas_repeticao constant int := 24;
  max_por_minuto constant int := 30;
  max_pontos_hora constant int := 600;
  max_pontos_dia constant int := 2000;
  max_lote constant int := 30;
  pontos_resposta constant int := 2;
  bonus_facil constant int := 5;
  bonus_media constant int := 10;
  bonus_dificil constant int := 20;
  rapidas_suspeitas constant int := 10;
  minimo_acertos_suspeitos constant int := 30;

  uid uuid := auth.uid();
  inicio_dia timestamptz :=
    date_trunc('day', now() at time zone 'America/Sao_Paulo') at time zone 'America/Sao_Paulo';
  item jsonb;
  g public.gabarito%rowtype;
  v_questao text;
  v_escolha int;
  v_ms int;
  v_acertou boolean;
  v_pontos int;
  v_motivo text;
  n_minuto int;
  soma_hora int;
  soma_dia int;
  total int := 0;
  contadas int := 0;
  recebidas int := 0;
  h_total int;
  h_rapidas int;
  h_acertos int;
  h_limite boolean;
begin
  if uid is null then
    raise exception 'É preciso entrar na conta.';
  end if;
  if not public.pode_sincronizar() then
    return jsonb_build_object('pontos', 0, 'contadas', 0, 'recebidas', 0, 'bloqueado', true);
  end if;
  if p_respostas is null or jsonb_typeof(p_respostas) <> 'array' then
    raise exception 'Formato inválido.';
  end if;
  if jsonb_array_length(p_respostas) > max_lote then
    raise exception 'Respostas demais de uma vez.';
  end if;

  -- Uma chamada por vez para cada aluno, para os limites valerem mesmo com chamadas simultâneas.
  perform pg_advisory_xact_lock(hashtextextended('ranking:' || uid::text, 0));

  for item in select value from jsonb_array_elements(p_respostas) loop
    v_questao := case when jsonb_typeof(item -> 'q') = 'string' then item ->> 'q' end;
    v_escolha := case
      when jsonb_typeof(item -> 'c') = 'number' and (item ->> 'c') ~ '^[0-9]{1,2}$'
      then (item ->> 'c')::int end;
    v_ms := case
      when jsonb_typeof(item -> 'ms') = 'number' and (item ->> 'ms') ~ '^[0-9]{1,9}(\.[0-9]+)?$'
      then least(round((item ->> 'ms')::numeric), 86400000)::int end;

    select * into g from public.gabarito where questao = v_questao;
    -- Questão desconhecida ou alternativa que não existe: ignorada (não é registrada).
    if not found or v_escolha is null or v_escolha >= g.alternativas then
      continue;
    end if;
    recebidas := recebidas + 1;

    v_acertou := v_escolha = g.resposta;
    v_pontos := pontos_resposta + case
      when not v_acertou then 0
      when g.nivel = 'facil' then bonus_facil
      when g.nivel = 'media' then bonus_media
      else bonus_dificil end;

    select count(*) filter (where respondido_em > now() - interval '1 minute'),
           coalesce(sum(pontos) filter (where respondido_em > now() - interval '1 hour'), 0),
           coalesce(sum(pontos) filter (where respondido_em >= inicio_dia), 0)
      into n_minuto, soma_hora, soma_dia
      from public.respostas
      where user_id = uid and respondido_em > least(now() - interval '1 hour', inicio_dia);

    v_motivo := case
      when v_ms is null then 'sem_tempo'
      when v_ms < ms_minimo then 'rapida'
      when exists (
        select 1 from public.respostas
        where user_id = uid and questao = v_questao
          and respondido_em > now() - make_interval(hours => horas_repeticao)
      ) then 'repetida'
      when n_minuto >= max_por_minuto then 'limite_minuto'
      when soma_hora + v_pontos > max_pontos_hora then 'limite_hora'
      when soma_dia + v_pontos > max_pontos_dia then 'limite_dia'
    end;
    if v_motivo is not null then
      v_pontos := 0;
    end if;

    insert into public.respostas (user_id, questao, escolha, acertou, ms, pontos, motivo)
    values (uid, v_questao, v_escolha, v_acertou, v_ms, v_pontos, v_motivo);
    total := total + v_pontos;
    if v_motivo is null then
      contadas := contadas + 1;
    end if;
  end loop;

  -- Casos para a equipe olhar (no máximo um registro por motivo por hora para cada aluno).
  select count(*), count(*) filter (where motivo = 'rapida'), count(*) filter (where acertou),
         bool_or(coalesce(motivo, '') like 'limite%')
    into h_total, h_rapidas, h_acertos, h_limite
    from public.respostas where user_id = uid and respondido_em > now() - interval '1 hour';

  if h_rapidas >= rapidas_suspeitas then
    insert into public.suspeitas (user_id, motivo, detalhe)
    select uid, 'muitas_rapidas', jsonb_build_object('rapidas_na_hora', h_rapidas, 'respostas_na_hora', h_total)
    where not exists (select 1 from public.suspeitas
      where user_id = uid and motivo = 'muitas_rapidas' and criado_em > now() - interval '1 hour');
  end if;
  if coalesce(h_limite, false) then
    insert into public.suspeitas (user_id, motivo, detalhe)
    select uid, 'limite_atingido', jsonb_build_object('respostas_na_hora', h_total)
    where not exists (select 1 from public.suspeitas
      where user_id = uid and motivo = 'limite_atingido' and criado_em > now() - interval '1 hour');
  end if;
  if h_total >= minimo_acertos_suspeitos and h_acertos * 100 >= h_total * 95 then
    insert into public.suspeitas (user_id, motivo, detalhe)
    select uid, 'acertos_demais', jsonb_build_object('acertos_na_hora', h_acertos, 'respostas_na_hora', h_total)
    where not exists (select 1 from public.suspeitas
      where user_id = uid and motivo = 'acertos_demais' and criado_em > now() - interval '1 hour');
  end if;

  return jsonb_build_object('pontos', total, 'contadas', contadas, 'recebidas', recebidas);
end;
$$;

-- Início do período no horário de Brasília: semana começa na segunda-feira.
create or replace function public.inicio_periodo(p_periodo text)
returns timestamptz
language sql
stable
set search_path = ''
as $$
  select case p_periodo
    when 'semana' then date_trunc('week', now() at time zone 'America/Sao_Paulo') at time zone 'America/Sao_Paulo'
    when 'mes' then date_trunc('month', now() at time zone 'America/Sao_Paulo') at time zone 'America/Sao_Paulo'
    else '-infinity'::timestamptz
  end;
$$;

-- ---------------------------------------------------------------------------
-- Ranking: os primeiros colocados e, se estiver fora deles, a própria posição.
-- p_periodo: 'semana', 'mes' ou 'geral'. Só apelido, avatar e pontos.
-- ---------------------------------------------------------------------------
create or replace function public.ranking(p_periodo text, p_limite int default 50)
returns table (posicao bigint, apelido text, avatar text, pontos bigint, eu boolean)
language sql
stable
security definer
set search_path = ''
as $$
  with soma as (
    select r.user_id, sum(r.pontos)::bigint as pontos
    from public.respostas r
    where r.respondido_em >= public.inicio_periodo(p_periodo)
    group by r.user_id
    having sum(r.pontos) > 0
  ),
  visiveis as (
    select p.id, p.apelido, p.avatar, s.pontos,
           rank() over (order by s.pontos desc) as posicao
    from soma s
    join public.profiles p on p.id = s.user_id
    where not p.sinalizado
      and p.aparecer_no_ranking
      and (p.adulto or p.consentimento_em is not null)
  )
  select v.posicao, v.apelido, v.avatar, v.pontos, v.id = auth.uid()
  from visiveis v
  where v.posicao <= least(greatest(coalesce(p_limite, 50), 1), 100) or v.id = auth.uid()
  order by v.posicao, lower(v.apelido);
$$;

-- Os próprios pontos (mesmo para quem escolheu não aparecer) e a situação no ranking.
create or replace function public.minha_pontuacao()
returns table (semana bigint, mes bigint, geral bigint, aparece boolean, sinalizado boolean)
language sql
stable
security definer
set search_path = ''
as $$
  select
    coalesce((select sum(pontos) from public.respostas
              where user_id = p.id and respondido_em >= public.inicio_periodo('semana')), 0)::bigint,
    coalesce((select sum(pontos) from public.respostas
              where user_id = p.id and respondido_em >= public.inicio_periodo('mes')), 0)::bigint,
    coalesce((select sum(pontos) from public.respostas where user_id = p.id), 0)::bigint,
    p.aparecer_no_ranking,
    p.sinalizado
  from public.profiles p
  where p.id = auth.uid();
$$;

-- O aluno escolhe aparecer ou não no ranking.
create or replace function public.aparecer_no_ranking(p_aparecer boolean)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set aparecer_no_ranking = coalesce(p_aparecer, true) where id = auth.uid();
  return found;
end;
$$;

-- Retirar a autorização (do 0001) agora apaga também as respostas do ranking e os registros de
-- suspeita do aluno, além do progresso.
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
    delete from public.respostas where user_id = p_aluno;
    delete from public.suspeitas where user_id = p_aluno;
    return true;
  end if;
  return false;
end;
$$;

revoke all on function public.revogar_autorizacao(uuid) from public, anon;
grant execute on function public.revogar_autorizacao(uuid) to authenticated;
revoke all on function public.registrar_respostas(jsonb) from public, anon;
revoke all on function public.inicio_periodo(text) from public, anon;
revoke all on function public.ranking(text, int) from public, anon;
revoke all on function public.minha_pontuacao() from public, anon;
revoke all on function public.aparecer_no_ranking(boolean) from public, anon;
grant execute on function public.registrar_respostas(jsonb) to authenticated;
grant execute on function public.inicio_periodo(text) to authenticated;
grant execute on function public.ranking(text, int) to authenticated;
grant execute on function public.minha_pontuacao() to authenticated;
grant execute on function public.aparecer_no_ranking(boolean) to authenticated;
