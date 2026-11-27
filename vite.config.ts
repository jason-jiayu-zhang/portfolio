import { readFile } from 'node:fs/promises'
import { relative, resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { parseNote } from './src/data/noteParse'

const DATA_DIR = resolve(__dirname, 'src/data')

// `note.md?meta` resolves to just that note's metadata (title, date, ornament,
// reading time), parsed at build time. The app lists notes from these, so the
// story text itself stays out of the main bundle.
function notesMeta(): Plugin {
  return {
    name: 'notes-meta',
    enforce: 'pre',
    async load(id) {
      if (!id.endsWith('.md?meta')) return
      const file = id.slice(0, -'?meta'.length)
      this.addWatchFile(file)
      const raw = await readFile(file, 'utf8')
      // Keyed the way src/data/notes.ts globs, so a note's metadata finds its body.
      const meta = parseNote(relative(DATA_DIR, file).split('\\').join('/'), raw)
      return `export default ${JSON.stringify(meta)}`
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [notesMeta(), react()],
})
