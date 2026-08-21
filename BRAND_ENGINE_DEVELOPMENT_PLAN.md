# Dittogen — Development Plan for Antigravity

## 0. Objetivo deste documento

Este documento é a especificação operacional para o agente de desenvolvimento (Antigravity) implementar o projeto **Dittogen**, um motor de geração e avaliação de nomes de marca que deverá inicialmente funcionar em um **site estático**, com o núcleo de geração executando no navegador e uma arquitetura preparada para futuras integrações com APIs externas.

O objetivo é construir o projeto de forma incremental, mantendo o repositório público, o código testável, documentado e pronto para evolução posterior para SaaS/API, sem criar dependências prematuras de backend.

**Nome oficial do repositório:** `dittogen`

**Identidade do projeto:** Dittogen é o nome técnico do motor open source. O nome não deve ser acoplado ao produto fitness que motivou a criação da ferramenta. O core deve permanecer genérico para qualquer domínio de naming.


---

# 1. Regra principal de autonomia do agente

## 1.1 Permissão total dentro do repositório

O agente de desenvolvimento possui **permissão total e autonomia operacional dentro da pasta raiz do repositório**.

Dentro dessa pasta, o agente pode, sem pedir confirmação:

- criar arquivos;
- editar arquivos;
- renomear arquivos;
- mover arquivos;
- criar e remover diretórios;
- criar testes;
- criar documentação;
- gerar código;
- gerar fixtures e datasets de desenvolvimento;
- instalar dependências necessárias ao projeto;
- atualizar dependências;
- alterar configurações do projeto;
- executar scripts;
- executar testes;
- executar linters e formatters;
- executar builds;
- criar e remover arquivos temporários;
- apagar arquivos obsoletos;
- refatorar código;
- substituir implementações ruins;
- deletar código que não seja mais necessário;
- criar branches Git;
- fazer commits locais;
- fazer merge/rebase local quando necessário para organizar a implementação.

**Não solicitar permissão para operações normais de desenvolvimento realizadas exclusivamente dentro da pasta do repositório.**

### 1.2 Quando solicitar permissão

Só solicitar autorização explícita quando uma operação exigir acesso ou alteração **fora da pasta do repositório**, por exemplo:

- acessar arquivos pessoais fora do workspace;
- ler diretórios do sistema sem relação com o projeto;
- acessar credenciais pessoais;
- acessar contas externas não configuradas para o projeto;
- instalar software global no sistema operacional quando isso não for necessário e não puder ser evitado;
- alterar configurações do sistema operacional;
- acessar outro repositório que não seja o projeto atual;
- acessar arquivos ou serviços externos que estejam fora do escopo autorizado.

### 1.3 Regra contra excesso de prompts

Não interromper o fluxo de desenvolvimento pedindo confirmação para:

- criar arquivos;
- apagar arquivos do próprio projeto;
- alterar package.json;
- instalar dependências locais;
- executar npm/pnpm/yarn;
- executar testes;
- executar build;
- alterar configurações de lint/format/test;
- criar scripts;
- criar ou modificar Dockerfiles;
- criar workflows GitHub Actions;
- executar comandos Git dentro do repositório;
- refatorar componentes;
- reorganizar a estrutura interna do projeto.

Quando uma ação for necessária para concluir uma etapa dentro do repositório, **execute a ação e siga em frente**.

Se houver dúvida entre duas soluções técnicas, escolha a opção mais simples, segura e reversível e registre a decisão no projeto.

---

# 2. Contexto do produto

O Dittogen será um motor para criação e triagem de nomes de marca.

O primeiro caso de uso será encontrar um nome internacional para uma plataforma de fitness/health-tech que poderá atuar no Brasil e na Alemanha, mas o motor deverá ser genérico o suficiente para outros segmentos.

O produto deverá ajudar a gerar nomes que atendam critérios como:

- pronúncia fácil;
- memorabilidade;
- facilidade de escrita após ouvir o nome;
- sonoridade internacional;
- compatibilidade linguística com português, inglês e alemão;
- comprimento adequado;
- potencial de marca;
- identidade semântica;
- escalabilidade da marca;
- possibilidade de funcionar como verbo ou expressão natural;
- baixa similaridade com nomes existentes;
- filtragem de termos indesejados;
- posterior verificação de domínio e presença digital.

