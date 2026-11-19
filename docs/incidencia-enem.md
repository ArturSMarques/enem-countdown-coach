# Incidência dos tópicos no ENEM 2024–2026

Este documento explica de onde vêm as prioridades (alta, média, baixa) dos tópicos do app e os números de `src/lib/incidence.ts`.

## Fonte

- Cadernos de questões e gabaritos oficiais da aplicação regular do ENEM 2024, 2025 e 2026, baixados do portal do Inep (`download.inep.gov.br/enem/provas_e_gabaritos/`).
- Um caderno por dia de cada ano: caderno 1 (azul) do 1º dia e caderno 5 (amarelo) do 2º dia. Os cadernos de cores diferentes têm as mesmas questões em outra ordem.

## Método

1. O texto dos PDFs foi extraído e separado em questões pelas alternativas A–E.
2. Cada questão foi lida e atribuída a **um único tópico**, o principal conteúdo exigido, seguindo a Matriz de Referência do ENEM. Questões que misturam assuntos ficaram no tópico do comando.
3. Língua estrangeira conta 5 questões por ano (o candidato faz inglês **ou** espanhol).
4. Algumas questões que são quase só imagem, ou que ficaram unidas à vizinha na extração, não puderam ser contadas separadamente; por isso alguns anos somam 178 em vez de 180.

**Isto é uma estimativa.** A classificação é feita por uma pessoa (ou um modelo) e outra classificação poderia mudar algumas questões de tópico. Use os números como ordem de grandeza, não como estatística oficial: o Inep não publica incidência por tópico.

## Regra das prioridades

Contando as três provas juntas, dentro de cada área (cerca de 135 questões por área):

- **alta**: 6 questões ou mais (2 ou mais por ano, em média);
- **média**: de 3 a 5 questões;
- **baixa**: 2 questões ou menos.

Redação não entra na contagem (é uma única prova que vale 1.000 pontos) e todos os seus tópicos são de prioridade alta. No planner, o peso de cada tópico usa o número de questões (e não só o rótulo), então tópicos muito frequentes recebem mais tempo.

## Questões por tópico

