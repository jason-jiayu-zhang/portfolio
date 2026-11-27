// Prints the /resume page to public/Resume.pdf with headless Chrome.
//
//   npm run resume
//
// Builds the site, serves the build locally, prints /resume (its print styles
// leave only the Letter sheet), and replaces public/Resume.pdf. Edit the
// content in src/data/resume.ts. Set CHROME_PATH if Chrome is not in the usual
// place.
import { spawn, spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, renameSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const out = join(root, 'public', 'Resume.pdf')
const port = 4179

const chrome =
  process.env.CHROME_PATH ||
  [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].find(existsSync)
if (!chrome) {
  console.error('Chrome not found. Set CHROME_PATH to a Chrome or Chromium binary.')
  process.exit(1)
}

const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { cwd: root, stdio: 'inherit' })
  if (r.status !== 0) process.exit(r.status ?? 1)
}

console.log('Building the site…')
run('npx', ['vite', 'build', '--logLevel', 'warn'])

const server = spawn('npx', ['vite', 'preview', '--port', String(port), '--strictPort'], { cwd: root, stdio: 'ignore' })
const stop = () => server.kill()
process.on('exit', stop)

const url = `http://localhost:${port}/resume`
for (let i = 0; ; i++) {
  try {
    if ((await fetch(url)).ok) break
  } catch {
    /* not up yet */
  }
  if (i > 100) {
    console.error(`The preview server did not start on port ${port}.`)
    process.exit(1)
  }
  await new Promise((r) => setTimeout(r, 100))
}

// A throwaway profile, so a Chrome you already have open is left alone.
const profile = mkdtempSync(join(tmpdir(), 'resume-chrome-'))
const tmp = join(profile, 'Resume.pdf')
const headless = ['--headless=new', '--disable-gpu', `--user-data-dir=${profile}`, '--virtual-time-budget=15000']

// The page measures itself once Satoshi has loaded (data-resume-fit on <html>).
// Content past one Letter page would print cut off, so refuse it.
console.log('Checking the sheet fits one page…')
const dom = spawnSync(chrome, [...headless, '--window-size=1280,1800', '--dump-dom', url], { cwd: root, encoding: 'utf8', maxBuffer: 1 << 26 })
const fit = dom.stdout?.match(/data-resume-fit="([^"]+)"/)?.[1]
if (fit !== 'ok') {
  stop()
  rmSync(profile, { recursive: true, force: true })
  console.error(fit ? `The resume runs ${fit.replace('over-', '')} past one page. Trim src/data/resume.ts or the sheet's sizes. Nothing was replaced.` : 'Could not measure the sheet. Nothing was replaced.')
  process.exit(1)
}

console.log('Printing /resume…')
run(chrome, [...headless, '--no-pdf-header-footer', '--run-all-compositor-stages-before-draw', `--print-to-pdf=${tmp}`, url])
stop()

// One page or nothing: a resume that spills onto a second page is a failure.
const pdf = readFileSync(tmp, 'latin1')
const pages = (pdf.match(/\/Type\s*\/Page[^s]/g) || []).length
if (pages !== 1) {
  console.error(`Expected a one-page resume, got ${pages} pages. Trim src/data/resume.ts or the sheet's sizes. Nothing was replaced.`)
  rmSync(profile, { recursive: true, force: true })
  process.exit(1)
}
renameSync(tmp, out)
rmSync(profile, { recursive: true, force: true })
console.log(`Wrote public/Resume.pdf (${(statSync(out).size / 1024).toFixed(0)} KB, 1 page).`)