O projeto **não deve assumir que a disponibilidade de domínio ou marca pode ser determinada localmente com certeza**. Essas verificações serão tratadas como integrações externas e devem possuir arquitetura própria.

---

# 3. Princípios de engenharia

## 3.1 Local-first

O núcleo de geração e scoring deve funcionar localmente no navegador sempre que possível.

Não criar backend apenas para gerar combinações de nomes.

O navegador deverá ser capaz de gerar e avaliar grande quantidade de candidatos sem depender de API externa.

## 3.2 API boundaries desde o início

Mesmo sendo um projeto estático, separar o núcleo do código de integração externa.

Exemplo conceitual:

```text
Dittogen Core
├── generator
├── tokenizer / phonetics
├── scoring
├── filters
├── ranking
├── similarity
└── export

External Checks
├── domains
├── social
├── app stores
└── trademarks
```

As integrações externas não devem contaminar o núcleo de geração.

## 3.3 Determinismo quando necessário

O motor deve permitir seed opcional para que uma geração possa ser reproduzida.

Exemplo:

```text
seed = 123456
```

Isso é importante para testes automatizados e para reproduzir uma sessão de geração.

## 3.4 Configuração por dados

Radicais, núcleos, sufixos, pesos e regras não devem ficar espalhados pelo código.

Preferir arquivos/configurações versionados, por exemplo:

```text
config/
├── phonemes.json
├── roots.json
├── suffixes.json
├── scoring.json
├── stopwords.json
└── languages/
    ├── pt.json
    ├── en.json
    └── de.json
```

A estrutura exata pode ser adaptada durante a implementação, desde que a separação de configuração seja preservada.

## 3.5 Qualidade antes de quantidade

Não considerar o objetivo como “gerar o máximo possível”.

O objetivo é produzir candidatos relevantes e classificáveis.

Evitar gerar dezenas de milhares de variações quase idênticas apenas alterando uma letra.

---

# 4. Stack recomendada

A implementação deve priorizar tecnologias adequadas para um site estático e biblioteca reutilizável.

### Linguagem

- TypeScript

### Núcleo

- TypeScript puro, sem framework obrigatório

### UI

Uma implementação simples e leve. Pode usar Web Components ou framework leve, desde que o núcleo permaneça independente da UI.

Preferência arquitetural:

```text
packages/core
packages/web
```

### Build

- Vite ou ferramenta equivalente moderna

### Testes

- Vitest

### Lint

- ESLint

### Formatting

- Prettier

### Package manager

- escolher uma única ferramenta e manter lockfile versionado;
- pnpm é preferível se não houver motivo concreto para usar npm.

### CI

- GitHub Actions

### Site estático

Preparar para deploy em:

- GitHub Pages; ou
- Cloudflare Pages; ou
- Vercel.

A implementação deve evitar acoplamento ao provedor de hospedagem.

---

# 5. Estrutura inicial sugerida

A estrutura abaixo é uma referência. O agente pode ajustá-la durante a implementação se houver justificativa técnica.

```text
dittogen/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── release.yml
├── config/
│   ├── roots.json
│   ├── suffixes.json
│   ├── phonemes.json
│   ├── scoring.json
│   └── languages/
│       ├── pt.json
│       ├── en.json
│       └── de.json
├── packages/
│   ├── core/
│   │   ├── src/
│   │   │   ├── generator/
│   │   │   ├── scoring/
│   │   │   ├── filters/
│   │   │   ├── similarity/
│   │   │   ├── phonetics/
│   │   │   ├── ranking/
│   │   │   ├── models/
│   │   │   └── index.ts
│   │   └── tests/
│   └── web/
│       ├── src/
│       └── tests/
├── apps/
│   └── playground/
│       ├── src/
│       └── public/
├── scripts/
├── docs/
├── examples/
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
├── eslint.config.js
├── prettier.config.*
├── vitest.config.*
├── README.md
├── CONTRIBUTING.md
├── SECURITY.md
├── CHANGELOG.md
├── LICENSE
└── .gitignore
```

