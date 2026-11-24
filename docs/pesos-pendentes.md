# Pesos dos cursos: pendências

A tabela `src/lib/course-weights.ts` só recebe pesos **confirmados em fonte oficial** (termo de
adesão da instituição ao SiSU ou edital), com fonte, ano e link. Nenhum peso é estimado.
Enquanto a tabela estiver vazia, o onboarding não mostra a escolha de curso e o aluno digita as
metas por área livremente.

## Lista proposta (aguardando aprovação da equipe e do professor)

| Curso | Instituição | Situação |
|---|---|---|
| Medicina | UFMG | pendente: pesos não pesquisados |
| Direito | UFRJ | pendente: pesos não pesquisados |
| Engenharia Civil | UFPE | pendente: pesos não pesquisados |
| Psicologia | UnB | pendente: pesos não pesquisados |
| Enfermagem | UFBA | pendente: pesos não pesquisados |
| Administração | UFRGS | pendente: pesos não pesquisados |
| Ciência da Computação | UFC | pendente: pesos não pesquisados |
| Pedagogia | UFPR | pendente: pesos não pesquisados |
| Odontologia | UFSC | pendente: pesos não pesquisados |
| Arquitetura e Urbanismo | UFF | pendente: pesos não pesquisados |

## Como confirmar um peso

1. Abrir o termo de adesão da instituição ao SiSU do ano (ou o edital de seleção) e localizar o
   curso, o campus e o turno.
2. Copiar os pesos de Linguagens, Ciências Humanas, Ciências da Natureza, Matemática e Redação
   exatamente como publicados.
3. Registrar em `COURSES` com `source`, `year` e `url` do documento. Curso não confirmado continua
   nesta lista.

Observação: o site do SiSU (sisu.mec.gov.br) não está acessível no ambiente de desenvolvimento
atual; para pesquisar, é preciso liberar esse endereço (e os das universidades) na rede do
ambiente, ou a equipe enviar os documentos.
