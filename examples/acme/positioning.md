# Positioning decision record (example)

A filled-in record for Acme, a made-up company that sells release checks to
mobile teams. Everything here is invented. It shows what the template looks
like after two pivots.

## The kernel

Lives in: `src/site.ts`

```
brand:   Release checks for mobile teams.
outcome: Know a build is safe before your users do.
```

Why each line survived, and what it replaced:

- **The brand line** replaced "The testing platform for mobile teams." A
  prospect replied to outbound: "we already run our own test suite on CI".
  "Testing" named the half every buyer already owns, and "platform" sounded
  like a replacement for it (rule 20). "Release checks" names the half
  nobody had built: a gate between a green CI run and the app store.
- **The outcome line** replaced "Ship faster with confidence." That line was
  generic (any vendor could paste it) and its "confidence" was a quality
  word with no measure (rule 2). "Before your users do" names the moment and
  the stake in the buyer's own words, from three lost-deal calls.

## The rules

Rules 1 to 22 from the skill's starter set, plus:

### 23. "Mobile" stays in the brand line, never the outcome line

Tried "Know a mobile build is safe..." for one draft. The brand line one
breath above already says "mobile teams", so the pair said the noun twice
(rule 1). The brand line names the category; the outcome line names the
moment.

## How copy gets decided here

- Deletion is the default fix.
- The head of sales reads every headline aloud on a call before it ships. A
  line that needs explaining on the call is cut.

## The working loop

1. Propose with a recommendation, not a menu.
2. If someone asks for opinion first, give opinion only.
3. Show it running. Nothing ships from a diff read.
4. Measure before asserting.
5. Report the verdict, not the investigation.
6. Batch copy tweaks into one pull request per pass.

## Measure candidates

At the hero's desktop size (72 pixels), the budget is about 30 characters
for one line and 58 for two. A 58-character candidate was predicted at three
lines and measured at two, which is why we measure.

Screenshot traps on this site:

- The hero types itself on over about one second. Wait for it.

## Coupled surfaces: a positioning change is never one file

**Derived from the kernel:**

- Homepage `<title>` and meta description
- The share card image
- `public/llms.txt`

**Hand-written, read on every pivot:**

- `/about` and `/careers` page openers
- The docs site's first paragraph
- The sign-up screen's heading

**Off-repo, proposals only:**

- LinkedIn company tagline
- Email signature row
- GitHub org description

### Retired lines

- "The testing platform for mobile teams." (pivot 2: named the half buyers
  own, and "platform" read as a replacement; rule 20)
- "Ship faster with confidence." (pivot 2: generic, no measure; rules 2
  and 4)
- "Mobile CI that never breaks." (pivot 1: a multiplier-style absolute, and
  "CI" put us in the buyer's own pipeline; rules 17 and 20)

### Retired category nouns

- "platform": dead as our category word. Fine as ordinary English ("the app
  store platform").

### Deliberately NOT retired

- "Catch it before the store does." The release-day section headline. Still
  ours; never flag it.
