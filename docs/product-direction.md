# Voxie Product Direction

## One-liner
Voxie is a **deck-first, curator-first Vocaloid platform**.
Cards are the building blocks, but decks are the primary product unit users discover, share, and remember.

## Product thesis

```text
card archive → deck culture → curator identity → curator community
```

- **Card archive** gives Voxie raw material.
- **Deck culture** turns that material into interpretable, shareable flows.
- **Curator identity** makes decks feel authored instead of anonymous.
- **Curator community** is the long-term loop, but not the first optimization target.

## What is P0 now

### 1. Deck-first UX
- decks should be the clearest thing on landing
- deck detail should communicate story, order, and why the deck matters
- deck creation/editing should make curation feel natural

### 2. Curator identity
- author attribution on cards and decks
- profile pages with basic curator context
- language that makes authorship visible, not hidden metadata

### 3. Embedded / shareable media
- YouTube support where cards benefit from direct media context
- stable public deck URLs
- low-friction sharing UX for decks

## What is P1 next
- related decks / related cards discovery loops
- onboarding seed decks that teach people how to use Voxie
- lightweight social actions that reinforce curator follow-through
- home/landing refinements after deck-first baseline is visible

## Explicitly not near-term focus
- recommendation algorithms
- full social network depth
- heavy moderation tooling
- generic archive scale without curator identity
- optimizing raw card density before deck/share loop is clear

## Product language to keep consistent
- **Deck**: the primary user-facing unit
- **Card**: an input/building block inside a deck system
- **Curator**: the person whose taste/ordering creates meaning
- **Story flow**: the intended reading order and emotional/interpretive arc

## Usage
Use this doc as the parent reference when implementing linked product issues.
If a feature competes with deck-first / curator-first direction, it is probably not P0.
