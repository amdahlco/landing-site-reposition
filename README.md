# reposition

A Claude Code skill that updates a marketing site when the company's
positioning changes.

You give Claude the input for the new story: founder notes, a sales call
summary, a draft, a brief. The skill then:

1. Drafts the two-line **kernel** (a brand line and an outcome line), with
   one recommendation and the reason. Or, if you hand over finished lines,
   it skips straight to applying them.
2. **Measures** each candidate headline on your real page, at every screen
   width, before proposing it.
3. **Applies** your pick on the dev server so you judge it running, not from
   a diff.
4. **Sweeps** every page, meta tag, share card and doc that still tells the
   old story.
5. **Records** what each decision taught in a decision record, so the next
   pivot needs less input from you.

It works on any site with a dev server: Next.js, Astro, plain HTML, anything
a browser can open.

## Install

You need Claude Code. The two checking tools also need Node 18 or newer.

1. Clone this repo into your skills folder:

   ```bash
   git clone https://github.com/amdahlco/landing-site-reposition.git ~/.claude/skills/reposition
   ```

2. Set up the tools, once per machine:

   ```bash
   cd ~/.claude/skills/reposition/tools && npm ci
   ```

   This installs one small package, locked in `tools/package-lock.json`.
   The tools measure your page in the Google Chrome (or Microsoft Edge)
   you already have; there is no browser to download. Optional: to also
   check the Safari engine, run `npx playwright-core install webkit` in the
   same folder (about 65 MB).

3. Start a new Claude Code session in your site's repo and say "we're
   repositioning", or "check this line against our calls". On the first
   full run, the skill writes two files in your repo:
   `reposition.config.json` and a decision record.

To update later: `git -C ~/.claude/skills/reposition pull`.

## Amdahl (optional)

The skill is best when its copy uses the words your buyers use on sales
calls. [Amdahl](https://amdahl.ai), the company behind this skill, finds
those quotes in your own call recordings, so you do not have to collect
them by hand. The skill works without it.

You do not need to set it up first. On the first draft run, the skill
checks for Amdahl and offers to walk you through setup, step by step:

1. Add Amdahl to Claude Code, from your site's repo (needs Node.js 20 or
   newer). This also adds an Amdahl skill to all your projects:

   ```bash
   npx @amdahl/cli install claude-code
   ```

2. In Claude Code, type `/mcp`, pick `amdahl` and sign in with your work
   email. That creates your Amdahl account. It is free to start, with
   $100 of free usage. If the browser says "Authentication
   successful" but Claude Code still asks you to sign in, that is a known
   Claude Code bug; the skill gives you a three-line fix with an Amdahl API
   key.
3. Connect a call recorder in the Amdahl console, under Settings, then
   Connections. Never paste a vendor API key into the chat.

What Amdahl gets: connecting a call recorder or CRM gives Amdahl a synced
copy of those calls and records. Each search sends Amdahl one short query
(a pain or a claim in plain words) and counts toward your Amdahl usage.
Amdahl does not grade site copy; the skill shows the buyer evidence behind
each candidate, never a score. To turn it off, set `"amdahl": "off"` in
`reposition.config.json`.

## Check that it works

```bash
cd ~/.claude/skills/reposition
node tools/verify-hero.mjs --config=examples/acme/reposition.config.json
node tools/measure.mjs --config=examples/acme/reposition.config.json "Know a build is safe before your users do."
```

The first prints `OK` for each engine and width, then `ALL OK`. The second prints how
many lines the candidate takes at each width.

## What is in here

| Path | What it is |
| --- | --- |
| `SKILL.md` | The method Claude follows. |
| `references/rules.md` | 22 starter copy rules, each with the reason it exists. |
| `references/customer-language.md` | How to find the words buyers use, from any source. |
| `references/amdahl.md` | Amdahl setup, the buyer-quote search, and the evidence check on finalists. |
| `references/external-surfaces.md` | LinkedIn, signatures and other surfaces outside the repo. |
| `references/agent-readability.md` | Making sure AI search and agents read the new story. |
| `references/config.md` | Every field of `reposition.config.json`. |
| `templates/positioning.md` | The decision record to copy into your repo. |
| `tools/measure.mjs` | Counts the lines a candidate headline takes, without editing files. |
| `tools/verify-hero.mjs` | Checks the hero in your own Chrome (and the Safari engine, if installed) at every width. |
| `examples/acme/` | A made-up company: a filled-in record, a config and a test page. |

## The two files in your repo

**`reposition.config.json`** says where your kernel lives, where your
decision record lives, which folders to sweep, and which page to measure.
See `references/config.md`.

**The decision record** (for example `docs/positioning.md`) holds your
current kernel, your copy rules, the lines you retired and why, and the list
of surfaces a pivot must reach. It is the part that compounds: each pass
adds what it learned, and the next pass reads it first. See
`examples/acme/positioning.md` for one after two pivots.

## What it never does

It does not push, merge, deploy, or message your team without asking. It
proposes; a person decides.

## Licence

MIT. See `LICENSE`.