| Área | Tópico | 2024 | 2025 | 2026 | Total | Prioridade |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Matemática | Razão, proporção e escala (`mat-razao`) | 5 | 7 | 6 | 18 | alta |
| Matemática | Probabilidade e análise combinatória (`mat-prob`) | 5 | 5 | 5 | 15 | alta |
| Matemática | Geometria plana (`mat-geop`) | 7 | 1 | 6 | 14 | alta |
| Matemática | Funções (1º e 2º grau, exponencial, log) (`mat-func`) | 6 | 2 | 4 | 12 | alta |
| Matemática | Geometria espacial (`mat-geoe`) | 3 | 6 | 3 | 12 | alta |
| Matemática | Análise de gráficos e tabelas (`mat-graf`) | 3 | 4 | 4 | 11 | alta |
| Matemática | Estatística (média, moda, mediana) (`mat-estat`) | 3 | 3 | 4 | 10 | alta |
| Matemática | Porcentagem (`mat-porc`) | 2 | 4 | 2 | 8 | alta |
| Matemática | Equações, sistemas e expressões algébricas (`mat-alg`) | 3 | 2 | 2 | 7 | alta |
| Matemática | Grandezas, medidas e conversão de unidades (`mat-medidas`) | 2 | 2 | 3 | 7 | alta |
| Matemática | Números: frações, decimais e notação científica (`mat-num`) | 1 | 2 | 2 | 5 | media |
| Matemática | Geometria analítica (`mat-geoan`) | 0 | 3 | 1 | 4 | media |
| Matemática | Trigonometria (`mat-trig`) | 1 | 2 | 1 | 4 | media |
| Matemática | Matemática financeira (`mat-fin`) | 0 | 1 | 1 | 2 | baixa |
| Matemática | Regra de três (`mat-regra3`) | 1 | 1 | 0 | 2 | baixa |
| Matemática | Sequências (PA e PG) (`mat-seq`) | 2 | 0 | 0 | 2 | baixa |
| Ciências da Natureza | Ecologia (`bio-eco`) | 4 | 5 | 4 | 13 | alta |
| Ciências da Natureza | Eletricidade (circuitos, potência) (`fis-elet`) | 3 | 4 | 3 | 10 | alta |
| Ciências da Natureza | Ondas e som (`fis-ondas`) | 2 | 4 | 3 | 9 | alta |
| Ciências da Natureza | Química orgânica (`qui-org`) | 3 | 2 | 2 | 7 | alta |
| Ciências da Natureza | Propriedades da matéria e separação de misturas (`qui-sep`) | 1 | 2 | 4 | 7 | alta |
| Ciências da Natureza | Biotecnologia e engenharia genética (`bio-biotec`) | 1 | 2 | 3 | 6 | alta |
| Ciências da Natureza | Fisiologia humana e imunologia (`bio-fisio`) | 3 | 1 | 2 | 6 | alta |
| Ciências da Natureza | Termologia e termodinâmica (`fis-termo`) | 4 | 1 | 1 | 6 | alta |
| Ciências da Natureza | Química ambiental (`qui-amb`) | 2 | 2 | 2 | 6 | alta |
| Ciências da Natureza | Citologia e metabolismo celular (`bio-cito`) | 3 | 1 | 1 | 5 | media |
| Ciências da Natureza | Saúde: doenças, parasitoses e prevenção (`bio-saude`) | 2 | 2 | 1 | 5 | media |
| Ciências da Natureza | Dinâmica (leis de Newton) e quantidade de movimento (`fis-din`) | 3 | 1 | 1 | 5 | media |
| Ciências da Natureza | Ligações químicas e interações intermoleculares (`qui-atom`) | 0 | 3 | 2 | 5 | media |
| Ciências da Natureza | Evolução (`bio-evo`) | 2 | 0 | 2 | 4 | media |
| Ciências da Natureza | Eletroquímica e oxirredução (`qui-eletroq`) | 1 | 1 | 2 | 4 | media |
| Ciências da Natureza | Estequiometria (`qui-esteq`) | 1 | 2 | 1 | 4 | media |
| Ciências da Natureza | Diversidade dos seres vivos (botânica e zoologia) (`bio-bot`) | 1 | 1 | 1 | 3 | media |
| Ciências da Natureza | Genética (`bio-gen`) | 1 | 1 | 1 | 3 | media |
| Ciências da Natureza | Energia, trabalho e potência (`fis-ener`) | 0 | 0 | 3 | 3 | media |
| Ciências da Natureza | Hidrostática e hidrodinâmica (`fis-hidro`) | 0 | 1 | 2 | 3 | media |
| Ciências da Natureza | Óptica (`fis-opt`) | 1 | 1 | 1 | 3 | media |
| Ciências da Natureza | Cinemática (`fis-cine`) | 1 | 1 | 0 | 2 | baixa |
| Ciências da Natureza | Eletromagnetismo (`fis-mag`) | 0 | 2 | 0 | 2 | baixa |
| Ciências da Natureza | Física moderna e radiações (`fis-mod`) | 2 | 0 | 0 | 2 | baixa |
| Ciências da Natureza | Ácidos, bases, sais e pH (`qui-acid`) | 0 | 2 | 0 | 2 | baixa |
| Ciências da Natureza | Equilíbrio químico (`qui-eq`) | 1 | 1 | 0 | 2 | baixa |
| Ciências da Natureza | Soluções e concentração (`qui-sol`) | 1 | 0 | 1 | 2 | baixa |
| Ciências da Natureza | Termoquímica (`qui-termoq`) | 1 | 0 | 1 | 2 | baixa |
| Ciências da Natureza | Cinética química (`qui-cin`) | 0 | 1 | 0 | 1 | baixa |
| Ciências da Natureza | Radioatividade (`qui-rad`) | 0 | 1 | 0 | 1 | baixa |
| Ciências Humanas | História do Brasil (`his-br`) | 7 | 6 | 9 | 22 | alta |
| Ciências Humanas | Sociologia: cultura, cidadania e movimentos sociais (`socio`) | 8 | 4 | 6 | 18 | alta |
| Ciências Humanas | História geral: Antiguidade, Idade Média e Idade Moderna (`his-geral`) | 5 | 5 | 6 | 16 | alta |
| Ciências Humanas | Filosofia moderna e contemporânea (`filo-cont`) | 6 | 5 | 3 | 14 | alta |
| Ciências Humanas | Meio ambiente e sustentabilidade (`geo-amb`) | 2 | 5 | 5 | 12 | alta |
| Ciências Humanas | Urbanização e espaço urbano (`geo-urb`) | 3 | 4 | 2 | 9 | alta |
| Ciências Humanas | História contemporânea (séculos XIX a XXI) (`his-cont`) | 3 | 3 | 3 | 9 | alta |
| Ciências Humanas | Filosofia antiga (`filo-ant`) | 1 | 4 | 3 | 8 | alta |
| Ciências Humanas | Ética e filosofia política (`filo`) | 2 | 3 | 2 | 7 | alta |
| Ciências Humanas | Geopolítica e globalização (`geo-geopol`) | 4 | 1 | 2 | 7 | alta |
| Ciências Humanas | Geografia física: relevo, clima, solos e água (`geo-nat`) | 3 | 2 | 1 | 6 | alta |
| Ciências Humanas | Espaço agrário e questão fundiária (`geo-agr`) | 0 | 2 | 2 | 4 | media |
| Ciências Humanas | Cartografia e geotecnologias (`geo-carto`) | 1 | 1 | 1 | 3 | media |
| Linguagens | Gêneros textuais e funções da linguagem (`lin-gen`) | 7 | 9 | 8 | 24 | alta |
| Linguagens | Literatura brasileira e escolas literárias (`lin-lit`) | 9 | 6 | 7 | 22 | alta |
| Linguagens | Variação linguística e gramática aplicada (`lin-gram`) | 6 | 9 | 5 | 20 | alta |
| Linguagens | Artes: visuais, música, dança e patrimônio (`lin-arte`) | 6 | 4 | 6 | 16 | alta |
| Linguagens | Língua estrangeira (inglês ou espanhol) (`lin-estr`) | 5 | 5 | 5 | 15 | alta |
| Linguagens | Educação física e cultura corporal (`lin-ef`) | 5 | 4 | 4 | 13 | alta |
| Linguagens | Tecnologias da informação e comunicação (`lin-tic`) | 5 | 3 | 5 | 13 | alta |
| Linguagens | Interpretação de texto e argumentação (`lin-interp`) | 2 | 4 | 3 | 9 | alta |
| Linguagens | Figuras de linguagem (`lin-fig`) | 0 | 1 | 2 | 3 | media |

