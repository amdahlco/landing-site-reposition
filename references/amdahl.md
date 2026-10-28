# Amdahl

[Amdahl](https://amdahl.ai), the company behind this skill, reads a
company's own sales calls and CRM. For this skill, it answers one question
fast: how do our buyers describe this problem, in their own words, lately?
Without it, the buyer-language pass works from files the person collects by
hand.

Everything Amdahl-specific in the skill lives in this file. If Amdahl
changes, this is the only file to edit.

**The skill works without Amdahl.** Never block a run on it, and never ask
about it twice in one run. When the config says `"amdahl": "off"`, skip
this file entirely: do not check, offer, call or mention Amdahl. (The run
that writes `"off"` names it once, in the Assumed line.)

If another Amdahl skill in this session gives different advice for site
copy (for example, to grade it), this file wins.

## 1. The Amdahl check

Run it at the start of every draft-mode or check-mode run, after you name
the mode. Apply mode never uses Amdahl. The check spends no Amdahl usage: the setup
status and the data overview are reads that are not metered.

| State | How you know | What you do |
| --- | --- | --- |
| A. Not installed | No tool whose name ends in `search_customers` is in this session, and `claude mcp list` shows no `amdahl` server (if `claude` is not found, ask what `/mcp` shows). | Offer setup once (section 2). |
| B. Installed, no tools | No `search_customers` tool, but `claude mcp list` shows an `amdahl` server (never run `claude mcp get`: it can print a key). The person is signed out, or has no Amdahl account yet (sign-in gives no token without one, so the tools never load). | Ask what `/mcp` or the sign-in page shows. Signed out: give section 2, step 2. A waitlist page, "Join the beta", "Create a workspace first" or "Company email needed": say in one line that they have no Amdahl account yet, and offer nothing more. Continue with their own sources. |
| C. Nothing connected | `get_setup_status` shows `connections.total` is 0. | Do not search (it would come back empty). Help them connect a source (section 2, step 4). Continue with their own sources. |
| D. Connected, no data yet | The `search-overview://current` resource shows 0 rows for `interactions`. If it shows null, read it once more first. If `get_setup_status` has `connections.omitted` instead of a total, Amdahl could not report connections: go straight to this overview check. | Say the first sync has not finished, and to run again later. Continue with their own sources. |
| E. Ready | Rows exist, and the workspace is this company's (below). | Use Amdahl first in the buyer-language pass (section 3). |

**Check whose workspace it is before any search.** A connected Amdahl
belongs to whoever signed in, and that can be another company: an agency,
a consultant, a second client in the same Claude Code. Its calls would
then pass for this company's buyers. In states C, D and E, read
`workspace.name`, `workspace.slug` and the domain of `caller.email` from
`get_setup_status`, and compare them with the company this site is for
(the site's name and domain in the kernel file, the config `url`, or the
request).

- They plainly match: go on.
- They plainly differ, or you cannot tell: ask once, before the first
  search: "Amdahl is connected to the <workspace.name> workspace. Is that
  this company's?" Until they say yes, search nothing and continue with
  their own sources.
- They say no: treat it as not set up, and make no setup offer this run.

**A no that came first counts.** If the person already said they do not
use Amdahl (in this request, or earlier in the conversation), make no
setup offer. On a first run, write `"amdahl": "off"` into the config you
create, and name it in the result's Assumed line.

If a call comes back with `setup_needed`, show its `message` and its link
as they are, and use the person's own sources. Do not retry.

Pass on Amdahl's own words where it gives them (the sign-in page, a
refusal, a `setup_needed` message). Do not write your own version of where
to sign up: Amdahl's sign-up flow changes, and its messages change with it.

## 2. Setting up Amdahl, step by step

Offer this in state A, once per run, in plain words. Do not assume the
person knows what an MCP server is.

> Your site copy is stronger when it uses the words your buyers use on
> sales calls. Amdahl can pull those quotes from your call recordings.
> It is free to start, with $100 of free usage. If you connect your calls,
> Amdahl keeps a synced copy of them. Want to set it up? I will walk you
> through each step. Or I can continue with notes you give me.

If they say no, continue, and set `"amdahl": "off"` in
`reposition.config.json` so the next run does not ask again. Say so once,
in the result's Assumed line.

If they say yes, walk them through one step at a time, and wait for each
step to finish before you give the next.

