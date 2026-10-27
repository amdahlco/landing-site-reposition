# Agent readability

Buyers increasingly meet a company through an agent: an AI search, a chat
assistant, a coding agent asked "what is X". Those read the server HTML, not
the page a browser paints. Google's own guide to AI features sets the bar at
ordinary crawlability: server-rendered text, image alt text, snippet
eligibility. Check every surface a pivot touches against it.

- **A visual's meaning must exist as real text in the server HTML.** Charts
  drawn in the browser, typed-on transcripts and anything revealed by a
  timer never reach a crawler. Add a visually hidden twin (a table or a
  sentence) fed from the same data as the animation, so the two cannot
  drift.
- **`aria-hidden` is for decoration only.** The moment a hidden element
  carries a fact (a number, a name, a step), that fact needs a text home on
  the page.
- **Mount-on-scroll removes text from the server HTML.** A component that
  renders only when it scrolls into view contributes nothing to a crawl.
  Its text version must live in a parent that does render.
- **Build page metadata through one helper.** Hand-built Open Graph blocks
  are how pages ship with no share image. One helper gives the canonical
  URL, the image and its alt text by construction.
- **A new public section is not shipped until the sitemap and `llms.txt`
  know it exists.** `llms.txt` is often the first file an agent reads.
- **A share card whose content is a title carries that title as its alt
  text.**

## The check

After a pivot, curl each changed page and grep the raw HTML for the facts a
crawler should see: the new brand line, the meta description, the numbers
and labels in visuals.

```bash
curl -s http://localhost:3000/ | grep -o '<meta name="description"[^>]*>'
curl -s http://localhost:3000/llms.txt | head -5
```
