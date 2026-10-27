# Contributing

Thanks for helping. This skill updates a site when positioning changes, and
changes should keep it doing that one job well.

## Report a bug or ask for a feature

Open an issue. For a bug, include the command you ran, what you expected,
what happened, and your `reposition.config.json` if you can share it.

For a security problem, do not open an issue. See `SECURITY.md`.

## Send a change

1. Fork the repo and make your change on a branch.
2. Run both tools against the example:

   ```bash
   node tools/verify-hero.mjs --config=examples/acme/reposition.config.json
   node tools/measure.mjs --config=examples/acme/reposition.config.json "A test line."
   ```

   The first must print `ALL OK`. The tool setup is in `README.md`.
3. A new copy rule needs its reason and an invented example, like the ones in
   `references/rules.md`. A rule with no reason will not be merged.
4. Open a pull request that says what changes for a person using the skill,
   and how you tested it.

A maintainer reviews every pull request, and changes land as one squashed
commit on `main`.

By sending a change, you agree that it is released under the MIT licence in
`LICENSE`.