## Classificação questão a questão

Ano · número aproximado da questão no caderno (a numeração pode estar deslocada em uma unidade onde a extração uniu questões) · tópico.

### 2024

1-5: `lin-estr`, 6: `lin-gram`, 7: `lin-gen`, 8: `lin-arte`, 9: `lin-ef`, 10: `lin-tic`, 11: `lin-gram`, 12: `lin-gram`, 13: `lin-gen`, 14: `lin-gram`, 15: `lin-tic`, 16: `lin-arte`, 17: `lin-tic`, 18: `lin-ef`, 19: `lin-lit`, 20: `lin-gram`, 21: `lin-arte`, 22: `lin-lit`, 23: `lin-gen`, 24: `lin-lit`, 25: `lin-arte`, 26: `lin-ef`, 27: `lin-gen`, 28: `lin-lit`, 29: `lin-lit`, 30: `lin-interp`, 31: `lin-lit`, 32: `lin-lit`, 33: `lin-gen`, 34: `lin-tic`, 35: `lin-lit`, 36: `lin-arte`, 37: `lin-interp`, 38: `lin-lit`, 39: `lin-gram`, 40: `lin-ef`, 41: `lin-gen`, 42: `lin-gen`, 43: `lin-arte`, 44: `lin-ef`, 45: `lin-tic`, 46: `geo-nat`, 47: `his-br`, 48: `geo-amb`, 49: `his-br`, 50: `his-geral`, 51: `his-geral`, 52: `socio`, 53: `geo-nat`, 54: `filo-cont`, 55: `filo-cont`, 56: `socio`, 57: `geo-urb`, 58: `filo-ant`, 59: `his-geral`, 60: `geo-amb`, 61: `filo-cont`, 62: `filo-cont`, 63: `socio`, 64: `his-br`, 65: `socio`, 66: `his-cont`, 67: `socio`, 68: `geo-nat`, 69: `his-geral`, 70: `geo-geopol`, 71: `geo-geopol`, 72: `socio`, 73: `his-br`, 74: `his-br`, 75: `his-geral`, 76: `filo-cont`, 77: `his-br`, 78: `filo`, 79: `geo-geopol`, 80: `his-cont`, 81: `socio`, 82: `filo-cont`, 83: `geo-carto`, 84: `his-br`, 85: `his-cont`, 86: `geo-urb`, 87: `filo`, 88: `geo-urb`, 89: `geo-geopol`, 90: `socio`, 91: `bio-cito`, 92: `qui-sep`, 93: `bio-eco`, 94: `qui-eq`, 95: `fis-termo`, 96: `qui-org`, 97: `bio-cito`, 98: `fis-mod`, 99: `bio-fisio`, 100: `fis-elet`, 101: `fis-termo`, 102: `fis-termo`, 103: `fis-cine`, 104: `bio-saude`, 105: `fis-din`, 106: `qui-amb`, 107: `qui-esteq`, 108: `fis-elet`, 109: `fis-elet`, 110: `qui-termoq`, 111: `qui-org`, 112: `bio-biotec`, 113: `fis-din`, 114: `qui-sol`, 115: `bio-evo`, 116: `fis-ondas`, 117: `fis-opt`, 118: `fis-din`, 119: `qui-eletroq`, 120: `qui-org`, 121: `bio-eco`, 122: `qui-amb`, 123: `fis-ondas`, 124: `bio-cito`, 125: `fis-termo`, 126: `bio-saude`, 127: `bio-eco`, 128: `fis-mod`, 129: `bio-fisio`, 130: `bio-eco`, 131: `bio-fisio`, 132: `bio-evo`, 133: `bio-bot`, 134: `bio-gen`, 136: `mat-func`, 137: `mat-estat`, 138: `mat-razao`, 139: `mat-prob`, 140: `mat-prob`, 141: `mat-razao`, 142: `mat-geop`, 143: `mat-seq`, 144: `mat-geop`, 145: `mat-geop`, 146: `mat-trig`, 147: `mat-geop`, 148: `mat-razao`, 149: `mat-prob`, 150: `mat-func`, 151: `mat-geoe`, 152: `mat-func`, 153: `mat-graf`, 154: `mat-estat`, 155: `mat-geop`, 156: `mat-func`, 157: `mat-regra3`, 158: `mat-medidas`, 159: `mat-medidas`, 160: `mat-alg`, 161: `mat-prob`, 162: `mat-razao`, 163: `mat-estat`, 164: `mat-prob`, 165: `mat-alg`, 166: `mat-porc`, 167: `mat-graf`, 168: `mat-seq`, 169: `mat-alg`, 170: `mat-geoe`, 171: `mat-geop`, 172: `mat-geop`, 173: `mat-razao`, 174: `mat-graf`, 175: `mat-porc`, 176: `mat-func`, 177: `mat-num`, 178: `mat-func`, 179: `mat-geoe`

