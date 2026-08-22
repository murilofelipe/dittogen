# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0-rc.1] - 2026-08-21
### Added
- **Core**: Combinatorial name generator based on roots and suffixes with seeds.
- **Core**: Character limits, repetition checks, unicode normalization, and stopwords filtering.
- **Core**: Scoring engine evaluating pronunciation, memorability, and spelling (0-100 score).
- **Core**: Levenshtein distance for duplication detection.
- **Core**: Ranker utility to extract Top N candidates with phonetic diversity.
- **Core**: Configurable datasets for roots, suffixes, phonemes, and stopwords (Portuguese, generic).
- **Core**: CSV and JSON exporters for generated results.
- **Core**: Abstract interfaces and mocks for Domain, Social Media, and Trademark providers.
- **Playground**: Static Vue 3 application built with Vite and TailwindCSS to interact visually with the engine.
- **Playground**: Web Component wrapper \`<dittogen-generator>\`.
- **Playground**: LocalStorage integration for favoriting generated names.
