// ─────────────────────────────────────────────────────────────────────────────
// ABOUT SECTION DATA
// ─────────────────────────────────────────────────────────────────────────────

export interface TimelineEntry {
  period: string
  role: string
  org: string
  tags: string[]
  detail: string
}

export interface Belief {
  index: string
  headline: string
  body: string
}

export interface BookEntry {
  title: string
  author: string
  category: string
  status: 'reading' | 'done' | 'queued'
}

export interface RotationEntry {
  artist: string
  note: string
}

// ─── PROFESSIONAL TIMELINE ────────────────────────────────────────────────────

export const TIMELINE: TimelineEntry[] = [
  {
    period: 'Jul 2025 – Present',
    role: 'Figma Campus Leader',
    org: 'Figma @ UC Davis',
    tags: ['Community', 'Design Education', 'Workshop Facilitation'],
    detail:
      'Selected as one of Figma\'s global Campus Leaders — hosting workshops, Tech Mixer events, and Sticker Café drops. Bridges the gap between professional-grade tooling and student design culture.',
  },
  {
    period: 'Oct 2025 – Jan 2026',
    role: 'Vice President of Design',
    org: 'Product Space @ UC Davis',
    tags: ['Leadership', 'Mentorship', 'UI/UX'],
    detail:
      'Leads the design vertical of UC Davis\'s premier product organization. Responsible for brand cohesion, design mentorship pipeline, and establishing a human-first design culture across 100+ members.',
  },
  {
    period: 'Mar 2025 – Present',
    role: 'Design Engineer',
    org: 'Cattlelog (AggieWorks)',
    tags: ['Full-Stack Engineering', 'UI/UX Design', 'Product'],
    detail:
      'Architected the full design system and UI engineering layer for Cattlelog — a course discovery platform serving 30,000+ active UC Davis students. Drove 1:1 Figma-to-code component parity using React, TypeScript, Tailwind CSS, Vite, and Supabase.',
  },
  {
    period: 'Jan 2026 – Present',
    role: 'Full-Stack Designer',
    org: 'Fimanu',
    tags: ['Figma REST API', 'Full-Stack Engineering', 'Product Design'],
    detail:
      'Architected and built Fimanu, a web-based design inspector and asset visualization platform that leverages the Figma REST API to streamline asset tracking and developer handoff.',
  },
]

// ─── DOUBLE MAJOR CALLOUT ────────────────────────────────────────────────────

export const EDUCATION = {
  institution: 'UC Davis',
  degrees: ['B.A. Design', 'B.S. Computer Engineering'],
  note: 'Multi-discipline training anchoring decision making across all product domains: design, engineering, product, and more.',
  tools: ['Figma', 'Figma Make', 'Google Stitch', 'React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Supabase', 'Antigravity', 'Claude Code', 'Claude Design'],
}

// ─── CORE BELIEFS ────────────────────────────────────────────────────────────

export const BELIEFS: Belief[] = [
  {
    index: '01',
    headline: 'Data informs, empathy decides.',
    body: 'Design is only a hypothesis until validated by real human behaviors. By grounding my decisions in quantifiable metrics and qualitative research, I uncover what truly matters to users and build measurable outcomes, not just aesthetic templates.',
  },
  {
    index: '02',
    headline: 'Design in the open.',
    body: 'Good ideas come from everywhere. By curating a transparent and ego-free environment, I ensure that the entire product team has the ability to critique and co-create.',
  },
  {
    index: '03',
    headline: 'Alignment > Agreement.',
    body: 'Debate is a necessity for improvement. A team that challenges assumptions and commits to a unified direction will always outperform a team that merely nods along without conviction.',
  },
  {
    index: '04',
    headline: 'Solve for outcomes, not deadlines.',
    body: 'Projects end when code is shipped; products continue to live and evolve. I design for scale, anticipating the future needs of both users and builders. The shipping date is merely the start.',
  },
  {
    index: '05',
    headline: 'Code is a design medium.',
    body: 'To design is to master all constraints of the material. By bridging Figma to code and designers to engineers, I ensure that the art of design is translated into production software.',
  },
]

