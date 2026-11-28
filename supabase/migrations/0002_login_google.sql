-- Reta Enem — login com Google: completar o cadastro depois do primeiro login.
-- Rode depois do 0001 (SQL Editor → New query → colar → Run). Pode rodar de novo sem problema.
--
-- Quem entra com Google não passa pelo formulário de cadastro, então não tem apelido, idade nem
-- aceite dos termos. O app pede esses dados uma vez e chama esta função, que cria o perfil com as
-- mesmas regras do cadastro por e-mail (apelido válido e único, e-mail do responsável diferente do
-- e-mail do aluno). Até lá a conta não tem perfil e nada do progresso vai para o servidor.

create or replace function public.criar_meu_perfil(
  p_apelido text,
  p_avatar text,
  p_adulto boolean,
  p_responsavel_email text,
  p_termos_versao text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  responsavel text := nullif(trim(coalesce(p_responsavel_email, '')), '');
begin
  if auth.uid() is null then
    raise exception 'É preciso entrar na conta.';
  end if;
  if exists (select 1 from public.profiles where id = auth.uid()) then
    return false;
  end if;
  if not coalesce(p_adulto, false) and responsavel is null then
    raise exception 'Informe o e-mail do responsável.';
  end if;
  if responsavel is not null and lower(responsavel) = lower(auth.jwt() ->> 'email') then
    raise exception 'O e-mail do responsável precisa ser diferente do e-mail do aluno.';
  end if;
  insert into public.profiles (id, apelido, avatar, adulto, responsavel_email, termos_versao)
  values (
    auth.uid(),
    trim(p_apelido),
    coalesce(nullif(p_avatar, ''), 'a1'),
    coalesce(p_adulto, false),
    case when coalesce(p_adulto, false) then null else responsavel end,
    coalesce(nullif(p_termos_versao, ''), '?')
  );
  return true;
end;
$$;

revoke all on function public.criar_meu_perfil(text, text, boolean, text, text) from public, anon;
grant execute on function public.criar_meu_perfil(text, text, boolean, text, text) to authenticated;
