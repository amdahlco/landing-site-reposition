# Positioning decision record

How the site's positioning gets decided, and how to check a change before it
ships. Read this before rewriting a headline, the share card or the kernel.

This is a decision record, not a style guide. Every rule is here because it
was gotten wrong first, and the reason matters more than the rule.

**Keeping it current.** Add to it when a pass TEACHES something: a principle
not yet written down, a case that contradicts a rule, a rule that stopped
being true. Not on every copy change. A file that logs every edit becomes a
changelog nobody reads.

## The kernel

Lives in: `<kernel file>`

```
brand:   <the category claim: what the company is>
outcome: <what the buyer gets>
```

Why each line survived, and what it replaced:

- <brand line reason>
- <outcome line reason>

## The rules

Start from the skill's `references/rules.md`. Copy the rules that fit, then
edit them as your passes teach you. Number them so a later entry can say
"rule 4 failed again".

## How copy gets decided here

The taste that predicts the review calls, so a pass can make the call
instead of offering a menu. Names record who taught a rule, not whose
permission it needs.

- Deletion is the default fix.
- <add your team's habits>

## The working loop

1. Propose with a recommendation, not a menu.
2. If someone asks for opinion first, give opinion only.
3. Show it running. Nothing ships from a diff read.
4. Measure before asserting. Line counts and overflow are facts.
5. Report the verdict, not the investigation.
6. <your team's rule on batching pushes and pull requests>

## Measure candidates

At the hero's desktop size, the budget is about <N> characters for one
line and <M> for two. Measure with the skill's `tools/measure.mjs`; record
the budgets here once you know them.

Screenshot traps on this site:

- <for example: sections below the fold render at opacity 0 until scrolled
  into view>

## Coupled surfaces: a positioning change is never one file

The canonical sweep list. The skill reads it; keep it here and nowhere else.

**Derived from the kernel** (they update when the constants move):

- <homepage metadata>
- <share card image>
- <llms.txt>
- <agent or MCP cards>

**Hand-written, read on every pivot:**

- <pages that restate the story in their own words: about, product, careers>
- <docs site opener>
- <the product's own sign-up or first-run screens>

**Off-repo, proposals only:**

- <LinkedIn tagline, email signature row, GitHub org description>

### Retired lines

The sweep's grep list. On every pivot, grep each line and read every hit,
and append the outgoing brand and outcome lines in the same pass. A retired
SENTENCE reappearing is drift. A shared word is not: read the context.

- "<retired line>" (<date or PR>: <why it died>)

### Retired category nouns

A hit needs a human read, never an automatic flag:

- <noun>: <where it is dead, where it is still fine>

### Deliberately NOT retired

Phrasing the company still stands by. Never flag it as drift.

- "<line>"