// ─── BOOKSHELF ────────────────────────────────────────────────────────────────

export const BOOKSHELF: BookEntry[] = [
  { title: 'Dune', author: 'Frank Herbert', category: 'Science Fiction', status: 'done' },
  { title: 'The Three-Body Problem', author: 'Liu Cixin', category: 'Science Fiction', status: 'done' },
  { title: 'The Da Vinci Code', author: 'Dan Brown', category: 'Mystery Thriller', status: 'done' },
  { title: 'The Adventures of Tintin', author: 'Hergé', category: 'Graphic Novel', status: 'done' },
  { title: 'What If?', author: 'Randall Munroe', category: 'Science / Humor', status: 'done' },
  { title: 'Thank You for Arguing', author: 'Jay Heinrichs', category: 'Communication', status: 'reading' },
  { title: 'Sea of Thunder', author: 'Evan Thomas', category: 'Military History', status: 'done' },
  { title: 'The Epic of Flight', author: 'Time-Life Books', category: 'Aviation History', status: 'done' },
]

// ─── CURRENT ROTATIONS ────────────────────────────────────────────────────────

export const ROTATIONS: RotationEntry[] = [
  { artist: 'The Marías', note: 'All I Really Want Is You' },
  { artist: 'Imagine Dragons', note: 'Amsterdam' },
  { artist: 'Ado', note: 'Aishite Aishite Aishite' },
  { artist: 'Lewis Capaldi', note: 'Bruises' },
  { artist: '秋野樱', note: '破旧世界 (Broken World)' },
  { artist: 'Arknights: Endfield', note: 'Rewrite the Prophecy' },
  { artist: 'Eve', note: 'Underdog' },
  { artist: 'ENHYPEN', note: 'Given-Taken' },
]

export interface PlaygroundEntry {
  label: string
  value: string
  sublabel?: string
}

export interface GameEntry {
  id: string
  title: string
  specs: PlaygroundEntry[]
}

// ─── PLAYGROUND ───────────────────────────────────────────────────────────────

export const PLAYGROUND: GameEntry[] = [
  {
    id: '01',
    title: 'Valorant',
    specs: [
      { label: 'Game', value: 'Valorant', sublabel: 'Competitive Ranked' },
      { label: 'Main Agents', value: 'Fade / Sova / Skye', sublabel: 'In-Game Leader' },
      { label: 'Rank', value: 'Ascendant I', sublabel: 'NA Server' },
      { label: 'Sensitivity', value: '.2 x 800', sublabel: 'E-DPI: 160' },
      { label: 'Peripherals', value: 'Razer Basilisk v3 / MelGeek MADE68 Pro', sublabel: 'Keyboard & Mouse' },
    ],
  },
  {
    id: '02',
    title: 'Arknights: Endfield',
    specs: [
      { label: 'Mode', value: 'Open-World RPG' },
      { label: 'Characters', value: 'Zhuang Fangyi / Arclight / Arcane' },
      { label: 'Progression', value: 'NA Server // Lv. 56' },
      { label: 'PLATFORM / DEVICE', value: 'Desktop / Mobile', sublabel: 'Cross-Play Sync' },
      { label: 'Peripherals', value: 'Razer Basilisk v3 / MelGeek MADE68 Pro', sublabel: 'Keyboard & Mouse' },
    ],
  },
  {
    id: '03',
    title: "Soul's Remnant",
    specs: [
      { label: 'Category', value: 'MMORPG' },
      { label: 'Classes', value: 'Archer / Mage / Kunai' },
      { label: 'Ranking', value: 'Top 1%', sublabel: 'Leaderboard Tier' },
      { label: 'Access', value: 'Alpha Play-Tester', sublabel: 'Pre-Release Sandbox' },
      { label: 'Peripherals', value: 'Razer Basilisk v3 / MelGeek MADE68 Pro', sublabel: 'Keyboard & Mouse' },
    ],
  },
]