Monorepo só deve ser usado se realmente simplificar o projeto. Caso o agente conclua que uma estrutura single-package é melhor para a primeira versão, pode escolher essa opção, desde que o núcleo seja isolado da UI.

---

# 6. Roadmap de implementação

A implementação deve seguir esta ordem lógica.

Não antecipar integrações externas antes de o core estar estável.

---

## PR 01 — Bootstrap do projeto

### Objetivo

Criar a fundação do repositório.

### Entregas

- inicializar TypeScript;
- configurar package manager;
- configurar build;
- configurar Vitest;
- configurar ESLint;
- configurar Prettier;
- configurar scripts;
- criar estrutura de diretórios;
- criar README inicial;
- criar CONTRIBUTING;
- criar LICENSE adequada ao objetivo público do projeto;
- criar `.gitignore`;
- criar CI inicial.

### Critérios de aceite

```text
install → funciona
lint → passa
test → passa
build → passa
```

O PR deve deixar o repositório em estado executável.

---

## PR 02 — Modelo de dados do nome

Criar os tipos principais.

Exemplo conceitual:

```ts
interface CandidateName {
  value: string;
  normalized: string;
  score?: number;
  scores?: ScoreBreakdown;
  metadata?: CandidateMetadata;
}
```

Criar modelos para:

- candidato;
- score;
- configuração de geração;
- idioma;
- resultado de ranking;
- resultado de filtro.

Adicionar testes unitários.

---

## PR 03 — Corpus linguístico e configuração

Criar a primeira base de:

- radicais;
- núcleos;
- sufixos;
- padrões fonéticos;
- combinações proibidas;
- padrões de baixa qualidade;
- vocabulário básico de filtragem.

Separar configuração de código.

Não tentar resolver toda a linguística do mundo nesta etapa. Criar uma base inicial extensível.

---

## PR 04 — Gerador de nomes

Implementar o gerador combinatório.

Requisitos:

- gerar candidatos por famílias;
- evitar duplicatas;
- normalizar capitalização;
- controlar comprimento;
- permitir quantidade solicitada;
- permitir seed;
- permitir configurações;
- evitar combinações foneticamente ruins;
- evitar geração excessivamente semelhante.

Testar geração de pelo menos milhares de candidatos em ambiente local.

Criar benchmark simples.

---

## PR 05 — Normalização e filtros

Implementar:

- normalização Unicode;
- lowercase/uppercase controlado;
- caracteres proibidos;
- comprimento mínimo/máximo;
- padrões de repetição;
- sequências impronunciáveis;
- stopwords;
- termos inadequados;
- termos explicitamente excluídos pelo usuário;
- duplicidade e near-duplicate.

Todos os filtros devem ter testes.

---

## PR 06 — Scoring v1

Implementar score de 0–100.

Critérios iniciais:

```text
Pronúncia             10
Memorização           10
Escrita               10
Internacionalização   10
Identidade             9
Marca                 10
Visual                 8
Potencial de verbo     9
Escalabilidade        10
Originalidade         10
```

O score final deve ser calculável e auditável.

Não esconder a matemática atrás de lógica arbitrária.

Deve existir breakdown por critério.

Exemplo:

```json
{
  "score": 93.4,
  "breakdown": {
    "pronunciation": 9.6,
    "memorability": 9.4,
    "spelling": 9.2
  }
}
```

---

## PR 07 — Avaliação multilíngue PT/EN/DE

Criar heurísticas iniciais para português, inglês e alemão.

Objetivos:

- detectar sequências de letras problemáticas;
- avaliar dificuldade de pronúncia;
- identificar colisões com palavras comuns indesejadas;
- identificar padrões estranhos em cada idioma;
- calcular score por idioma.

Importante: heurística local **não equivale a validação linguística jurídica ou profissional**.

O resultado deve ser apresentado como score/heurística.

---

## PR 08 — Similaridade e deduplicação avançada

Implementar comparação entre candidatos.

Avaliar:

- distância de Levenshtein;
- similaridade fonética;
- prefixos/sufixos compartilhados;
- similaridade normalizada;
- agrupamento de nomes semelhantes.

