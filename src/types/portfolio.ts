// ─────────────────────────────────────────────────────────────────────────────
// PORTFOLIO DATA MODELS
// Pristine TypeScript interfaces for all project content
// ─────────────────────────────────────────────────────────────────────────────

export type ProjectCategory =
  | 'Product'
  | 'UI/UX'
  | 'Full-Stack Engineering'
  | 'Mentorship'
  | 'Graphics'
  | 'Marketing'
  | 'Tooling'

export type ExperimentType = string

export interface ProjectMetric {
  label: string
  value: string
}

// ─── ARCHETYPE A — Formal Full Case Study ────────────────────────────────────
export interface CaseStudyImage {
  src: string
  label: string
  description?: string
}

/** Structured editorial case study content. Maps to Phase 1 Archetype A. */
export interface CaseStudyContent {
  /** One-paragraph context, engineering role, and high-level product impact */
  executiveSummary: string
  /** Opening paragraph that leads with the result; replaces the At a Glance trio */
  lede?: string
  /** Short fact rows shown beside the lede, e.g. ['What it is', '…'] */
  facts?: [string, string][]
  /** User and technical challenges — 2–4 sentences each */
  problemSpace?: string[]
  /** Design-to-code transition: design system, component parity, frontend stack */
  systemArchitecture?: string[]
  /** Evidence lines; a `figure` is set large beside its sentence (the sentence still carries the number) */
  validation: (string | { figure: string; body: string })[]
  /** One caveat printed under the results, e.g. how "users" is counted */
  resultsNote?: string
  /** Closing section: what went wrong, what it cost, the rule followed now */
  lessons?: CaseStudyLessons
  /** Intro line for the live embed section */
  liveActivityNote?: string
  /** Optional forward-looking roadmap note */
  roadmap?: string
  /** Optional visual screenshots or mockups of the interface */
  images?: CaseStudyImage[]
  /** Optional Fimanu Figma-activity embed URL, rendered as a live widget */
  figmaActivityEmbedUrl?: string
  /** "At a Glance" panel; falls back to project narrative + executiveSummary */
  glance?: { product?: string; goal?: string; impact?: string }
  /** Callout cards under "The Problem" */
  problemCallouts?: CaseStudyCallout[]
  /** Extra long-form sections rendered after The Problem */
  sections?: CaseStudySection[]
}

export interface CaseStudyCallout {
  label?: string
  lead?: string
  body: string
}

export interface CaseStudyList {
  items: string[]
  ordered?: boolean
}

export interface CaseStudySection {
  id: string
  title: string
  /** Short label for the altimeter rail (about 12 characters at most) */
  nav?: string
  paragraphs?: string[]
  list?: CaseStudyList
  /** Paragraphs rendered after the list */
  after?: string[]
  blocks?: {
    heading: string
    paragraphs?: string[]
    list?: CaseStudyList
    after?: string[]
    callouts?: CaseStudyCallout[]
    image?: CaseStudyImage
  }[]
}

export interface CaseStudyLesson {
  /** The mistake, named in a few words */
  title: string
  /** What happened and what it cost */
  body: string
  /** The rule followed now */
  rule?: string
}

export interface CaseStudyLessons {
  intro?: string
  items: CaseStudyLesson[]
  outro?: string
}

export interface Project {
  id: string
  /** Short codename for wheel label */
  slug: string
  title: string
  subtitle: string
  role: string
  tools: string[]
  categories: ProjectCategory[]
  metrics: ProjectMetric[]
  /** Hex accent color per project */
  accentColor: string
  tagline: string
  /** Short proof chip on the work card, e.g. "55,000 USERS" */
  badge?: string
  /** Case-study header facts */
  timeline?: string
  team?: string
  narrative: string[]
  url?: string
  year: string | number
  /** Award labels e.g. "1st Place", "Honorable Mention" */
  awards?: string[]
  status: 'live' | 'offline' | 'archived'
  /** Optional deep-dive case study content (Archetype A) */
  caseStudy?: CaseStudyContent
}

export type ExperimentCategory = 'published' | 'conceptual'

// ─── ARCHETYPE B — Informal Experiment Log ───────────────────────────────────
/** Casual, conversational experiment log content. Maps to Phase 1 Archetype B. */
export interface ExperimentLogContent {
  /** What sparked the idea — a tool, an adjustment, a whim */
  spark: string
  /** 1–2 sentence high-level summary of the visual output */
  output: string
  /** Raw quick reflection: what was fun, what was learned */
  sandbox: string
}

export interface Experiment {
  id: string
  title: string
  contextLabel: string
  visualAssetType: ExperimentType
  description: string
  imageUrl?: string
  /** Smaller variant for the dense studio grid; falls back to imageUrl */
  thumbUrl?: string
  year: string | number
  category: ExperimentCategory
  role?: string
  /** Optional experiment log content (Archetype B) */
  log?: ExperimentLogContent
}

export interface SocialLink {
  platform: string
  label: string
  url: string
  handle: string
}

export interface BioProfile {
  name: string
  fullName: string
  title: string
  roles: string[]
  email: string
  resumeUrl: string
  tagline: string
  socials: SocialLink[]
}

export interface StatusCycle {
  text: string
  emoji?: string
}

