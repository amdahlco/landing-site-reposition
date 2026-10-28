// Measure candidate headlines at real size, without editing any file.
//
// Opens the page, writes each candidate into the live headline, and counts
// the rendered lines at every configured width. Nothing is saved; the page
// is reloaded for each width.
//
//   node <skill>/tools/measure.mjs "Candidate one." "Candidate two."
//   node <skill>/tools/measure.mjs "Deals stop waiting|on questionnaires."
//   node <skill>/tools/measure.mjs --selector=h2 --url=http://localhost:3000/ "A line."
//
// A headline the design breaks by hand (config `hero.lines`) is measured as
// it ships: split the candidate with "|" and each part goes into its own
// line element. A designed line that wraps is marked WRAPS. Without "|" on
// such a headline, the count is free wrap only, and the tool says so.
//
// Reads reposition.config.json from the current directory (url, widths,
// settleMs, hero.headline, hero.lines). Flags override it.

import { parseArgs, loadConfig, launch, openPage } from './lib.mjs'

const { flags, rest: candidates } = parseArgs(process.argv.slice(2))
if (candidates.length === 0) {
  console.error('Pass one or more candidate lines in quotes.')
  process.exit(2)
}
const config = loadConfig(flags)
const selector = flags.selector ?? config.hero.headline
const linesSelector = flags.selector ? '' : config.hero.lines
const split = (text) => text.split('|').map((part) => part.trim()).filter(Boolean)

const browser = await launch('chromium')
if (!browser) process.exit(2)

// results[candidate][width] = { rows, lineRows, widest, room }
const results = candidates.map(() => ({}))
let fontNote = ''
let linesFound = false

for (const width of config.widths) {
  const page = await openPage(browser, config.url, width, config.settleMs)
  const found = await page.evaluate((sel) => Boolean(document.querySelector(sel)), selector)
  if (!found) {
    console.error(`No element matches "${selector}" at ${config.url}`)
    await browser.close()
    process.exit(1)
  }
  for (const [i, text] of candidates.entries()) {
    const parts = split(text)
    const result = await page.evaluate(
      ({ sel, linesSel, parts }) => {
        const el = document.querySelector(sel)
        const original = el.innerHTML
        const rowsOf = (node) => {
          const style = getComputedStyle(node)
          let lineHeight = parseFloat(style.lineHeight)
          if (Number.isNaN(lineHeight)) lineHeight = parseFloat(style.fontSize) * 1.2
          return Math.round(node.getBoundingClientRect().height / lineHeight)
        }
        const style = getComputedStyle(el)
        const font = `${style.fontSize}, max width ${style.maxWidth}`
        const existing = linesSel ? [...document.querySelectorAll(linesSel)].filter((n) => el.contains(n)) : []
        let out
        if (parts.length > 1 && existing.length > 0) {
          // Plain text in clones of the first designed line, so an entrance
          // animation on the original words cannot hide the candidate.
          const first = existing[0]
          const clones = parts.map((part) => {
            const clone = first.cloneNode(false)
            clone.textContent = part
            return clone
          })
          first.replaceWith(...clones)
          for (const node of existing.slice(1)) node.remove()
          const lineRows = clones.map(rowsOf)
          const room = clones[0].clientWidth
          const widest = Math.max(
            ...clones.map((clone) => {
              const probe = document.createElement('span')
              probe.style.whiteSpace = 'nowrap'
              probe.textContent = clone.textContent
              clone.textContent = ''
              clone.append(probe)
              const w = Math.ceil(probe.getBoundingClientRect().width)
              clone.textContent = probe.textContent
              return w
            })
          )
          out = { rows: rowsOf(el), lineRows, widest, room, linesFound: true }
        } else {
          el.textContent = parts.join(' ')
          out = { rows: rowsOf(el), lineRows: null, linesFound: existing.length > 0 }
        }
        el.innerHTML = original
        return { ...out, font }
      },
      { sel: selector, linesSel: linesSelector, parts }
    )
    results[i][width] = result
    if (result.linesFound) linesFound = true
    if (width === Math.max(...config.widths)) fontNote = result.font
  }
  await page.close()
}
await browser.close()

const cell = (r) => {
  if (!r.lineRows) return String(r.rows)
  const wraps = r.lineRows.some((n) => n > 1)
  return `${r.rows} (${r.lineRows.join('+')})${wraps ? ' WRAPS' : ''}`
}

console.log(`measure: ${selector} at ${config.url} (in ${browser.label})`)
console.log(`widest viewport: ${fontNote}\n`)
const header = ['chars', ...config.widths.map((w) => `@${w}`)]
console.log(`${header.join('\t')}\tcandidate`)
let anyWraps = false
let anyFree = false
for (const [i, text] of candidates.entries()) {
  const cells = [split(text).join(' ').length, ...config.widths.map((w) => cell(results[i][w]))]
  console.log(`${cells.join('\t')}\t${text}`)
  for (const w of config.widths) {
    const r = results[i][w]
    if (r.lineRows?.some((n) => n > 1)) anyWraps = true
    if (!r.lineRows) anyFree = true
  }
}
const narrow = Math.min(...config.widths)
for (const [i, text] of candidates.entries()) {
  const r = results[i][narrow]
  if (r.lineRows) console.log(`@${narrow}: widest designed line ${r.widest} of ${r.room} px\t${text}`)
}
if (anyWraps) console.log('\nWRAPS: a designed line takes more than one row. verify-hero.mjs will fail on it.')
if (anyFree && linesSelector && linesFound) {
  console.log(
    `\nThis headline is built from designed lines (${linesSelector}). A candidate without "|" was measured as free wrap,\n` +
      'which is not how it ships. Split it, e.g. "First line|second line.", to measure each designed line.'
  )
}