### 2025

1-5: `lin-estr`, 6: `lin-gen`, 7: `lin-gen`, 8: `lin-tic`, 9: `lin-tic`, 10: `lin-gram`, 11: `lin-lit`, 12: `lin-ef`, 13: `lin-gram`, 14: `lin-gen`, 15: `lin-arte`, 16: `lin-lit`, 17: `lin-gram`, 18: `lin-ef`, 19: `lin-ef`, 20: `lin-gram`, 21: `lin-lit`, 22: `lin-arte`, 23: `lin-arte`, 24: `lin-gen`, 25: `lin-interp`, 26: `lin-gram`, 27: `lin-ef`, 28: `lin-lit`, 29: `lin-lit`, 30: `lin-gram`, 31: `lin-fig`, 32: `lin-gen`, 33: `lin-gen`, 34: `lin-gen`, 35: `lin-interp`, 36: `lin-gram`, 37: `lin-interp`, 38: `lin-gram`, 39: `lin-tic`, 40: `lin-lit`, 41: `lin-arte`, 42: `lin-gram`, 43: `lin-gen`, 44: `lin-interp`, 45: `lin-gen`, 46: `geo-geopol`, 47: `geo-nat`, 48: `filo-cont`, 49: `his-geral`, 50: `filo-cont`, 51: `socio`, 52: `his-cont`, 53: `his-geral`, 54: `geo-urb`, 55: `filo-cont`, 56: `geo-amb`, 57: `geo-urb`, 58: `his-br`, 59: `geo-amb`, 60: `filo`, 61: `filo-ant`, 62: `filo-cont`, 63: `geo-agr`, 64: `his-br`, 65: `filo-ant`, 66: `filo-cont`, 67: `geo-agr`, 68: `geo-urb`, 69: `his-geral`, 70: `geo-nat`, 71: `his-cont`, 72: `filo-ant`, 73: `his-br`, 74: `socio`, 75: `geo-amb`, 76: `filo`, 77: `geo-amb`, 78: `his-br`, 79: `filo`, 80: `geo-urb`, 81: `socio`, 82: `filo-ant`, 83: `his-br`, 84: `geo-carto`, 85: `his-br`, 86: `geo-amb`, 87: `his-geral`, 88: `socio`, 89: `his-geral`, 90: `his-cont`, 91: `fis-termo`, 92: `bio-eco`, 93: `bio-fisio`, 94: `bio-eco`, 95: `bio-eco`, 96: `qui-sep`, 97: `fis-opt`, 98: `bio-saude`, 99: `bio-cito`, 100: `qui-amb`, 101: `fis-ondas`, 102: `bio-gen`, 103: `fis-din`, 104: `fis-mag`, 105: `fis-ondas`, 106: `qui-org`, 107: `bio-eco`, 108: `qui-acid`, 109: `qui-org`, 110: `qui-rad`, 111: `qui-amb`, 112: `bio-biotec`, 113: `fis-elet`, 114: `qui-esteq`, 115: `fis-ondas`, 116: `qui-atom`, 117: `qui-atom`, 118: `fis-ondas`, 119: `qui-acid`, 120: `fis-mag`, 121: `bio-bot`, 122: `bio-eco`, 123: `qui-eq`, 124: `fis-hidro`, 125: `fis-elet`, 126: `qui-eletroq`, 127: `qui-esteq`, 128: `fis-cine`, 129: `qui-cin`, 130: `fis-elet`, 131: `bio-saude`, 132: `qui-sep`, 133: `bio-biotec`, 134: `qui-atom`, 135: `fis-elet`, 136: `mat-geop`, 137: `mat-porc`, 138: `mat-porc`, 139: `mat-estat`, 140: `mat-razao`, 141: `mat-geoe`, 142: `mat-graf`, 143: `mat-num`, 144: `mat-geoan`, 145: `mat-graf`, 146: `mat-razao`, 147: `mat-geoan`, 148: `mat-graf`, 149: `mat-graf`, 150: `mat-razao`, 151: `mat-geoe`, 152: `mat-regra3`, 153: `mat-num`, 154: `mat-prob`, 155: `mat-prob`, 156: `mat-trig`, 157: `mat-estat`, 158: `mat-razao`, 159: `mat-trig`, 160: `mat-geoan`, 161: `mat-porc`, 162: `mat-prob`, 163: `mat-razao`, 164: `mat-func`, 165: `mat-porc`, 166: `mat-medidas`, 167: `mat-estat`, 168: `mat-geoe`, 169: `mat-prob`, 170: `mat-medidas`, 171: `mat-alg`, 172: `mat-razao`, 173: `mat-alg`, 174: `mat-geoe`, 175: `mat-geoe`, 176: `mat-func`, 177: `mat-geoe`, 178: `mat-fin`, 179: `mat-prob`, 180: `mat-razao`

