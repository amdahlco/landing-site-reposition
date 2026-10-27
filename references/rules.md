# Starter copy rules

These rules came from real repositioning passes on a B2B site. Each was
learned by getting it wrong first, so each carries its reason. Copy the ones
that fit your team into your decision record, then add, change or delete
them as your own passes teach you. The examples are invented.

They govern marketing headlines and supporting copy. Product UI (buttons,
labels, empty states) usually needs different rules.

## How copy gets decided

These five habits predict most review calls. Use them to make the call
instead of offering three options and waiting.

- **Deletion is the default fix.** Given "reword it" or "remove it", removal
  wins almost every time. Before you propose a rewrite, ask whether the line
  needs to exist.
- **Near-repetition is a defect, not emphasis.** When two lines circle the
  same idea, one of them goes.
- **Type weight and size read as meaning.** Reviewers notice hierarchy before
  wording. A positioning line set too light reads as a caption, whatever it
  says.
- **A typographic flaw counts as broken.** One orphaned word alone on a
  second line is worth a copy change.
- **Outcome words beat quality words.** "Winning" over "best", "what closed"
  over "effective".

## The rules

### 1. Adjacent screens must not share a word stem

"Continuous testing for your releases." over a next screen that opens
"Continuously test every deploy." reads as a copy bug. Reinforcement must
add something the reader can see it adding. The rule measures SCREENS, not
sections: the same word several screens apart reads as consistency, and is
fine when the second line completes the first rather than repeating it.

### 2. Prefer the word that carries its own measure

"Best outputs" begs "best by what measure?". "Winning outputs" answers it
inside the word. Pick the word that implies the evidence, and the shortest
one that still does.

### 3. Prefer the concrete term over the abstract one

A phrase that sounds precise but points at no data you can name is jargon.
Check verbs the same way: whose word is it, and does it cover everything the
product does? **A rule justified by an audience expires when the audience
changes.** When the buyer changes, re-run the test; do not inherit the
answer.

### 4. A pain quoted from discovery is not copy

Every buyer says they want tools "that actually work". In the buyer's mouth
that is specific. Printed by a vendor it is an empty superlative, and it
tells a buyer whose tools already work that the page is not for them. Buyer
vocabulary carries over. Buyer complaints do not. Strike the intensifier
("actually", "truly") and see whether a fact remains.

### 5. Delete a restating subhead; do not promote it

When a headline and subhead say one thing, the shorter one usually survives.
A promoted subhead often measures as three lines of display type: a
paragraph in a heading slot.

### 6. A label that names what sits directly under it is noise

An eyebrow reading "Plan, Build, Ship" above tabs labelled Plan, Build and
Ship is a caption on a caption. The rule holds within one visual register:
a display headline over small tabs is not the same mistake, because a
skimmer reads the headline and never the tabs.

### 7. A supporting line never outweighs the positioning line

If a setup instruction is set heavier than the sentence that says what the
company is, the eye lands on the instruction first. Check that the most
important sentence is also the most prominent one.

### 8. Grep the page for verbatim duplication

Before adding a line, search the page for it. A hero eyebrow that repeats a
section headline further down can sit there long enough to look intentional.

### 9. Display headlines balance their lines

Use `text-wrap: balance` (Tailwind `text-balance`) on every display
headline, so a line never breaks with one orphaned word.

### 10. A headline must never introduce nothing on mobile

If a section's visual is desktop-only, the phone shows a heading over an
empty band. Give the section a mobile object, or drop the headline there.

### 11. Copy inside a visual comes from real data

Demo output written by hand in a component is how a site ends up claiming
something the product does not do. Feed the visual from the same data the
product uses, or from one vetted demo library.

### 12. Demo numbers use the product's real scales

If the product grades 1 to 5, a demo that shows "62 / 100" makes the real
product look like a different one. Invented demo data is fine. An invented
scale is not.

### 13. Metadata carries brand plus outcome; the mechanism stays on the page

The share card's job is the click, not the explanation. Two short
declaratives work; a "so you can" tail does not. The card is read at about
350 pixels wide in a chat app, so anything sized as a caption at 1200 pixels
is invisible where it is read.

### 14. The AI tells, as a checklist

Each is survivable alone and fatal stacked: triads (one list per passage at
most), em-dash asides, "so [persona] can [verb]" tails. The fix is one idea
per sentence, not rearranged clauses.

### 15. Scrutiny follows the audience

Copy people read (the page, the share card) gets the full review. Copy only
agents read (`llms.txt`, agent cards) needs accuracy, not craft, and can
change without a review round.

### 16. A headline is a label for what sits under it, not a slot

Write the section's contents first, then ask what you would call that shelf.
A slogan belongs over the section that backs it up. After any structural
edit, re-check every headline against the content now under it: content
moves in refactors, headlines do not follow on their own.

### 17. No multiplier claims in headlines

"10x faster" is the genre buyers discount on sight. If the line needs a
multiplier to feel strong, the line is weak. Measured numbers with a method
under them are different.

### 18. A headline template appears once per page

"Testing infrastructure for mobile teams." in the hero and "Release
infrastructure for mobile teams." two sections down read as the company
disagreeing with itself. Trim one fill or re-headline the other section.

### 19. Diagram labels say only what flows

A wire label is a schematic annotation. A compound label ("requests and
scores") turns it into a caption fighting for space. Put the explanation in
a hover or a disclosure at the element.

### 20. Complement the buyer's stack; never compete with it

The most expensive lesson in this set. A prospect replied to outbound: "we
already have this layer built internally". Two copy failures caused it:

- **The page described the half the buyer already owns.** Lead with the
  part they cannot build in an afternoon.
- **The page sounded like a replacement.** "Platform", or a build-verb aimed
  at the reader, puts you on their side of the line. If they build the
  product and you sit under it, keep the verbs theirs: "help your team ship",
  not "ship faster with us".

The test, on every headline: could a buyer who already built part of this
read the line and think "I have that"? If yes, rewrite it.

### 21. A repositioning changes what the site leads with, not always what it contains

When a pivot takes a feature out of the brand line, do not grep the word and
strike it everywhere. Ask whether each sentence states what the company IS
(that moves) or describes what the product does (that usually stays). This is
why the retired-lines list holds whole sentences, never single words.

### 22. A rename is a copy change; the plumbing stays

When a product or feature name changes, URLs, anchors, API paths and tool
names stay put. Deep links and integrations must survive a marketing
decision.
