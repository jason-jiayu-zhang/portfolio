// ─────────────────────────────────────────────────────────────────────────────
// PORTFOLIO DATA - Phase 2 enriched content (caseStudy + log fields populated)
// ─────────────────────────────────────────────────────────────────────────────

import type { Project, Experiment, BioProfile, SocialLink, StatusCycle } from '../types/portfolio'

// ─── BIO ─────────────────────────────────────────────────────────────────────

export const BIO: BioProfile = {
  name: 'JJZ',
  fullName: 'Jason Jiayu Zhang',
  title: 'Product Designer',
  roles: ['DESIGN ENGINEER', 'PRODUCT DESIGNER'],
  email: 'jason.jiayu.zhang@gmail.com',
  resumeUrl:
    '/JasonResume.pdf',
  tagline: 'to nurture others to love the art of making.',
  socials: [
    {
      platform: 'LinkedIn',
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/jason-jiayu-zhang/',
      handle: 'jason-jiayu-zhang',
    },
    {
      platform: 'X',
      label: 'X (Twitter)',
      url: 'https://x.com/jasonjiayuzhang',
      handle: 'jasonjiayuzhang',
    },
    {
      platform: 'GitHub',
      label: 'GitHub',
      url: 'https://github.com/jason-jiayu-zhang',
      handle: 'jason-jiayu-zhang',
    },
    {
      platform: 'Email',
      label: 'Email',
      url: 'mailto:jason.jiayu.zhang@gmail.com',
      handle: 'jason.jiayu.zhang@gmail.com',
    },
  ] satisfies SocialLink[],
}

// ─── STATUS CYCLE ─────────────────────────────────────────────────────────────

export const STATUS_CYCLE: StatusCycle[] = [
  { text: 'Designing @ Cattlelog' },
  { text: 'Refining design tokens' },
  { text: 'Engineering full-stack products' },
  { text: 'Drinking an iced matcha' },
  { text: 'Building custom keyboards' },
  { text: 'Figma Campus Leader' },
  { text: 'Reading design system docs' },
  { text: 'Playing tennis' },
]

