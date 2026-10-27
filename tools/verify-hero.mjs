// Check the hero after a change, in the Chrome or Edge already installed
// (and the Safari engine when WebKit is installed), at every width:
//
// - every element the entrance animation reveals is fully visible
//   (hero.reveal), and the selector matches something;
// - every designed headline line renders as exactly one row (hero.lines);
// - the headline takes no more than hero.maxRows rows;
// - nothing overflows the page sideways.
//
// A check with no selector does not run and is listed as "not checked".
//
//   node <skill>/tools/verify-hero.mjs
//   node <skill>/tools/verify-hero.mjs --url=http://localhost:3000/ --wait=3000
//
// Reads reposition.config.json from the current directory. Exits 1 on any
// problem, 2 when it could not run. --wait must outlast the reveal
// animation: a wait that is too short reports a working hero as broken, so
// raise it when unsure, never lower it.

import { parseArgs, loadConfig, launch, openPage } from './lib.mjs'

const { flags } = parseArgs(process.argv.slice(2))
const config = loadConfig(flags)
const { hero } = config

console.log(
  `verify-hero: ${config.url} | widths ${config.widths.join(',')} | settle ${config.settleMs}ms`
)
// A check with no selector does not run. Say so up front and again at the
// end, so ALL OK never hides a skipped check.
const notChecked = [
  !hero.lines && 'designed lines (hero.lines is empty)',
  !hero.reveal && 'entrance animation (hero.reveal is empty)',
  !(hero.maxRows > 0) && 'headline row cap (hero.maxRows is not set)',
].filter(Boolean)
for (const item of notChecked) console.log(`not checked: ${item}`)
console.log('')

let failed = false
let chromeRan = false

for (const engine of ['chromium', 'webkit']) {
  const browser = await launch(engine)
  if (!browser) {
    // Chrome or Edge is required. WebKit (the engine behind Safari) is
    // optional: without it, the Safari check is listed as not checked.
    if (engine === 'chromium') break
    else {
      const item = 'Safari engine (WebKit is not installed: cd tools && npx playwright-core install webkit, about 65 MB)'
      notChecked.push(item)
      console.log(`not checked: ${item}`)
    }
    continue
  }
  if (engine === 'chromium') chromeRan = true
  console.log(`${engine}: using ${browser.label}`)
  for (const width of config.widths) {
    const page = await openPage(browser, config.url, width, config.settleMs)
    const r = await page.evaluate((hero) => {
      const rowsOf = (el) => {
        const style = getComputedStyle(el)
        let lh = parseFloat(style.lineHeight)
        if (Number.isNaN(lh)) lh = parseFloat(style.fontSize) * 1.2
        return Math.round(el.getBoundingClientRect().height / lh)
      }
      const visible = (el) => el.offsetParent !== null || getComputedStyle(el).position === 'fixed'

      const reveal = hero.reveal ? [...document.querySelectorAll(hero.reveal)] : null
      const hidden = reveal ? reveal.filter((el) => Number(getComputedStyle(el).opacity) < 0.99) : []
      const lines = hero.lines ? [...document.querySelectorAll(hero.lines)] : null
      const headline = document.querySelector(hero.headline)

      return {
        reveal: reveal && reveal.length,
        hidden: hidden.length,
        lineRows: lines && lines.map(rowsOf),
        headlineRows: headline && visible(headline) ? rowsOf(headline) : null,
        h2: [...document.querySelectorAll('h2')]
          .filter(visible)
          .slice(0, 4)
          .map((el) => `"${el.textContent.trim().slice(0, 30)}"=${rowsOf(el)}`),
        overflow: document.documentElement.scrollWidth - window.innerWidth,
      }
    }, hero)

    const problems = []
    if (r.reveal === 0) problems.push(`hero.reveal "${hero.reveal}" matches nothing`)
    if (r.hidden > 0) problems.push(`${r.hidden}/${r.reveal} revealed elements still hidden`)
    if (r.lineRows && r.lineRows.length === 0) problems.push(`hero.lines "${hero.lines}" matches nothing`)
    if (r.lineRows && r.lineRows.some((n) => n !== 1))
      problems.push(`designed lines rendered as [${r.lineRows}] rows`)
    if (r.headlineRows === null) problems.push(`no visible "${hero.headline}"`)
    else if (hero.maxRows > 0 && r.headlineRows > hero.maxRows)
      problems.push(`headline takes ${r.headlineRows} rows, over hero.maxRows ${hero.maxRows}`)
    if (r.overflow > 0) problems.push(`page overflows sideways by ${r.overflow}px`)
    if (problems.length) failed = true

    const status = problems.length ? `FAIL ${problems.join('; ')}` : 'OK'
    const info = [`headline rows ${r.headlineRows}`, ...(r.h2.length ? [`h2 rows ${r.h2.join(' ')}`] : [])]
    console.log(`${engine.padEnd(8)} @${width}: ${status} | ${info.join(' | ')}`)
    await page.close()
  }
  await browser.close()
}

// No Chrome or Edge means the check could not run at all.
if (!chromeRan) process.exit(2)
const skipped = notChecked.length ? ` (not checked: ${notChecked.length}, listed above)` : ''
console.log(failed ? '\nFAILED' : `\nALL OK${skipped}`)
process.exit(failed ? 1 : 0)
