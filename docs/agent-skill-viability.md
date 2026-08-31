# Dittogen como skill / plugin de agente — análise (não fazer agora)

**Data:** 2026-08-31 · **Status:** ideia registrada, adiada · **Decisão:** só depois de CLI + npm

Levantamento sobre transformar o Dittogen numa **skill / plugin** para agentes
de IA (Claude Code, Cursor, etc.). MCP foi descartado (ver abaixo).

## Prior art

### Naming como skill de agente — NÃO é novidade

O espaço está lotado. Skills/plugins de brand naming pra Claude Code que já
existem (2026-08):

| Projeto | O que é |
| --- | --- |
| `veyralabsgroup/naming-suite` | 4 skills: gera+pontua nomes (8 fatores), ranqueia |
| `cofoundy/brand-skills` | ideia → marca completa (nome, identidade, voz, brand book), 70+ agentes |
| `glacierphonk/naming` | naming por metáfora, "evita AI slop" |
| `arnabbagxd/Brand-building-skills` | workflow completo de naming + avaliação |
| `shipshitdev/brand-name-generator` (explainx.ai) | 19★, ~50 installs/semana, 4.5/5 (38 reviews) |
| `claude-vibes/brand-naming-strategies`, skills no mcpmarket.com | idem |

**Todos são markdown puro** — instruem o LLM a inventar e pontuar nomes com o
próprio julgamento. O score sai do modelo, não de um algoritmo. Nenhum embute
engine determinístico nem fonética real.

### Engines determinísticos de verdade — existem, nenhum como skill

- **PhonoPair** (phonopair.com) — scoring fonético/semântico determinístico
  (CMU dict + ConceptNet), 0–100, check de domínio, score cards. É **SaaS web**,
  não lib, não ferramenta de agente.
- **`brand` (PyPI)** — arquitetura quase idêntica à do Dittogen (pipeline
  Generate/Score/Filter, fonética + sound symbolism). **Python**, lib, não é skill.
- **`unique-names-generator`, `phonetic` (npm)** — geração seedável, sem scoring
  de marca nem ranking. São peças, não engines.

### Veredito de novidade

- Slot "skill genérica de naming": **tomado**.
- Slot "engine determinístico que um agente chama": **aberto**. O Dittogen seria
  o único a dar ao agente um pipeline reproduzível, auditável e não-LLM em vez de
  o modelo improvisar. Diferencial real: *"mesma seed → mesmos nomes; o score vem
  de um algoritmo inspecionável, não de vibe"*.

## Skill vs plugin vs MCP

- **MCP — não vale.** MCP serve pra estado externo ao vivo (APIs, DBs). O Dittogen
  é computação local pura. Um server MCP é peso morto (processo, auth, deferral)
  pra algo que é um `npx`.
- **Skill — bom encaixe**, mas depende de 2 pré-requisitos:
  1. `@dittogen/core` publicado no npm (hoje `0.1.0`, sem publicar; scope
     `@dittogen` precisa ser criado).
  2. Um **CLI** no `@dittogen/core` (`bin: { dittogen: "dist/cli.js" }`) —
     ~50 linhas embrulhando o pipeline Generate→Filter→Score→Rank com flags
     (roots/suffixes/seed/count/filtros/topN) e saída JSON.
  Aí a skill é um `SKILL.md`: *"quando o usuário quer nomes de marca, não
  brainstorme — rode `npx @dittogen/core ...` com a seed/roots dados, apresente
  o ranking; depois aplique julgamento pra shortlist"*. Custo: ~1 entrada na
  listagem de skills.
- **Plugin — só se crescer.** Faz sentido pra empacotar skill + `/dittogen` +
  variações (generate / score-existing / rank-list) + datasets + entrada em
  marketplace. Exagero pra uma skill só.

## Recomendação

**Skill, depois de shipar CLI + npm.** O movimento de maior alavancagem não é a
skill — é publicar `@dittogen/core` com CLI, o que torna o Dittogen usável por
qualquer coisa (agentes, CI, scripts), não só Claude Code. A skill é a cereja em
cima disso.

**Vale a pena?** Modestamente. O diferencial (determinístico vs achismo do LLM)
é real e as skills existentes provam demanda. Mas é nicho pequeno e os
incumbentes têm vantagem de stars/tempo.

**Risco:** com os providers de domínio/trademark ainda mock, o "check de
disponibilidade" da skill seria fake — implementar um provider real (whois/DNS é
barato) ou tirar essa claim.

## Ordem sugerida quando for fazer

1. CLI em `packages/core` (`bin`, saída JSON, flags).
2. Publicar `@dittogen/core` no npm (criar scope `@dittogen`, granular token,
   workflow de release por tag — mesmo padrão do `rme-agent-bridge`).
3. 1 provider real (domínio via DNS/whois) — ou remover a claim.
4. `SKILL.md` + repo/marketplace de skill. Promover a plugin só se virar 2-3 comandos.