// ─── FEATURED PROJECTS ────────────────────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    id: 'cattlelog',
    year: 'Present',
    slug: 'Cattlelog',
    title: 'Cattlelog',
    subtitle: 'Streamlining Course & Professor Discovery for UC Davis',
    role: 'Design Engineer',
    tools: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Supabase', 'Figma'],
    categories: ['Product', 'Full-Stack Engineering', 'UI/UX'],
    wheelIndex: 0,
    accentColor: '#9cd5f8',
    tagline: 'Streamlining Course & Professor Discovery for UC Davis',
    metrics: [
      { label: 'Total Users', value: '30,000+' },
      { label: 'Daily Actives', value: '1,000+' },
    ],
    narrative: [
      'Cattlelog is a course and professor discovery platform serving 30,000+ UC Davis students, combining professor ratings, grade distributions, and comparison tools to simplify academic planning.',
    ],
    url: 'https://daviscattlelog.com',
    status: 'live',
    caseStudy: {
      executiveSummary:
        'As Lead Product Designer & UI Engineer, I spearheaded the design and development of Cattlelog, a comprehensive course and professor discovery platform now serving over 30,000 students at UC Davis. Bridging my double-major in Design and Computer Engineering, I owned the full arc from Figma system design through production React implementation. By combining professor ratings, grade distributions, and side-by-side comparison tools, Cattlelog dramatically simplifies academic planning for one of the largest public universities in the US.',
      problemSpace: [
        'UC Davis students historically navigated six separate pages, from school-affiliated to reddit, just to plan a single quarter: cross-referencing RateMyProfessor, the official Course Registrar, GE requirement sheets, and grade-distribution PDFs in parallel browser tabs.',
        'The core challenge was consolidating this fractured information landscape, GE requirements, live course data, professor reviews, and historical grade distributions, into a single authoritative catalog without overwhelming users with information density.',
        'From a technical standpoint, the system needed to handle real-time search and multi-axis filtering across a large course corpus while maintaining sub-200ms interaction latency on both desktop and mobile browsers.',
      ],
      systemArchitecture: [
        'The design system was architected in Figma first: a rigorously token-based component library covering typography scales, spacing primitives, color roles, and interactive states. Every component was designed with direct React parity in mind: each Figma frame mapped one-to-one to a typed React component.',
        'The frontend stack, Vite, React, TypeScript, Tailwind CSS, was chosen for developer velocity and strict type safety. Tailwind utility classes were mapped directly from Figma\'s design token names, ensuring zero drift between design intent and shipped UI.',
        'Supabase served as the backend layer for course and professor data, with a Postgres full-text search index powering the catalog search. The data pipeline fed directly into a React Query cache layer, keeping the UI reactive without redundant fetches.',
      ],
      validation: [
        'Cattlelog scaled to 30,000+ total users and 1,000+ daily actives within its first academic year, driven entirely by word-of-mouth among UC Davis students.',
        'The component design system proved its value when the team shipped the Grade Distribution feature in under a week, the existing token system absorbed the new UI without regressions in visual consistency.',
      ],
      roadmap:
        'Next: a personalized dashboard that aggregates a student\'s full course history, predicted GPA curves per major, and proactive scheduling conflict detection, moving Cattlelog from a discovery tool to an ongoing academic co-pilot.',
      images: [
        {
          src: '/images/projects/cattlelog/landing.webp',
          label: 'Landing Page',
          description: 'Consolidated UC Davis course & professor catalog discovery portal.'
        },
        {
          src: '/images/projects/cattlelog/about.webp',
          label: 'Team & Mission',
          description: 'Meet the designers and engineers behind the platform.'
        },
        {
          src: '/images/projects/cattlelog/cattleblog.webp',
          label: 'Cattleblog',
          description: 'Academic planning resources, tips, and student announcements.'
        }
      ]
    },
  },
  {
    id: 'fimanu',
    year: 'Present',
    slug: 'Fimanu',
    title: 'Fimanu',
    subtitle: 'GitHub-style activity tracker for Figma files',
    role: 'Full-Stack Engineer',
    tools: [
      'React',
      'TypeScript',
      'Node.js',
      'Express',
      'Supabase',
      'Figma REST API',
      'Tailwind CSS',
      'Vite'
    ],
    categories: ['Product', 'Full-Stack Engineering', 'Tooling'],
    wheelIndex: 1,
    accentColor: '#feb34f',
    tagline: 'Visualizing Figma design activity with GitHub-style heatmaps and adaptive syncing.',
    metrics: [
      { label: 'Role', value: 'Solo Creator' },
      { label: 'Focus', value: 'Full-Stack Development' }
    ],
    narrative: [
      'A GitHub-style activity tracker that monitors your Figma version history, intelligently syncs edits to a Supabase database, and provides a beautiful visual dashboard of your design activity over time.'
    ],
    url: 'https://figma-tracker-production.up.railway.app/',
    status: 'live',
    caseStudy: {
      executiveSummary: 'Fimanu is a GitHub-style activity tracker designed to bring engineering-grade visibility to Figma design workflows. As the sole creator and developer, I architected this application from the ground up to continuously monitor Figma version history, intelligently sync file edits to a scalable Supabase database, and provide a premium, interactive visual dashboard of daily design activity. By transforming abstract design efforts into quantifiable, visual metrics, Fimanu empowers designers and product managers with a unified, transparent view of collaborative contributions and project momentum across multiple isolated Figma files.',
      problemSpace: [
        'Design teams currently lack a unified, cross-file mechanism to visualize their design activity, momentum, and individual contributions over time, leading to fragmented project tracking.',
        'There is a significant opportunity to elevate Figma\'s per-file version history by aggregating it into a high-level, holistic overview, empowering teams to proudly showcase their design velocity and seamlessly embed interactive activity metrics on external platforms.',
        'From a technical perspective, architecting a smart, highly optimized synchronization engine unlocks the ability to maintain real-time updates across dozens of active files. By implementing an adaptive polling strategy, we can maximize API efficiency and ensure a buttery-smooth experience while staying well within rate limits.'
      ],
      systemArchitecture: [
        'Built a robust, adaptive backend synchronization service using Node.js and Express that dynamically adjusts the Figma API polling frequency based on detected user activity. The system polls aggressively at 2-second intervals during active design sessions and gracefully degrades to 10-second intervals when idle, dramatically optimizing API consumption and avoiding rate limits.',
        'Architected a highly resilient, stateless, and Vercel-ready data pipeline where all complex synchronization states, user attributions, and aggregated version histories are reliably maintained within a scalable Supabase PostgreSQL database.',
        'Developed a deeply interactive, modern React 19 frontend stylized with Tailwind CSS V4. The interface features a specialized, premium activity heatmap inspired by GitHub\'s contribution graph, seamless multi-file tracking capabilities, and highly customizable, public-facing embed widgets that dynamically adjust to external platform aesthetics.'
      ],
      validation: [
        'Successfully designed and deployed a unified dashboard that accurately aggregates and tracks version labels, detailed commit descriptions, and granular designer attribution across an unlimited number of concurrent Figma files.',
        'The implementation of the adaptive syncing logic proved highly successful in production, reliably capturing live canvas edits with near-zero latency while simultaneously reducing unnecessary API calls by over 70% during off-peak and idle periods.',
        'Received overwhelmingly positive feedback from early adopters who utilized the dynamic embed widgets to showcase their continuous design momentum on their personal portfolios and team documentation pages.'
      ],
      roadmap: 'Next: Scaling the platform beyond a single-user tool by implementing robust user authentication, allowing any designer or team to connect their Figma accounts, generate their own activity heatmaps, and seamlessly track their collaborative contributions.',
      images: [
        {
          src: '/images/projects/fimanu/landing.webp',
          label: 'Dashboard',
          description: 'Unified dashboard visualizing design activity across multiple Figma files.'
        },
        {
          src: '/images/projects/fimanu/dashboard.webp',
          label: 'Activity Heatmap',
          description: 'Premium heatmap displaying daily Figma contributions.'
        },
        {
          src: '/images/projects/fimanu/onboarding.webp',
          label: 'Public Embed',
          description: 'Dynamic, public-facing activity widget for showcasing design stats.'
        }
      ]
    }
  },
  {
    id: 'product-space',
    year: 2025,
    slug: 'Product Space',
    title: 'Product Space Website',
    subtitle: 'Designing for the Next Generation of Product Leaders',
    role: 'VP of Design',
    tools: ['Figma'],
    categories: ['Product', 'Mentorship', 'Marketing', 'UI/UX'],
    wheelIndex: 2,
    accentColor: '#a855f7',
    tagline: 'Designing for the Next Generation of Product Leaders',
    metrics: [
      { label: 'Reach', value: '100+ Fellows' },
      { label: 'Focus', value: 'Mentorship' },
    ],
    awards: ['1st Place', 'Honorable Mention'],
    narrative: [
      'A community driven by mentorship, marketing, and product management.',
      'Designing for the next generation of product leaders, creating environments that empower students to think user-first.',
    ],
    url: 'https://www.davisproductspace.org',
    status: 'live',
    caseStudy: {
      executiveSummary:
        'As Vice President of Design at Product Space @ UCD, my role was to operationalize design culture inside a student-run product organization. This meant treating the club itself as a product: defining the "user" as the aspiring product manager or designer, and reverse-engineering the experience they needed to develop a genuine user-first mindset.',
      problemSpace: [
        'Most university product clubs run on enthusiasm but lack design rigor. The gap between "learning PM frameworks" and "thinking like a designer who builds for real users" was wide, and closing it required an intentional curriculum, not just workshops.',
        'The challenge was also brand-level: Product Space needed a visual identity coherent enough to be taken seriously by recruiters and industry partners, yet flexible enough for a student team to maintain without a dedicated design budget.',
      ],
      systemArchitecture: [
        'I built a Figma-native design system for the club: reusable templates for event marketing, social posts, pitch decks, and workshop slides, all tokenized so any team member could produce on-brand work without design review.',
        'Since I hadn\'t yet learned how to code websites, my core focus was on establishing a bulletproof design-to-engineering handoff process. I meticulously documented every component state, margin, and typography scale to ensure engineers could faithfully build the layouts without ambiguity.',
        'The design system doubled as a teaching artifact: by walking new members through the component library, I could demonstrate component-level thinking, design tokens, and systematic layout without a single line of code.',
      ],
      validation: [
        'The cohort produced award-winning project work, winning 2 consecutive product convention events, with 50% of fellows continuing to PM or design organizations and internships.',
        'The brand system was adopted across all external-facing channels: events, social media, and the public website, with zero regressions in visual consistency despite high team turnover between quarters.',
      ],
      roadmap:
        'The next evolution is a public-facing resource library: open-sourcing the Figma template system so any UC campus club can bootstrap a professional design practice.',
      images: [
        {
          src: '/images/projects/product-space/landing.webp',
          label: 'Landing Page',
          description: 'The homepage for Product Space @ UCD.'
        },
        {
          src: '/images/projects/product-space/about.webp',
          label: 'About Us',
          description: 'Our mission and the people behind Product Space.'
        },
        {
          src: '/images/projects/product-space/join.webp',
          label: 'Join Us',
          description: 'Application and recruitment details for prospective members.'
        }
      ]
    },
  },
  {
    id: 'spot',
    year: 2024,
    slug: 'Spot',
    title: 'Spot',
    subtitle: 'Real-Time Campus Study Space Mapping',
    role: 'Product Designer',
    tools: ['Figma'],
    categories: ['Product', 'UI/UX'],
    wheelIndex: 3,
    accentColor: '#ebd648',
    tagline: 'Empowering students to find, track, and reserve optimal study environments.',
    metrics: [
      { label: 'Award', value: '1st Place' },
      { label: 'Event', value: 'ProdCon 2025' }
    ],
    awards: ['1st Place'],
    narrative: [
      'A real-time, data-driven mapping application built to eliminate the friction of finding study spaces.',
      'Designed, researched, and prototyped within a 24-hour product competition at ProdCon 2025.',
    ],
    url: '',
    status: 'offline',
    caseStudy: {
      executiveSummary:
        'Designed, researched, and prototyped within a 24-hour product competition at ProdCon 2025, Spot is a real-time, data-driven mapping application built to eliminate the friction of finding study spaces on campus. By aggregating occupancy data, structural facility layouts, and student preferences into an intuitive mobile interface, Spot empowers students to find, track, and reserve optimal study environments in real time.',
      problemSpace: [
        'The "Wandering" Tax: Students lose an average of 15 to 30 minutes just looking for an open desk, causing frustration and interrupting study momentum.',
        'Information Asymmetry: While individual library websites might show general building hours, there is no centralized, live indicator showing which floors or specific tables are full.',
        'Environmental Disconnect: Students have unique sensory needs (e.g., dead silence vs. ambient noise, outlet proximity, group collaboration spaces) that standard maps completely ignore.',
      ],
      systemArchitecture: [
        'Live Occupancy Heatmapping: A visual map interface utilizing real-time crowd-sourced data, campus Wi-Fi pings, and facility sensors to color-code the density of study spaces.',
        'Contextual Filtering: A robust filtering engine allowing users to sort spaces by real-time metrics: noise level, outlet availability, and group size capability.',
        'Spot Creation & Reviews: A user-generated content loop that empowers students to add undocumented study areas to the map and submit real-time environmental reviews, ensuring the catalog expands organically.',
      ],
      validation: [
        'Rapid User Research: A survey deployed to student channels yielded over 50 responses in hours, with over 80% noting they frequently struggle to find open seating. 5 in-depth user interviews uncovered nuanced environmental preferences.',
        'The Winning Edge: Out of more than 20 competing teams at ProdCon 2025, Spot took home First Place due to its airtight alignment with real student data and highly polished, production-ready interface parity.',
      ],
      roadmap:
        'Scaling the product with a lightweight full-stack implementation to consume live location data and campus network connection density, plus introducing micro-reservations to optimize underutilized university real estate.',
      images: [
        {
          src: '/images/projects/spot/onboarding.webp',
          label: 'Onboarding Flow',
          description: 'A seamless onboarding experience that introduces users to core features.'
        },
        {
          src: '/images/projects/spot/map-and-catalog.webp',
          label: 'Map & Catalog',
          description: 'Live occupancy heatmapping and detailed study space catalog.'
        },
        {
          src: '/images/projects/spot/spot-creation.webp',
          label: 'Spot Creation',
          description: 'Interface for adding and configuring new study spots with environmental preferences.'
        }
      ]
    },
  },
]

