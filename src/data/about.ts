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
    period: 'Mar 2025 – Present',
    role: 'Product Designer & Frontend Engineer',
    org: 'Cattlelog (AggieWorks)',
    tags: ['Full-Stack Engineering', 'UI/UX Design', 'Product'],
    detail:
      'Own the UI, the design system and the frontend build of features for Cattlelog, a UC Davis course and professor catalog reaching over 15,000 users a quarter (65,000+ cumulative). I read and write the React frontend directly, and use AI tools for Figma-to-code translation and navigating nested code.',
  },
  {
    period: 'Jan 2026 – Present',
    role: 'Solo Designer & Builder',
    org: 'Fimanu',
    tags: ['Figma REST API', 'Full-Stack Engineering', 'Product Design'],
    detail:
      'Designed and built Fimanu, which turns Figma version history into a GitHub-style activity heatmap and embeddable widgets. I owned the product direction, UI and system architecture, directing AI coding tools to build the full-stack implementation.',
  },
  {
    period: 'Sep 2025 – Present',
    role: 'Design Advisor',
    org: 'Formula Racing @ UC Davis',
    tags: ['Design Systems', 'Graphics', 'Marketing'],
    detail:
      'Guiding the Formula Racing Design Systems team to design a unified brand and asset ecosystem for the team\'s 200+ members.',
  },
  {
    period: 'Oct 2025 – Jan 2026',
    role: 'Vice President of Design',
    org: 'Product Space @ UC Davis',
    tags: ['Leadership', 'Mentorship', 'UI/UX'],
    detail:
      'Led the design vertical of UC Davis\'s premier product organization. Responsible for brand cohesion, design mentorship pipeline, and establishing a human-first design culture across 100+ members.',
  },
  {
    period: 'Apr 2025 – Jul 2026',
    role: 'Design Advisor',
    org: 'Computer Science Tutoring Center @ UC Davis',
    tags: ['UI/UX', 'Graphics', 'Education'],
    detail:
      'Mentored the design team for the Computer Science Tutoring Center at UC Davis organization, giving feedback into their website, graphics, and overall brand identity.',
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
  { artist: 'Neuro-sama', note: 'Neurotoxin' },
  { artist: 'Imagine Dragons', note: 'Amsterdam' },
  { artist: 'Ado', note: 'Aishite Aishite Aishite' },
  { artist: 'K/DA', note: 'Firestarter' },
  { artist: 'Ado', note: '0' },
  { artist: 'Lauv feat. BTS', note: 'Who' },
  { artist: 'Eve', note: 'Underdog' },
  { artist: 'OneRepublic', note: 'Invincible' },
]

export interface PlaygroundEntry {
  label: string
  value: string
  sublabel?: string
}

/** Where a standing sits on the game's own ladder, drawn as a route profile. */
export interface Ladder {
  spec: string // label of the spec the profile replaces in the list
  at: number // 0..1 along the route
  ticks: { label: string; at: number; minor?: boolean }[] // minor ticks hide on phones
  reads: string // the position in words, for screen readers
}

export interface GameEntry {
  id: string
  title: string
  specs: PlaygroundEntry[]
  ladder?: Ladder
}

const VALORANT_TIERS = ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ascendant', 'Immortal', 'Radiant']

// ─── PLAYGROUND ───────────────────────────────────────────────────────────────

export const PLAYGROUND: GameEntry[] = [
  {
    id: '01',
    title: 'Valorant',
    specs: [
      { label: 'Genre', value: 'Tactical Shooter' },
      { label: 'Main Agents', value: 'Fade / Sova / Skye', sublabel: 'In-Game Leader' },
      { label: 'Rank', value: 'Ascendant I', sublabel: 'NA Server' },
    ],
    ladder: {
      spec: 'Rank',
      // Ascendant I: first of three divisions in tier 7 of 9.
      at: (6 + 1 / 6) / 9,
      ticks: VALORANT_TIERS.map((t, i) => ({ label: t, at: (i + 0.5) / 9, minor: ![0, 6, 8].includes(i) })),
      reads: 'tier 7 of 9, between Diamond and Immortal',
    },
  },
  {
    id: '02',
    title: 'Arknights: Endfield',
    specs: [
      { label: 'Genre', value: 'Open-World RPG' },
      { label: 'Characters', value: 'Zhuang Fangyi / Arclight / Arcane' },
      { label: 'Progression', value: 'Authority Level // Lv. 57' },
    ],
    ladder: {
      spec: 'Progression',
      at: (57 - 1) / 59, // levels 1 to the cap of 60 across the frame
      ticks: [1, 10, 20, 30, 40, 50, 60].map((l) => ({ label: l === 1 ? 'Lv. 1' : l === 60 ? 'Lv. 60' : String(l), at: (l - 1) / 59, minor: l === 10 || l === 30 || l === 50 })),
      reads: 'level 57 of the 60 cap',
    },
  },
  {
    id: '03',
    title: "Soul's Remnant",
    specs: [
      { label: 'Genre', value: 'MMORPG' },
      { label: 'Classes', value: 'Archer / Mage / Kunai' },
      { label: 'Ranking', value: 'Top 1%', sublabel: 'Global Leaderboard' },
    ],
    ladder: {
      spec: 'Ranking',
      at: 0.99,
      ticks: [
        { label: 'Top 75%', at: 0.25 },
        { label: 'Top 50%', at: 0.5 },
        { label: 'Top 25%', at: 0.75 },
      ],
      reads: 'top 1% of the leaderboard',
    },
  },
]
