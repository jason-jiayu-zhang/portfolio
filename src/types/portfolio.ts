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
  /** User and technical challenges — 2–4 sentences each */
  problemSpace: string[]
  /** Design-to-code transition: design system, component parity, frontend stack */
  systemArchitecture: string[]
  /** Metrics, lessons learned, user impact */
  validation: string[]
  /** Optional forward-looking roadmap note */
  roadmap?: string
  /** Optional visual screenshots or mockups of the interface */
  images?: CaseStudyImage[]
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
  /** Index position on wheel 0-3, maps to 90° snap intervals */
  wheelIndex: 0 | 1 | 2 | 3
  /** Hex accent color per project */
  accentColor: string
  tagline: string
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

/** Wheel rotation math state */
export interface WheelState {
  /** Current rotation in degrees */
  angle: number
  /** Target snap angle */
  targetAngle: number
  /** Currently highlighted project index 0-3 */
  activeIndex: number
  /** Drag velocity for inertia */
  velocity: number
  isDragging: boolean
}

/** Single ring layer of the geometric wheel SVG */
export interface WheelRing {
  radius: number
  strokeWidth: number
  opacity: number
  dashed?: boolean
  dashArray?: string
  /** Number of tick marks evenly spaced on ring */
  ticks?: number
  tickLength?: number
}
