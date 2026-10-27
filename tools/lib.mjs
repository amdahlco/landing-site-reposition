// Shared setup for measure.mjs and verify-hero.mjs: read the config, apply
// command-line overrides, resolve the page URL, and launch the browsers.

import { readFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

let playwright
try {
  playwright = await import('playwright-core')
} catch {
  console.error(
    'playwright-core is not installed next to these tools.\n' +
      'Run once:  cd <skill folder>/tools && npm ci'
  )
  process.exit(2)
}

/**
 * Split argv into flags (--name=value) and plain arguments.
 * @param {string[]} argv
 * @returns {{ flags: Record<string, string>, rest: string[] }}
 */
export function parseArgs(argv) {
  const flags = {}
  const rest = []
  for (const arg of argv) {
    const hit = arg.match(/^--([a-z-]+)=(.*)$/s)
    if (hit) flags[hit[1]] = hit[2]
    else rest.push(arg)
  }
  return { flags, rest }
}

/**
 * Read reposition.config.json (or --config=) from the current directory and
 * apply --url, --widths and --wait. Fails loudly when there is no URL,
 * because a check with nothing to open must not look like a pass.
 * @param {Record<string, string>} flags
 */
export function loadConfig(flags) {
  const path = resolve(flags.config ?? 'reposition.config.json')
  let config = {}
  if (existsSync(path)) {
    try {
      config = JSON.parse(readFileSync(path, 'utf8'))
    } catch (err) {
      console.error(`Could not read ${path}: ${err.message}`)
      process.exit(2)
    }
  } else if (flags.config) {
    console.error(`No config file at ${path}`)
    process.exit(2)
  }

  const url = flags.url ?? config.url
  if (!url) {
    console.error(
      'No page to open. Set "url" in reposition.config.json or pass --url=http://localhost:3000/'
    )
    process.exit(2)
  }

  const widths = (flags.widths ? flags.widths.split(',') : config.widths ?? [360, 768, 1440, 1728])
    .map(Number)
    .filter((n) => n > 0)

  // A path in the file is relative to the config's folder; a --url path is
  // relative to where the command runs.
  const base = flags.url ? process.cwd() : dirname(path)

  return {
    url: toUrl(url, base),
    widths,
    settleMs: Number(flags.wait ?? config.settleMs ?? 1500),
    hero: { headline: 'h1', lines: '', reveal: '', maxRows: 0, ...(config.hero ?? {}) },
  }
}

/** A plain path (a built page on disk) becomes a file:// URL. */
function toUrl(value, base) {
  if (/^https?:\/\//.test(value) || value.startsWith('file://')) return value
  return pathToFileURL(resolve(base, value)).href
}

/**
 * Launch one engine. WebKit is optional on hosts where it will not start,
 * so the caller decides whether a missing engine is a failure.
 * @param {'chromium' | 'webkit'} name
 */
export async function launch(name) {
  // Chromium: use the Chrome or Edge the person already has, so nothing is
  // downloaded. A browser installed with playwright-core is the last resort.
  const tries =
    name === 'chromium'
      ? [
          { label: 'Chrome', opts: { channel: 'chrome' } },
          { label: 'Edge', opts: { channel: 'msedge' } },
          { label: 'Chromium', opts: {} },
        ]
      : [{ label: 'WebKit', opts: {} }]
  for (const { label, opts } of tries) {
    try {
      const browser = await playwright[name].launch(opts)
      browser.label = label
      return browser
    } catch {
      // Try the next one.
    }
  }
  if (name === 'chromium') {
    console.error('No Chrome or Edge found. Install Google Chrome, then run this again.')
  }
  return null
}

/**
 * Open the page at one width and wait for it to settle. Waits for the load
 * to finish BEFORE starting the settle clock: a cold dev-server compile can
 * eat a fixed sleep and leave the page mid-animation.
 */
export async function openPage(browser, url, width, settleMs) {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 60000 })
  } catch (err) {
    // Not a failed check: the tool could not run, so exit 2 with one line,
    // not a stack trace.
    console.error(`Could not open ${url}: ${String(err.message).split('\n')[0]}`)
    console.error('Is the dev server running, or the page built? Check "url" in the config.')
    await browser.close()
    process.exit(2)
  }
  await page.waitForFunction(() => document.readyState === 'complete')
  await page.waitForTimeout(settleMs)
  return page
}