Objetivo:

Se forem gerados:

```text
Merivo
Meriva
MerivoX
Merivon
Merivio
```

não ocupar o TOP 100 com cinco pequenas variações da mesma ideia.

O sistema deve favorecer diversidade.

---

## PR 09 — Ranking e seleção de TOP N

Criar algoritmo para:

- ordenar;
- eliminar redundância;
- preservar diversidade fonética;
- preservar diversidade estrutural;
- selecionar TOP N.

Exemplo:

```text
100.000 gerados
       ↓
20.000 válidos
       ↓
5.000 bons
       ↓
500 candidatos fortes
       ↓
100 candidatos diversos
       ↓
TOP 20
```

---

## PR 10 — Exportação

Implementar exportação para:

- CSV;
- JSON;
- clipboard;

Opcionalmente gerar relatório simples.

---

## PR 11 — UI do gerador

Criar a interface web estática.

A interface deve permitir configurar:

- idioma(s);
- comprimento;
- quantidade;
- tema/setor;
- estilo de marca;
- nível de originalidade;
- seed opcional;
- critérios de exclusão;
- quantidade de resultados.

Exibir:

- nome;
- score;
- breakdown;
- justificativa curta;
- tags;
- ações para favoritar;
- ações para rejeitar.

---

## PR 12 — Favoritos e sessão local

Implementar armazenamento local usando Web Storage ou IndexedDB, conforme necessidade.

Permitir:

- favoritar;
- rejeitar;
- comparar;
- exportar favoritos;
- restaurar sessão.

Não depender de conta/login nesta fase.

---

## PR 13 — Web Component / Plugin

Transformar a UI principal em componente reutilizável.

Exemplo desejado:

```html
<dittogen-generator></brand-generator>
```

Ou API equivalente.

O componente deve ser capaz de ser incorporado em um site estático.

A documentação deve mostrar:

```html
<script src="dittogen.js"></script>
<dittogen-generator></brand-generator>
```

---

## PR 14 — Playground público

Criar um site de demonstração.

Objetivo:

- mostrar o produto;
- demonstrar geração;
- permitir testes;
- documentar o projeto;
- funcionar sem backend para o core.

O playground deve consumir o mesmo core publicado pela biblioteca.

---

## PR 15 — Performance

Testar geração de grande volume no browser.

Investigar:

- Web Worker;
- chunking;
- virtualização da lista;
- lazy processing;
- memoization;
- estruturas de dados eficientes.

O objetivo é impedir que uma geração de grande volume congele a UI.

Um Web Worker deve ser adotado caso o benchmark mostre benefício real.

---

## PR 16 — Arquitetura para verificações externas

Criar abstrações sem obrigatoriamente conectar APIs reais ainda.

Interface conceitual:

```ts
interface AvailabilityProvider {
  check(name: string): Promise<AvailabilityResult>;
}
```

Implementar mocks/fakes para testes.

Criar módulos separados para:

- domain provider;
- social provider;
- app store provider;
- trademark provider.

**Não colocar API keys diretamente no código ou no frontend.**

---

## PR 17 — Integração de domínio

Somente nesta etapa avaliar fornecedores/APIs que permitam verificar domínio.

O frontend não deve expor credenciais privadas.

Caso o fornecedor exija segredo/API key:

```text
Browser
   ↓
Backend/Edge Function
   ↓
Provider
```

O core deve continuar funcionando sem esse backend.

---

## PR 18 — Verificação social

Criar integração ou arquitetura para presença em:

- GitHub;
- Instagram;
- X;
- LinkedIn;
- TikTok;
- YouTube;
- Reddit;
- outros provedores aplicáveis.

Não afirmar “disponível” apenas porque uma página não apareceu em uma busca.

Usar estados como:

```text
available
occupied
unknown
error
not_supported
```

---

## PR 19 — Integrações jurídicas / marcas

Criar arquitetura para consultas de:

- INPI;
- EUIPO;
- DPMA.

O resultado deve deixar explícito que:

> ausência de resultado em uma busca automatizada não constitui garantia de disponibilidade jurídica da marca.

