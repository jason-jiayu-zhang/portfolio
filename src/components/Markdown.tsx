import type { ReactNode } from 'react'
import { isOrnament } from '../data/notes'

// A small markdown renderer for notes. It covers what essays need and builds
// React elements, so nothing in a note is injected as raw HTML.

const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g

function inline(text: string, key = 0): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    const k = `${key}-${i}`
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return <strong key={k} className="font-bold text-cream">{inline(part.slice(2, -2), i)}</strong>
    if (/^(\*[^*]+\*|_[^_]+_)$/.test(part)) return <em key={k}>{inline(part.slice(1, -1), i)}</em>
    if (/^`[^`]+`$/.test(part)) return <code key={k} className="bg-night/60 px-1.5 py-0.5 text-[0.9em] text-cream">{part.slice(1, -1)}</code>
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
    if (link) {
      const external = /^https?:/.test(link[2])
      return (
        <a key={k} href={link[2]} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})} className="text-cream underline decoration-1 underline-offset-[0.3em] hover:text-white">
          {inline(link[1], i)}
        </a>
      )
    }
    return part
  })
}

// An ornament's glyphs are spaced by a flex gap, not letter-spacing, so each
// sits evenly whatever its font. U+263E ☾ only exists as a solid glyph in the
// system symbol fonts while its twin ☽ is an outline, so ☾ is drawn as a
// mirrored ☽: a ☾ ☽ pair then matches.
export function Ornament({ text, className = '' }: { text: string; className?: string }) {
  // Split on spaces, not code points, so a glyph keeps its variation selector.
  const glyphs = text.split(/\s+/).filter(Boolean)
  return (
    <span className={`inline-flex items-center justify-center gap-[0.5em] ${className}`}>
      {glyphs.map((c, i) => (
        <span key={i} className={c === '☾' ? 'inline-block -scale-x-100' : undefined}>
          {c === '☾' ? '☽' : c}
        </span>
      ))}
    </span>
  )
}

export default function Markdown({ source, verse = false }: { source: string; verse?: boolean }) {
  const blocks = source.split(/\r?\n\s*\r?\n/).map((b) => b.trim()).filter(Boolean)
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split(/\r?\n/)
        if (/^---+$/.test(block)) return <hr key={i} className="my-10 w-16 border-sand/40" />
        if (isOrnament(block)) {
          return (
            <p key={i} aria-hidden className="!my-12 text-center text-lg text-sand">
              <Ornament text={block} />
            </p>
          )
        }
        const h = block.match(/^(#{2,3})\s+(.*)$/)
        if (h && lines.length === 1) {
          return h[1] === '##' ? (
            <h2 key={i} className="!mt-12 text-2xl font-bold leading-tight text-cream md:text-[1.875rem]">{inline(h[2])}</h2>
          ) : (
            <h3 key={i} className="!mt-9 text-xl font-bold leading-snug text-cream">{inline(h[2])}</h3>
          )
        }
        if (lines.every((l) => l.startsWith('>'))) {
          return (
            <blockquote key={i} className="space-y-2 border-l-2 border-sand pl-5 text-lg italic text-cream">
              {lines.map((l, j) => <p key={j}>{inline(l.replace(/^>\s?/, ''))}</p>)}
            </blockquote>
          )
        }
        if (lines.every((l) => /^[-*]\s+/.test(l))) {
          return (
            <ul key={i} className="list-disc space-y-1.5 pl-5 marker:text-sand">
              {lines.map((l, j) => <li key={j}>{inline(l.replace(/^[-*]\s+/, ''))}</li>)}
            </ul>
          )
        }
        if (lines.every((l) => /^\d+\.\s+/.test(l))) {
          return (
            <ol key={i} className="list-decimal space-y-1.5 pl-5 marker:text-sand marker:tabular-nums">
              {lines.map((l, j) => <li key={j}>{inline(l.replace(/^\d+\.\s+/, ''))}</li>)}
            </ol>
          )
        }
        if (verse) {
          return (
            <p key={i}>
              {lines.map((l, j) => (
                <span key={j} className="block">{inline(l, j)}</span>
              ))}
            </p>
          )
        }
        return <p key={i}>{inline(lines.join(' '))}</p>
      })}
    </>
  )
}
