// Measure candidate headlines at real size, without editing any file.
//
// Opens the page, writes each candidate into the live headline, and counts
// the rendered lines at every configured width. Nothing is saved; the page
// is reloaded for each width.
//
//   node <skill>/tools/measure.mjs "Candidate one." "Candidate two."
//   node <skill>/tools/measure.mjs --selector=h2 --url=http://localhost:3000/ "A line."
//
// Reads reposition.config.json from the current directory (url, widths,
// settleMs, hero.headline). Flags override it.

import { parseArgs, loadConfig, launch, openPage } from './lib.mjs'

const { flags, rest: candidates } = parseArgs(process.argv.slice(2))
if (candidates.length === 0) {
  console.error('Pass one or more candidate lines in quotes.')
  process.exit(2)
}
const config = loadConfig(flags)
const selector = flags.selector ?? config.hero.headline

const browser = await launch('chromium')
if (!browser) process.exit(2)

// rows[candidate][width] = rendered line count
const rows = candidates.map(() => ({}))
let fontNote = ''

for (const width of config.widths) {
  const page = await openPage(browser, config.url, width, config.settleMs)
  const found = await page.evaluate((sel) => Boolean(document.querySelector(sel)), selector)
  if (!found) {
    console.error(`No element matches "${selector}" at ${config.url}`)
    await browser.close()
    process.exit(1)
  }
  for (const [i, text] of candidates.entries()) {
    const result = await page.evaluate(
      ({ sel, text }) => {
        const el = document.querySelector(sel)
        const original = el.innerHTML
        // Plain text, so an entrance animation on the original markup
        // cannot leave the candidate invisible or half-measured.
        el.textContent = text
        const style = getComputedStyle(el)
        let lineHeight = parseFloat(style.lineHeight)
        if (Number.isNaN(lineHeight)) lineHeight = parseFloat(style.fontSize) * 1.2
        const rows = Math.round(el.getBoundingClientRect().height / lineHeight)
        const font = `${style.fontSize}, max width ${style.maxWidth}`
        el.innerHTML = original
        return { rows, font }
      },
      { sel: selector, text }
    )
    rows[i][width] = result.rows
    if (width === Math.max(...config.widths)) fontNote = result.font
  }
  await page.close()
}
await browser.close()

console.log(`measure: ${selector} at ${config.url} (in ${browser.label})`)
console.log(`widest viewport: ${fontNote}\n`)
const header = ['chars', ...config.widths.map((w) => `@${w}`)]
console.log(`${header.join('\t')}\tcandidate`)
for (const [i, text] of candidates.entries()) {
  const cells = [text.length, ...config.widths.map((w) => rows[i][w])]
  console.log(`${cells.join('\t')}\t${text}`)
}