A interface deve diferenciar:

- nenhum conflito encontrado;
- possível conflito;
- conflito encontrado;
- consulta não concluída.

---

## PR 20 — Release candidate

Consolidar:

- performance;
- documentação;
- testes;
- segurança;
- API pública;
- compatibilidade do plugin;
- build;
- deploy;
- changelog.

Criar primeira versão candidata, por exemplo:

```text
v0.1.0-rc.1
```

---

# 7. Estratégia Git

## Branches permanentes

```text
main
│
└── develop
```

### `main`

Representa somente código estável/publicado.

Não desenvolver diretamente em `main`.

### `develop`

Branch de integração.

Toda implementação deve passar por Pull Request antes de entrar em `develop`.

---

# 8. Branches de trabalho

Usar padrões como:

```text
feature/...
fix/...
refactor/...
chore/...
docs/...
test/...
perf/...
```

Exemplos:

```text
feature/name-generator
feature/scoring-v1
feature/web-component
fix/deduplication
perf/generation-worker
```

---

# 9. Regra de Pull Request

Cada etapa do roadmap deve resultar em um PR focado.

Fluxo:

```text
feature/*
    ↓
PR
    ↓
develop
    ↓
Release PR
    ↓
main
```

### PR deve conter

- título objetivo;
- descrição do problema;
- solução implementada;
- mudanças principais;
- testes executados;
- impacto;
- limitações conhecidas;
- breaking changes, quando houver.

### PR pequeno > PR gigante

Preferir vários PRs independentes e revisáveis.

Não acumular todo o roadmap em um único PR.

---

# 10. Política de merge

Antes de mergear qualquer PR:

```text
lint ✅
test ✅
build ✅
```

Quando aplicável:

```text
coverage ✅
```

Preferir **Squash and Merge** para manter histórico da branch principal limpo, salvo quando existir uma razão técnica para preservar commits individuais.

---

# 11. Release para main

A branch `main` deve receber somente versões consideradas estáveis.

Fluxo:

```text
develop
   ↓
Release PR
   ↓
main
   ↓
tag
   ↓
GitHub Release
```

Tags devem seguir Semantic Versioning:

```text
MAJOR.MINOR.PATCH
```

Exemplos:

```text
v0.1.0
v0.2.0
v0.2.1
v1.0.0
```

Enquanto o projeto estiver em desenvolvimento inicial, mudanças incompatíveis podem ocorrer em `0.x`, mas devem ser documentadas.

---

# 12. Regras de Semantic Versioning

### PATCH

Correções sem alteração significativa da API.

```text
0.1.0 → 0.1.1
```

### MINOR

Nova funcionalidade compatível.

```text
0.1.0 → 0.2.0
```

### MAJOR

Breaking change.

```text
0.9.0 → 1.0.0
```

---

# 13. Changelog

Manter `CHANGELOG.md` atualizado.

Categorias sugeridas:

```text
Added
Changed
Fixed
Removed
Security
Deprecated
```

O changelog deve ser atualizado durante o PR de release, não somente depois do merge.

---

# 14. GitHub Actions

Criar CI obrigatório para PRs contra:

```text
main
develop
```

O CI deve validar no mínimo:

```text
install
lint
test
build
```

Quando aplicável, adicionar:

```text
typecheck
coverage
package validation
```

## 14.1 Proteção de branches

Configurar branch protection no GitHub para `main` e `develop` quando o repositório permitir:

- exigir PR para merge;
- exigir CI verde;
- bloquear push direto;
- exigir branch atualizada antes do merge quando necessário;
- exigir revisão humana para `main`;
- permitir auto-merge somente quando todos os checks obrigatórios estiverem verdes.

O agente pode criar, editar e testar workflows dentro do repositório sem solicitar permissão.

---

# 15. Política de release

`develop` é a linha contínua de integração. `main` representa somente versões publicáveis.

Fluxo oficial:

```text
feature/*
   ↓
Pull Request
   ↓
develop
   ↓
Release PR
   ↓
main
   ↓
tag vX.Y.Z
   ↓
GitHub Release
```

Nunca desenvolver diretamente em `main`.

