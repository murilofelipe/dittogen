<div align="center">
  <h1>✨ Dittogen</h1>
  <p><strong>A deterministic, rule-based brand name generator engine.</strong></p>
  
  [![CI](https://github.com/murilofelipe/dittogen/actions/workflows/ci.yml/badge.svg)](https://github.com/murilofelipe/dittogen/actions)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

  <i>Read this in / Leia isto em: <a href="README.pt.md">Português 🇧🇷</a></i>
</div>

<br />

**Dittogen** is a monorepo workspace for generating, scoring, filtering, and ranking brand names programmatically. Unlike LLM-based approaches, Dittogen leverages combinatorial rules, phonetic heuristics, and deterministic seeds to yield highly brandable, pronounceable, and memorable names at scale.

## 🚀 Features

- **Combinatorial Generation**: Mixes roots and suffixes deterministically using PRNG seeds.
- **Advanced Filtering**: Excludes names based on length, repetitive characters, stopwords, and custom RegEx patterns.
- **Heuristic Scoring (0-100)**: Evaluates vowel/consonant ratios, length, and spelling to score pronunceability and memorability.
- **Phonetic Deduplication**: Uses Levenshtein Distance to enforce diversity in the final top-ranking lists.
- **External Integration Abstractions**: Abstract classes ready to plug in Domain, Social Media, and Trademark verification tools.
- **Vue 3 Playground**: A visually rich, interactive web playground to tweak configurations on the fly and save your favorite brands locally.

## 📁 Repository Structure

Built as a `pnpm` workspace, the project is divided into:

- **`packages/core`**: The framework-agnostic TypeScript logic containing the Engine, Models, Filters, Scorer, and Providers.
- **`apps/playground`**: A Vue 3 + Tailwind CSS static application that acts as a UI for the core engine. Can be exported as a Web Component (`<dittogen-generator>`).
- **`config/`**: JSON linguistic datasets (roots, suffixes, languages).

## 🛠️ Getting Started

You can run Dittogen using Docker (recommended) or natively on your machine.

### Option 1: Running with Docker (Easiest)
If you have Docker and Docker Compose installed, you don't need to install Node or pnpm locally.

```bash
git clone https://github.com/murilofelipe/dittogen.git
cd dittogen
docker compose up
```
Open your browser at `http://localhost:5173`.

### Option 2: Running Locally

**Prerequisites**
- Node.js `18.x` or higher
- `pnpm` v9

**Installation**
```bash
git clone https://github.com/murilofelipe/dittogen.git
cd dittogen
pnpm install
```

**Running the Playground**
```bash
pnpm dev
```
Open your browser at `http://localhost:5173`. You can tweak roots, limits, and seeds to watch the scoring algorithm extract the Top N brands in real time.

### Build & Test

The monorepo uses Vitest for testing and TypeScript/Vite for building. You can run commands globally from the root:

```bash
# Run ESLint across the workspace
pnpm lint

# Run all Unit and Integration tests
pnpm test

# Build core types and the playground app
pnpm build
```

## 🧠 Core Architecture

If you want to use the engine programmatically, here is a sneak peek at the API lifecycle:

```typescript
import { NameGenerator, CandidateFilter, Scorer, Ranker } from '@dittogen/core';

// 1. Generate 
const generator = new NameGenerator({ roots: ['zen', 'core'], suffixes: ['ify', 'us'], count: 200 });
const rawNames = generator.generate();

// 2. Filter out bad combinations
const filter = new CandidateFilter({ minLength: 4, maxLength: 8 });
const validNames = filter.filterList(rawNames);

// 3. Score (0-100) based on memorability and pronunciation
const scorer = new Scorer();
const scoredNames = scorer.scoreList(validNames);

// 4. Rank and enforce diversity (removes similar sounding duplicates)
const ranker = new Ranker();
const topBrands = ranker.rankAndSelect(scoredNames, 10, true);
```

## 📄 License

This project is licensed under the MIT License.
