# reposition.config.json

One file at the repo root. Claude reads all of it; the two tools read only
`url`, `widths`, `settleMs` and `hero`. Every path is relative to the folder
the config file is in.

| Field | Required | What it is |
| --- | --- | --- |
| `kernel.file` | yes | The file that holds the brand line and outcome line. |
| `kernel.brandLine` | yes | The name of the brand-line constant in that file. |
| `kernel.outcomeLine` | yes | The name of the outcome-line constant. |
| `decisionRecord` | yes | The team's decision record. Start it from `templates/positioning.md`. |
| `sweepPaths` | yes | The folders and files the sweep greps. Include every app and docs folder that can repeat the story, and single files outside them (a README, a build script). |
| `url` | yes | The page the tools open: a dev-server URL, or a path to a built HTML file (rebuild before every check). |
| `amdahl` | no | `"auto"` (default): the skill checks for Amdahl in draft mode and offers setup once per run if it is missing. `"off"`: the skill never mentions or calls Amdahl. See `references/amdahl.md`. |
| `widths` | no | Viewport widths to check. Default `[360, 768, 1440, 1728]`. |
| `settleMs` | no | How long to wait after load before measuring. It must outlast any reveal animation. Default `1500`. |
| `hero.headline` | no | CSS selector for the headline. `measure.mjs` writes candidates into the first match. Default `h1`. |
| `hero.maxRows` | no | The most rows the headline may take at any width. `verify-hero.mjs` fails if it takes more. |
| `hero.lines` | no | CSS selector for the headline's designed lines, when the design breaks it by hand (one element per line). `verify-hero.mjs` fails if any of them wraps. |
| `hero.reveal` | no | CSS selector for elements an entrance animation reveals (per character or per word). `verify-hero.mjs` fails if any is still not fully visible after `settleMs`. |

A selector that matches nothing makes the check FAIL, not pass. A check
with no selector (or no `maxRows`) does not run, and `verify-hero.mjs`
prints a "not checked" line for it, so a pass never hides a skipped check.

Command-line flags override the file: `--url=`, `--widths=360,1440`,
`--wait=3000`, `--config=path/to/file.json`. Without `--config`, the tools
read `reposition.config.json` in the current folder.

Exit codes: 0 all checks passed, 1 a check failed, 2 the tool could not run
(no config, no browser, or the page would not open).
