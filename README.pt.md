<div align="center">
  <h1>✨ Dittogen</h1>
  <p><strong>Um motor determinístico de geração de nomes de marcas baseado em regras.</strong></p>
  
  [![CI](https://github.com/murilofelipe/dittogen/actions/workflows/ci.yml/badge.svg)](https://github.com/murilofelipe/dittogen/actions)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

  <i>Read this in / Leia isto em: <a href="README.md">English 🇺🇸</a></i>
</div>

<br />

O **Dittogen** é um workspace monorepo voltado para a geração, pontuação, filtragem e rankeamento programático de nomes de marcas (naming). Ao contrário de abordagens baseadas puramente em LLMs, o Dittogen utiliza regras combinatórias determinísticas, heurísticas fonéticas e limites estritos para extrair, em grande escala, nomes curtos, pronunciáveis e fáceis de memorizar.

## 🚀 Funcionalidades

- **Geração Combinatória**: Cruza raízes e sufixos de forma determinística utilizando _seeds_ (PRNG).
- **Filtros Avançados**: Descarta nomes ruins baseando-se em limites de caracteres, repetição excessiva de letras, normalização Unicode (remoção de acentos), stopwords e Regex.
- **Scoring Heurístico (0-100)**: Avalia o balanço entre consoantes e vogais, tamanho ideal da string e ortografia para dar uma nota de "Pronúncia" e "Memorização".
- **Deduplicação Fonética**: Utiliza a Distância de Levenshtein para impedir que o "Top N" fique lotado com nomes praticamente idênticos.
- **Abstrações Externas**: Classes (Providers) prontas para plugar integrações de verificação de Domínio, Redes Sociais e INPI/Marcas futuramente.
- **Playground em Vue 3**: Uma interface interativa super rápida para você testar as gerações na hora e salvar seus favoritos no LocalStorage.

## 📁 Estrutura do Repositório

Arquitetado via workspaces no `pnpm`, o projeto é dividido em:

- **`packages/core`**: Biblioteca Typescript independente de framework. Contém toda a lógica e algoritmos matemáticos do gerador.
- **`apps/playground`**: Aplicativo estático feito em Vue 3 + TailwindCSS. Pode ser compilado como um Web Component (`<dittogen-generator>`).
- **`config/`**: Dicionários de raízes, sufixos, fonemas e stopwords em JSON.

## 🛠️ Como Usar

Você pode rodar o Dittogen usando Docker (recomendado) ou nativamente na sua máquina.

### Opção 1: Rodando com Docker (Mais Fácil)
Se você tiver o Docker e o Docker Compose instalados, não precisa instalar o Node ou o pnpm na sua máquina. Criamos um `Makefile` para facilitar sua vida.

```bash
git clone https://github.com/murilofelipe/dittogen.git
cd dittogen
make up
```
Isso vai rodar o container em segundo plano (detached mode). Acesse `http://localhost:5173`.
Quando terminar de usar, rode `make down` para desligar o container. Se quiser ver os logs, use `make logs`.

### Opção 2: Rodando Nativamente

**Pré-requisitos**
- Node.js `18.x` ou superior
- `pnpm` v9

**Instalação**
```bash
git clone https://github.com/murilofelipe/dittogen.git
cd dittogen
pnpm install
```

**Rodando o Playground (Frontend)**
```bash
pnpm dev
```
Acesse `http://localhost:5173`. Você pode brincar com as combinações de sufixos e raízes diretamente do painel lateral.

### Build & Testes

Nós utilizamos o Vitest para testes unitários e ESLint para padronização. Tudo pode ser orquestrado direto da raiz:

```bash
# Roda a validação de lint em todo o repositório
pnpm lint

# Roda a suíte de testes do core
pnpm test

# Compila os tipos TypeScript e builda o Frontend
pnpm build
```

## 🧠 Arquitetura do Core

Se você quiser consumir o pacote programaticamente no seu próprio projeto, o ciclo de vida da engine funciona assim:

```typescript
import { NameGenerator, CandidateFilter, Scorer, Ranker } from '@dittogen/core';

// 1. Gera o lote inicial de forma determinística
const generator = new NameGenerator({ roots: ['zen', 'core'], suffixes: ['ify', 'us'], count: 200 });
const rawNames = generator.generate();

// 2. Aplica filtros eliminatórios duros
const filter = new CandidateFilter({ minLength: 4, maxLength: 8 });
const validNames = filter.filterList(rawNames);

// 3. Classifica de 0-100 avaliando ratio de vogais e tamanho
const scorer = new Scorer();
const scoredNames = scorer.scoreList(validNames);

// 4. Ranqueia os melhores garantindo diversidade na lista
const ranker = new Ranker();
const topBrands = ranker.rankAndSelect(scoredNames, 10, true);
```

## 📄 Licença

Projeto distribuído sob a licença MIT.