Uma release deve ser criada somente quando:

- CI estiver verde em `develop`;
- documentação relevante estiver atualizada;
- `CHANGELOG.md` estiver atualizado;
- versão estiver definida;
- testes e build estiverem verdes;
- breaking changes estiverem documentadas.

A criação da tag deve ocorrer no commit mergeado em `main`.

---

# 16. Versionamento e changelog

Usar Semantic Versioning:

```text
vMAJOR.MINOR.PATCH
```

### PATCH
Correção compatível.

### MINOR
Nova funcionalidade compatível.

### MAJOR
Breaking change.

Enquanto estiver em `0.x`, manter mudanças potencialmente incompatíveis documentadas no changelog.

Categorias do `CHANGELOG.md`:

```text
Added
Changed
Fixed
Removed
Deprecated
Security
```

---

# 17. Definition of Done

Nenhum PR deve ser considerado concluído somente porque o código funciona localmente. O PR precisa deixar o repositório em estado sustentável.

Checklist mínimo:

```text
[ ] Implementação concluída
[ ] Testes adicionados/atualizados
[ ] Lint passando
[ ] Typecheck passando, quando aplicável
[ ] Build passando
[ ] Documentação atualizada, quando aplicável
[ ] Sem credenciais ou segredos no código
[ ] Sem dependências desnecessárias
[ ] Mudanças compatíveis com a arquitetura
[ ] PR focado em uma entrega
```

---

# 18. Regras específicas para o agente Antigravity

1. Trabalhar sempre a partir da branch de desenvolvimento e criar branches de trabalho para cada entrega.
2. Não misturar múltiplas features não relacionadas no mesmo PR.
3. Não pedir confirmação para operações dentro da pasta do repositório.
4. Só pedir permissão quando for necessário sair do escopo do repositório ou acessar recursos externos não autorizados.
5. Antes de declarar uma etapa concluída, executar os checks aplicáveis.
6. Ao encontrar uma implementação frágil, refatorar dentro do PR em vez de preservar código ruim apenas para evitar mudanças.
7. Preferir soluções simples, determinísticas, testáveis e reversíveis.
8. Não introduzir backend, banco de dados ou serviço externo sem necessidade arquitetural.
9. Não adicionar API keys, tokens, cookies, credenciais ou secrets ao repositório público.
10. Tratar disponibilidade de domínio, redes sociais e marcas como resultados probabilísticos/externos, nunca como garantia jurídica.
11. Registrar decisões arquiteturais relevantes em `docs/` quando não forem óbvias.
12. Manter o core independente da UI e das integrações externas.

---

# 19. Ordem de entrega resumida

```text
PR 01  Bootstrap
  ↓
PR 02  Modelos
  ↓
PR 03  Corpus/configuração
  ↓
PR 04  Gerador
  ↓
PR 05  Filtros
  ↓
PR 06  Scoring
  ↓
PR 07  PT/EN/DE
  ↓
PR 08  Similaridade
  ↓
PR 09  Ranking
  ↓
PR 10  Exportação
  ↓
PR 11  UI
  ↓
PR 12  Sessão local
  ↓
PR 13  Web Component / Plugin
  ↓
PR 14  Playground público
  ↓
PR 15  Performance
  ↓
PR 16  Abstrações externas
  ↓
PR 17  Domínios
  ↓
PR 18  Redes sociais
  ↓
PR 19  Marcas
  ↓
PR 20  Release Candidate
  ↓
Release PR
  ↓
main + tag
```

## Resultado esperado da primeira grande versão

Ao final do roadmap inicial, o repositório `dittogen` deverá oferecer:

- core TypeScript independente da UI;
- geração determinística e configurável;
- scoring explicável;
- heurísticas PT/EN/DE;
- filtros e deduplicação;
- ranking com diversidade;
- exportação;
- UI web estática;
- Web Component incorporável em sites estáticos;
- playground público;
- arquitetura para verificações externas sem expor secrets;
- CI;
- branch strategy `feature/* → develop → main`;
- releases versionadas e changelog.

O agente deve otimizar pela **entrega incremental de valor**, mantendo cada PR pequeno, testável e reversível.