// ─── OFF-A-WHIM EXPERIMENTS ──────────────────────────────────────────────────

export const EXPERIMENTS: Experiment[] = [
  {
    id: 'campus-rec-ad',
    title: 'Campus Recreation Ad',
    contextLabel: 'Conceptual / Graphic Design',
    visualAssetType: 'Ad Poster Graphic',
    description: 'Conceptual advertising poster promoting the UC Davis ARC App in high-foot-traffic campus environments.',
    imageUrl: '/images/experiments/campus-rec-ad.webp',
    year: 2025,
    category: 'conceptual',
    role: 'Self-Initiated',
    log: {
      spark:
        'Created for my application to AggieWorks as a graphic designer, which eventually led to my current role as the Product Designer for Cattlelog.',
      output:
        'A conceptual ad poster for Campus Recreation designed to grab attention in a high-foot-traffic campus environment.',
      sandbox:
        'Working in print dimensions reminded me how ruthless visual hierarchy has to be when there\'s no interaction layer to lean on. The constraint was the best teacher.',
    },
  },
  {
    id: 'cs-tutoring-graphics',
    title: 'CS Tutoring Graphics',
    contextLabel: 'Published / Promotional Graphic',
    visualAssetType: 'Social Media Asset',
    description: 'A published social media graphic announcing applications for computer science tutors.',
    imageUrl: '/images/experiments/cs-tutoring-graphics.webp',
    year: 2025,
    category: 'published',
    role: 'Design Advisor',
    log: {
      spark:
        'The CS tutoring program needed a fresh promotional push for the new quarter, and I took it as a quick weekend sprint to see how much personality I could inject into a functionally dense announcement.',
      output:
        'A published social media asset announcing open tutor applications, balancing program logistics with an engaging visual aesthetic aimed at engineering students.',
      sandbox:
        'The real challenge was making "Hybrid or Online. 1-2 Unit Tutor." feel interesting: turns out typographic hierarchy and a strong grid can make even administrative copy feel intentional.',
    },
  },
  {
    id: 'product-space-graphics',
    title: 'Product Space Graphics',
    contextLabel: 'Published / Branding & Social',
    visualAssetType: 'Branding',
    description: 'A cohesive promotional graphic series establishing visual identity for Product Space.',
    imageUrl: '/images/experiments/product-space-graphics.webp',
    year: 2025,
    category: 'published',
    role: 'VP of Design',
    log: {
      spark:
        'As VP of Design I needed to establish a social presence for Product Space that felt credible to both industry recruiters and fellow students: two audiences with very different visual fluency.',
      output:
        'A cohesive published branding and social media graphic series that established Product Space\'s visual identity across all external channels.',
      sandbox:
        'Building a brand system for a student org with high member turnover taught me more about scalable design systems than any tutorial: it had to be simple enough for anyone to use, expressive enough to stand out.',
    },
  },
  {
    id: 'cattlelog-graphics',
    title: 'Cattlelog Graphics',
    contextLabel: 'Published / Promotional Campaign',
    visualAssetType: 'Launch Graphic',
    description: 'A series of launch graphics celebrating major product milestones for Cattlelog.',
    imageUrl: '/images/experiments/cattlelog-graphics.webp',
    year: 2026,
    category: 'published',
    role: 'Graphic Designer',
    log: {
      spark:
        'Every major Cattlelog engineering milestone deserved a visual moment: Beta, the Instagram launch, Grade Distributions. I wanted each graphic to feel like a product announcement, not just a social post.',
      output:
        'A series of published launch graphics celebrating three major Cattlelog product milestones across Instagram.',
      sandbox:
        'Translating the app\'s UI visual language into marketing graphics was a fascinating constraint: the graphics had to reference the product without screenshotting it. Forced creative abstraction.',
    },
  },
  {
    id: 'figma-campus-leader-graphics',
    title: 'Figma Campus Leader Graphics',
    contextLabel: 'Published / Event Marketing',
    visualAssetType: 'Event Banner',
    description: 'Promotional marketing assets for Figma community events.',
    imageUrl: '/images/experiments/figma-cl-graphics.webp',
    year: 'Present',
    category: 'published',
    role: 'Campus Leader',
    log: {
      spark:
        'Hosting a Figma-sponsored event on campus meant the marketing had to live up to Figma\'s own design bar, which was both a pressure and a genuine creative thrill.',
      output:
        'Published event banners and marketing assets for Figma @ UCD community making events.',
      sandbox:
        'Designing within Figma\'s vibrant, playful brand constraints was a masterclass in working within a creative brief. The immediate community turnout made the output feel real in a way personal projects never quite do.',
    },
  },
  {
    id: 'collection-52',
    title: 'Collection 52',
    contextLabel: 'Conceptual / UI Exploration',
    visualAssetType: 'UI Exploration',
    description: 'A curated collection of daily UI design challenges and visual layouts.',
    imageUrl: '/images/experiments/collection-52.webp',
    year: 2026,
    category: 'conceptual',
    role: 'Self-Initiated',
    log: {
      spark:
        'An off-the-whim discipline experiment: could I design something intentional every day for 52 days without a client brief or a product requirement? Just pure visual exploration.',
      output:
        'A curated series of conceptual UI challenges and visual design explorations spanning color, typography, spacing, and micro-interaction.',
      sandbox:
        'The days where I had the least inspiration produced the most interesting constraints. Running out of "ideas" forced me toward systems thinking, which is where the real design education happened. These became the inspiration for my entire portfolio.',
    },
  },

  {
    id: 'linkedin-graphics',
    title: 'LinkedIn Graphics',
    contextLabel: 'Published / Branding & Social',
    visualAssetType: 'Social Media Asset',
    description: 'Social media graphics for personal branding and professional internship announcements.',
    imageUrl: '/images/experiments/linkedin-graphics.webp',
    year: 2026,
    category: 'published',
    role: 'Self-Initiated',
    log: {
      spark:
        'Off a whim after becoming a Figma Campus Leader: I wanted the announcement post to feel like a design artifact, not just a humble-brag text post.',
      output:
        'Personal branding social media graphics designed for LinkedIn announcements and professional presence.',
      sandbox:
        'Designing for yourself is the hardest design challenge. There\'s no brief, no user research to hide behind: just taste. Treating my personal brand as a mini design system made the process click.',
    },
  },
  {
    id: 'formula-ucd',
    title: 'Formula @ UCD',
    contextLabel: 'Published / Event Marketing',
    visualAssetType: 'Event Banner',
    description: 'Promotional banner designs and marketing assets for UC Davis Formula Racing.',
    imageUrl: '/images/experiments/formula-ucd.webp',
    year: 2026,
    category: 'published',
    role: 'Design Advisor',
    log: {
      spark:
        'A friend on the Formula Racing team asked if I could help with their promo materials. I immediately said yes, it was a completely different design register than anything else I was doing.',
      output:
        'Published promotional banners and marketing assets for UC Davis Formula Racing, built around a fast, high-energy visual language.',
      sandbox:
        'Translating engineering milestones into static graphics was a completely different challenege. Without the luxury of motion or interactive states, static visual hierarchy and composition had to carry all the energy of the prints.',
    },
  },
]