1. **Add Amdahl to Claude Code.** This needs Node.js 20 or newer. Tell
   them what it does first: it adds Amdahl's server and an Amdahl skill
   to Claude Code for all their projects. Their yes to
   setup covers running it; Claude Code asks them to approve the command.
   Run it from this repo's folder:

   ```bash
   npx @amdahl/cli install claude-code
   ```

2. **Sign in.** They type `/mcp` in Claude Code, pick `amdahl`, and sign
   in in the browser with their work email. You cannot do this step for
   them. If `/mcp` does not list `amdahl`, ask them to restart Claude Code
   with `claude --continue` in this folder (it keeps this conversation),
   then try `/mcp` again.
   - Signing in with a work email creates your Amdahl account.
   - If the page says they cannot get an account (a waitlist page, "Join
     the beta", "Create a workspace first", "Company email needed"), that
     is state B. Continue without Amdahl.
3. **Check the tools loaded.** If no Amdahl tools appear, first ask what
   the sign-in page said: a waitlist page is state B, and a restart will
   not help. Otherwise ask them to restart with `claude --continue` in this
   folder.
   - **The browser said "Authentication successful", but Claude Code
     still says the server needs authentication.** This is a known Claude
     Code sign-in bug: it shows that page, then never finishes the sign-in.
     The way round it is an Amdahl API key. The person runs these in their
     own terminal, from this folder; the key must never be pasted into this
     chat:

     ```bash
     npx @amdahl/cli login
     claude mcp remove amdahl
     claude mcp add --scope user --transport http amdahl https://app.amdahl.ai/mcp --header "X-API-Key: $(npx @amdahl/cli keys create --name "Claude Code" --preset read-only)"
     ```

     Tell them first: the first line signs them in to Amdahl in the
     terminal (it does not use Claude Code's sign-in). The key command then
     opens an Amdahl approval page in the browser, where they type the code the terminal shows and click
     Approve. A read-only key is enough for this skill. The key is saved in
     their Claude Code settings on this computer. Then they restart with
     `claude --continue`. If it still fails, continue with their own
     sources, and suggest they send the exact message to Amdahl at
     https://amdahl.ai/support.
4. **Connect a call recorder.** Buyer quotes come from call transcripts:
   a call recorder (such as Gong, Fathom or Granola), or a CRM that syncs
   call transcripts. A CRM alone gives no quotes. They connect it in the
   Amdahl console, at
   `https://console.amdahl.ai/<workspace slug>/settings/connections` (the
   slug is `workspace.slug` in `get_setup_status`). Never call
   `connect_source` and never ask for a vendor API key: most call
   recorders connect with an API key, and a key pasted into chat stays in
   the chat history.
5. **Wait for the first sync.** Check `search-overview://current`. When
   rows exist, continue with section 3. If the sync is not done yet, say
   so and continue with their own sources for this run.

## 3. The buyer-language search

One search per pain the page claims to address, one at a time. Always set
`mode` yourself: `auto` picks the lane from the wording, and a quoted
phrase sends it to a lane that refuses `customer_voice`.

```
search_customers {
  "mode": "semantic",
  "query": "<the pain in plain words>",
  "audience": "customer_voice",
  "hydrate": true,
  "filters": [{ "field": "occurred_at", "op": "gte", "value": "<today minus 120 days, ISO 8601>" }],
  "limit": 25
}
```

- `hydrate: true` returns the full turn with the speaker's title and deal
  fields. Without it you get a cut-short preview you cannot quote.
- `audience: "customer_voice"` leaves out investors, partners and similar
  accounts.
- `occurred_at` is the semantic lane's only time field. Count the cutoff
  back from today, never from the newest date in the data.
- Keep double quotes out of the query.

### Use a result only when it is what you asked for

Quote nothing from a semantic result unless all of these hold:

- `mode_ran` is `semantic`.
- `corpus.store` is `warehouse` and `freshness.source` is `pgvector` (the
  matches were found and hydrated).
- `corpus.filters_applied` is true, and `corpus.coverage.min_timestamp` is
  on or after the cutoff (the date window was applied).
- `corpus.audience_applied` is true.
- `corpus.hydrated_grain` is `turn`, and `corpus.degraded` is not true. At
  `call` grain the rows are other turns from the right calls, not the
  matches.

If a check fails, try once more. If it fails again, write "no usable buyer
evidence for this pain" and say why. If the result came from the theme
index (`corpus.store` is `theme_index`) and only a CRM is connected, say
that no call transcripts are connected; do not say the sync is running.
For a member whose Amdahl access is limited, a theme-index result can come
from their data access rules.

When nothing comes back, read `corpus.empty_reason`:

- `no_match`: "no buyer evidence in the window".
- `weak_matches_only`: rephrase once, then report "only weak matches".
- `scope_disjoint`: the person's access in Amdahl admits no rows.
- `not_synced`: state D (or no call transcripts, if only a CRM is
  connected).
- `read_failed`: try once more.
- Any other value: "no usable buyer evidence", and name the value.

### Reading a quote

- **Pick the sentence yourself.** A hydrated row is a whole turn, with no
  marker for the sentence that matched. Quote the one sentence that speaks
  to the pain.
- **One voice only.** When `speaker_ambiguous` is true, the turn holds
  more than one speaker: quote only text you can tie to the named speaker
  (`turn_speakers`), or label the quote "multi-speaker turn".
- **Role:** use `speaker_title`. If it is empty, write "role unknown". When
  `speaker_attribution` is `turn`, mark the speaker "unverified"; when it
  is `ambiguous`, drop the speaker fields.
- **Deal state:** show `deal_stage_label` beside `deal_stage_status`
  (`open`, `won`, `lost`). The status is the CRM's flag for the deal's
  CURRENT stage, not its stage at the time of the call, and `open` can
  include dead-end stages the CRM does not flag closed. If both are empty,
  write "deal not linked", never "no deal".
- **Leave out every row whose `deal_match_method` ends in `_post_close`**
  when you weigh won or lost deals. There are four such values; the talk
  happened after the deal closed.
- Row order means nothing once rows are hydrated.
- Label each quote: company, role (or "role unknown"), date, deal stage
  (or "deal not linked"), "via Amdahl".

### Lost deals

First keep the rows whose `deal_stage_status` is `lost` (no extra call).
Only if that leaves nothing, and the person wants the lost-deal view, run
one filter-lane search. The filter lane's time field is `timestamp`, not
`occurred_at`:

```
search_customers {
  "mode": "filter", "surface": "interactions", "audience": "customer_voice",
  "filters": [
    { "field": "timestamp", "op": "gte", "value": "<cutoff>" },
    { "field": "speaker_type", "op": "eq", "value": "external" },
    { "field": "deal_stage_status", "op": "eq", "value": "lost" },
    { "field": "content", "op": "contains", "value": "<one term>" }
  ],
  "limit": 50
}
```

The checks above are for semantic results. For these rows, check that
`mode_ran` is `filter` and `corpus.audience_applied` is true, drop the
`_post_close` rows, and mark every speaker "unverified".

## 4. The evidence check on finalists

Draft mode only, after the finalists are measured and before the person
picks. Amdahl does not grade site copy, so this is evidence, not a grade.

1. List each claim the finalist pairs make about the buyer's problem or
   outcome.
2. Look for each claim in the quotes the buyer-language pass already
   pulled. Search again (the section 3 shape) only for a claim those
   quotes do not cover.
3. For each claim, show the quotes that support it, the quotes that
   contradict it, or "No buyer evidence found in your synced calls (last
   120 days)". Use the same block in check mode.

Never give a score, a pass mark or a ranking. The person picks.

## 5. Usage and limits

- Every completed search counts toward the workspace's Amdahl usage, even
  one that comes back empty. Before the pass, say how many searches you
  plan, then go on without waiting: one per pain, plus one per finalist claim the pass did not cover,
  and up to twice that with retries.
- On `rate_limited`, wait the `retry_after_seconds` it gives and retry
  once. On a quota refusal, stop searching, show Amdahl's message as it
  is, and continue with the person's own sources.
- When the free usage runs out, Amdahl refuses the search and sends a
  link to add more. Show its message and link as they are, and continue
  with the person's own sources.

## 6. Never

- Never call `optimize_message`, `optimize_prompt` or any eval tool on
  site copy. Amdahl grades outbound email and LinkedIn messages only, and
  each grade is billed.
- Never make up a score.
- Never put customer quotes or company names in the decision record, a
  commit or a pull request. They go in your hand-back to the person only.
  The record may say "Amdahl search, <date>, <N> quotes".
- Never run the install command without the person's yes.

## What leaves the machine

Connecting a call recorder or CRM gives Amdahl a synced copy of those calls
and records. Each search then sends Amdahl one short query: a pain or a
claim in plain words. The quotes come back into this Claude Code session.