### 2026

1-5: `lin-estr`, 6: `lin-arte`, 7: `lin-arte`, 8: `lin-gram`, 9: `lin-lit`, 10: `lin-lit`, 11: `lin-gram`, 12: `lin-gram`, 13: `lin-lit`, 14: `lin-ef`, 15: `lin-gen`, 16: `lin-gen`, 17: `lin-ef`, 18: `lin-gen`, 19: `lin-gen`, 20: `lin-lit`, 21: `lin-arte`, 22: `lin-gen`, 23: `lin-gen`, 24: `lin-arte`, 25: `lin-lit`, 26: `lin-ef`, 27: `lin-arte`, 28: `lin-lit`, 29: `lin-lit`, 30: `lin-fig`, 31: `lin-interp`, 32: `lin-gram`, 33: `lin-tic`, 34: `lin-tic`, 35: `lin-tic`, 36: `lin-gen`, 37: `lin-arte`, 38: `lin-interp`, 39: `lin-gen`, 40: `lin-tic`, 41: `lin-tic`, 42: `lin-ef`, 43: `lin-gram`, 44: `lin-interp`, 45: `lin-fig`, 46: `his-geral`, 47: `his-geral`, 48: `filo-ant`, 49: `his-cont`, 50: `his-cont`, 51: `filo`, 52: `his-cont`, 53: `geo-amb`, 54: `filo-cont`, 55: `socio`, 56: `geo-amb`, 57: `geo-amb`, 58: `his-br`, 59: `filo-ant`, 60: `his-br`, 61: `socio`, 62: `his-geral`, 63: `socio`, 64: `geo-geopol`, 65: `his-br`, 66: `his-geral`, 67: `socio`, 68: `his-br`, 69: `filo-cont`, 70: `geo-nat`, 71: `filo`, 72: `socio`, 73: `his-geral`, 74: `geo-amb`, 75: `socio`, 76: `geo-agr`, 77: `filo-ant`, 78: `his-geral`, 79: `his-br`, 80: `geo-agr`, 81: `his-br`, 82: `his-br`, 83: `geo-urb`, 84: `his-br`, 85: `filo-cont`, 86: `geo-geopol`, 87: `his-br`, 88: `geo-amb`, 89: `geo-urb`, 90: `geo-carto`, 91: `fis-termo`, 92: `fis-ener`, 93: `fis-din`, 94: `fis-elet`, 95: `fis-ondas`, 96: `bio-eco`, 97: `qui-sep`, 98: `fis-elet`, 99: `bio-evo`, 100: `qui-org`, 101: `qui-sep`, 102: `bio-eco`, 103: `qui-sep`, 104: `bio-evo`, 105: `qui-eletroq`, 106: `qui-sol`, 107: `qui-atom`, 108: `qui-amb`, 109: `qui-atom`, 110: `fis-ener`, 111: `bio-biotec`, 112: `fis-ondas`, 113: `fis-ener`, 114: `bio-gen`, 115: `qui-amb`, 116: `qui-esteq`, 117: `fis-hidro`, 118: `bio-biotec`, 119: `bio-bot`, 120: `fis-ondas`, 121: `bio-biotec`, 122: `qui-sep`, 123: `bio-eco`, 124: `bio-eco`, 125: `bio-saude`, 126: `bio-fisio`, 127: `fis-opt`, 128: `qui-org`, 129: `fis-hidro`, 130: `qui-eletroq`, 131: `bio-fisio`, 132: `fis-elet`, 133: `bio-cito`, 134: `qui-termoq`, 135: `mat-num`, 136b: `mat-porc`, 137: `mat-porc`, 138: `mat-prob`, 139: `mat-prob`, 140: `mat-razao`, 141: `mat-geoe`, 142: `mat-geoan`, 143: `mat-estat`, 144: `mat-geop`, 145: `mat-graf`, 146: `mat-medidas`, 147: `mat-prob`, 148: `mat-razao`, 149: `mat-razao`, 150: `mat-razao`, 151: `mat-func`, 152: `mat-estat`, 153: `mat-fin`, 154: `mat-func`, 155: `mat-medidas`, 156: `mat-num`, 157: `mat-graf`, 158: `mat-alg`, 159: `mat-geop`, 160: `mat-estat`, 161: `mat-func`, 162: `mat-alg`, 163: `mat-geop`, 164: `mat-geoe`, 165: `mat-razao`, 166: `mat-prob`, 167: `mat-graf`, 168: `mat-estat`, 169: `mat-geop`, 170: `mat-medidas`, 171: `mat-geoe`, 172: `mat-func`, 173: `mat-trig`, 174: `mat-geop`, 175: `mat-razao`, 176: `mat-geop`, 177: `mat-prob`, 178: `mat-graf`
