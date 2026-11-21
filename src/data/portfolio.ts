// ─────────────────────────────────────────────────────────────────────────────
// PORTFOLIO DATA - Phase 2 enriched content (caseStudy + log fields populated)
// ─────────────────────────────────────────────────────────────────────────────

import type { Project, Experiment, BioProfile, SocialLink } from '../types/portfolio'

// ─── BIO ─────────────────────────────────────────────────────────────────────

export const BIO: BioProfile = {
  name: 'JJZ',
  fullName: 'Jason Jiayu Zhang',
  title: 'Product Designer',
  roles: ['DESIGN ENGINEER', 'PRODUCT DESIGNER'],
  email: 'jason.jiayu.zhang@gmail.com',
  resumeUrl:
    '/Resume.pdf',
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

// ─── FEATURED PROJECTS ────────────────────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    id: 'cattlelog',
    year: 'Present',
    slug: 'Cattlelog',
    title: 'Cattlelog',
    subtitle: 'A course and professor catalog for UC Davis',
    role: 'Product Designer & Frontend Engineer',
    tools: ['Figma', 'React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Supabase', 'PostHog'],
    categories: ['Product', 'Full-Stack Engineering', 'UI/UX'],
    accentColor: '#9cd5f8',
    badge: '15,000+ QAU',
    timeline: 'Mar 2025 – Present',
    team: '2 PMs, 1 designer (me), 5 SWEs, 1 PMM at AggieWorks',
    tagline: 'A course and professor catalog for UC Davis',
    metrics: [
      { label: 'Quarterly Active Users', value: '15,000+' },
      { label: 'Cumulative Users', value: '65,000+' },
    ],
    narrative: [
      'Cattlelog is a course and professor catalog for UC Davis that combines professor reviews, grade distributions and official course data.',
    ],
    url: 'https://daviscattlelog.com',
    status: 'live',
    caseStudy: {
      executiveSummary:
        'Cattlelog reaches over 15,000 users a quarter (65,000+ cumulative) at UC Davis, and the first five weeks of Fall 2026 drew 109% more users than the same period in Fall 2025.',
      lede: 'Cattlelog reaches over 15,000 users a quarter (65,000+ cumulative) at UC Davis, and the first five weeks of Fall 2026 drew 109% more users than the same period in Fall 2025.',
      facts: [
        [
          'What it is',
          'A course and professor catalog combining professor reviews, grade distributions and official course data into a single source of truth.',
        ],
        [
          'Built at AggieWorks',
          'A UC Davis student organization building products by students, for students, to improve the campus experience.',
        ],
      ],
      problemSpace: [
        'Planning a quarter at UC Davis meant switching between six different web pages to learn about courses, and most students chose by word of mouth.',
        "Rate My Professors is sorted by professor, so it can't help you discover a course. It also has no grade distributions, no course-specific information and no professor summaries. Those gaps are what Cattlelog is built on, and they are the reason a student would switch. Course, grade and professor data comes from official UC Davis sources.",
      ],
      sections: [
        {
          id: 'owned',
          title: 'What I owned',
          nav: 'Owned',
          paragraphs: [
            'I joined in March 2025. A test version existed before I did, but I have since redesigned all of it, so the design is mine end to end. I own the UI, the design system and the frontend build of features once the SWEs finish the backend. I also built the blog from scratch.',
            'I read and write the React frontend directly, and use AI tools to speed up Figma-to-code translation and navigate nested codebases.',
          ],
        },
        {
          id: 'process',
          title: 'How I decide',
          paragraphs: [
            'Behavior over opinion. I ran about 50 interviews. They are good at telling you what people dislike, so I use them to find pain points. Analytics and session replays tell me what people actually do, and when the two disagree I trust behavior.',
            'Every feature ships behind a feature flag with event tracking in place before launch.',
          ],
        },
        {
          id: 'decisions',
          title: 'Decisions',
          blocks: [
            {
              heading: 'Put grade distributions inside the course and professor pages',
              paragraphs: [
                'Grade data lived in two places, each with a different UX. My read was that students wanted grades while looking at a course or a professor, not on a separate page, so I moved grade distributions directly into the course and professor pages.',
                'The cost was density. Those pages now carried far more information, so I reworked the hierarchy and used line charts and histograms to separate the kinds of numbers. Grade distributions have been viewed about 217,000 times since launch.',
              ],
            },
            {
              heading: 'Fix a landing page people left',
              paragraphs: [
                "Analytics showed the landing page's buttons had almost no use compared to search, and many visitors left within the first few pages. I redesigned the landing page to put search first and surface new features up front.",
              ],
            },
            {
              heading: 'Reshape a feature that grew traffic but missed the goal',
              paragraphs: [
                "Cooked Course Comparison was a social feature where students shared their quarter schedule and got a difficulty rating based on professor reviews and unit count. It brought in traffic, but it didn't fit what Cattlelog is for. I refactored it into the Comparison Tool, which lets students compare courses and professors side by side on ratings, grade distributions and requirements without comparing against other people. It has been used 8,105 times by 2,780 users.",
              ],
              image: {
                src: '/images/projects/cattlelog/comparison.webp',
                label: 'Comparison Tool',
                description: 'Side-by-side course comparison across prerequisites, GE tags, professor ratings and grade distributions.',
              },
            },
          ],
        },
        {
          id: 'design-system',
          title: 'The design system',
          nav: 'System',
          paragraphs: [
            'The look mixes minimalism and maximalism: blank space directs attention to the key features, while a more complex logo and landing page keep the feel of a product made by students, for students.',
            'Reusable components, and knowing why past decisions were made, are why new features take me far less time to ship now.',
          ],
        },
      ],
      validation: [
        {
          figure: '15,000+',
          body: 'Over 15,000 quarterly active users (65,000+ cumulative), averaged over Fall 2025 – Fall 2026 and peaking in Spring 2026.',
        },
        { figure: '109%', body: '109% growth Fall over Fall, comparing the first five weeks of instruction: 4,010 to 8,370 users.' },
        {
          figure: '38.5%',
          body: '38.5% of users in the last 90 days returned for more than one session, and 2,115 users were active in three or more quarters.',
        },
      ],
      resultsNote:
        'Users are anonymous browser IDs, so one person on two devices counts twice. The returning rate is likely conservative for the same reason. PostHog data as of Oct 26, 2026.',
      lessons: {
        intro:
          'I started on Cattlelog as a newer designer, and most of what I know about hierarchy, scope and measurement I learned by getting it wrong in front of real users.',
        items: [
          {
            title: 'Feature creep',
            body: "Cooked Course Comparison grew traffic and blurred the product's focus.",
            rule: 'A feature has to serve the core goal before it ships, however much traffic it brings.',
          },
          {
            title: 'Tracking gaps',
            body: "Review submissions can't be measured after Jan 2026, so I can't say how many reviews have come in since.",
            rule: "A feature's flag and its events ship together, and I check the events still fire after refactors.",
          },
          {
            title: 'Information overload',
            body: 'Course registration data is dense, and showing too much at once made core pages harder to navigate. Watching session replays, checking analytics, talking to students and studying competitor products showed what people actually scan for first.',
            rule: 'Choose deliberately what shows immediately, what drops into secondary typography and what stays hidden until asked for.',
          },
        ],
        outro:
          'I get faster because of the design system, reusable components, AI tools and a memory of why past decisions were made.',
      },
      figmaActivityEmbedUrl: 'https://figma-tracker.onrender.com/embed-widget?slug=jason&files=OmcL296OeqZ4xsHzNcap65&style=fimanu',
      liveActivityNote:
        'My Figma activity, from a live Fimanu embed, the tool in my Fimanu case study.',
      images: [
        {
          src: '/images/projects/cattlelog/landing.webp',
          label: 'Landing page',
          description: 'Search first, with new features up front.',
        },
        {
          src: '/images/projects/cattlelog/comparison.webp',
          label: 'Comparison Tool',
          description: 'Side-by-side course comparison across ratings, grades and requirements.',
        },
        {
          src: '/images/projects/cattlelog/about.webp',
          label: 'Team page',
          description: 'The people behind the product.',
        },
        {
          src: '/images/projects/cattlelog/cattleblog.webp',
          label: 'Cattleblog',
          description: 'The blog I built from scratch.',
        },
      ],
    },
  },
  {
    id: 'fimanu',
    year: 'Present',
    slug: 'Fimanu',
    title: 'Fimanu',
    subtitle: 'Figma version history as a GitHub-style activity heatmap',
    role: 'Solo Designer & Builder',
    tools: [
      'React 19',
      'Vite',
      'Tailwind CSS v4',
      'Node.js',
      'Express',
      'Supabase Postgres',
      'Figma OAuth + REST API',
      'Render',
      'cron-job.org',
    ],
    categories: ['Product', 'Full-Stack Engineering', 'Tooling'],
    accentColor: '#feb34f',
    badge: 'FULL-STACK',
    timeline: 'Jan 2026 – Present',
    team: 'Solo',
    tagline: 'Figma version history as a GitHub-style activity heatmap and embeddable widgets.',
    metrics: [
      { label: 'Role', value: 'Solo designer and builder' },
      { label: 'Built with', value: 'AI coding tools' },
    ],
    narrative: [
      'Fimanu turns Figma version history into a GitHub-style activity heatmap and embeddable widgets that show how consistently you design.',
    ],
    url: 'https://fimanu.com',
    status: 'live',
    caseStudy: {
      executiveSummary:
        'Fimanu turns Figma version history into a GitHub-style activity heatmap and embeddable widgets that show how consistently you design.',
      lede: 'Fimanu turns Figma version history into a GitHub-style activity heatmap and embeddable widgets that show how consistently you design. I owned the product direction, UI and system architecture, directing AI coding tools to build the full-stack implementation.',
      facts: [
        ['Role', 'Solo designer and builder: product, UI and AI-directed full-stack'],
        [
          'Stack',
          'React 19, Vite and Tailwind v4 frontend; Node and Express backend; Supabase Postgres; Figma OAuth and REST API; hosted on Render with an external cron',
        ],
      ],
      sections: [
        {
          id: 'why',
          title: 'Why I built it',
          nav: 'Why I built',
          paragraphs: [
            'I love design and spend a lot of time experimenting in Figma, and I wanted a way to show that I put in the hours I say I do. I built it in four stages:',
          ],
          list: {
            ordered: true,
            items: [
              'Feasibility: I asked an AI whether this was possible and ran a rough test.',
              'My own flow: It worked, so I designed the user flow I wanted for myself.',
              'Other people: I asked peers in informal interviews what to add and what to cut, and designed around that.',
              "Polish: After a break for Cattlelog and travel, I came back and removed the leftovers of the phase I'd designed in.",
            ],
          },
          after: ['The activity heatmap on my Cattlelog case study is a live Fimanu embed.'],
        },
        {
          id: 'signal',
          title: 'What the signal means',
          nav: 'The signal',
          paragraphs: [
            "Version history is the best activity data Figma's API gives me, so I treat it as a proof-of-practice signal, like GitHub's contribution graph. It shows whether you showed up, not how much you produced.",
            "It has limits I state openly: it counts saved versions, not hours; design time spent with AI tools isn't captured; and working across more files can inflate it, although switching between projects takes real effort.",
          ],
        },
        {
          id: 'product',
          title: 'Product decisions',
          nav: 'Product',
          blocks: [
            {
              heading: 'An embed editor, not an analytics dashboard',
              paragraphs: [
                "I rejected a fuller dashboard with analysis for three reasons. It would bloat the product and make it hard to position. The data Figma's API gives me probably wasn't enough for good analysis. And in my interviews and surveys, nobody cared about insights beyond the embeds, which are also the easiest thing to add to a case study.",
                'Today the app has some insights, but it is mainly an embed editor.',
              ],
            },
            {
              heading: 'Rebuild the UI around reading order',
              paragraphs: [
                "My first designs leaned on trends like glassmorphism, and the dashboard was a set of floating cards that didn't suit the user flows. I rebuilt it as a clearer dashboard, still scoped to the embed editor, so people know where to look first, second and last.",
              ],
              image: {
                src: '/images/projects/fimanu/studio.webp',
                label: 'Redesigned Studio embed editor',
                description: 'Controls grouped in reading order on the left (data, style, layout) with the live embed preview and Get code action on the right.',
              },
            },
          ],
        },
        {
          id: 'technical',
          title: 'Technical decisions',
          nav: 'Technical',
          blocks: [
            {
              heading: "A sync that doesn't miss recent history",
              paragraphs: [
                'In development, rate limits kept restarting the sync from the beginning and I missed data. Now each check goes newest-first and stops at the first version it already has, so recent activity is never lost, even when a burst of edits spans more than one page.',
                'Older history backfills in resumable pages with a saved cursor, so a rate limit no longer restarts it.',
              ],
            },
            {
              heading: 'Request pacing',
              paragraphs: [
                "I pace requests to run close to Figma's rate limit, because connecting a file can mean loading a very large number of versions in pages of up to 30.",
              ],
            },
            {
              heading: 'Hosting is a design constraint',
              paragraphs: [
                "The sync is a long-running, stateful process. Vercel's serverless model and cron limits held it to a daily sync. Railway ran it as a real server, but the free plan's usage, uptime and feature limits got in the way.",
                "Render's free tier plus cron-job.org gave me a server that stays up, with a keep-warm ping so it doesn't sleep, at no cost.",
              ],
            },
            {
              heading: 'Ask Figma for as little access as possible',
              paragraphs: [
                'The production sync reads file metadata and version history rather than requesting access to file contents.',
              ],
            },
          ],
        },
        {
          id: 'ai',
          title: 'How I work with AI',
          nav: 'With AI',
          paragraphs: [
            "I decide what the product is and what it isn't, art-direct the UI, and verify the behavior against real data. I cut the analytics dashboard, rejected the trend-driven styling, and caught the sync bug by watching activity go missing—while directing AI coding tools to write the implementation.",
          ],
        },
      ],
      validation: [
        { figure: '450', body: 'About 450 landing-page views and 20 users (tracked via PostHog and Supabase).' },
        'I use it every day, and it powers the live activity heatmap on my Cattlelog case study.',
      ],
      resultsNote: 'Built as a personal proof-of-practice tool and a sandbox I revisit whenever my design craft takes a step forward.',
      lessons: {
        items: [
          {
            title: 'Designing from trends',
            body: "My early designs followed what AI tools default to, and the result didn't fit the flows.",
            rule: 'Decide the reading order first and the style last.',
          },
          {
            title: 'Scope',
            body: 'A bigger dashboard would have been easy to generate and hard to defend.',
            rule: 'A feature earns its place by what people actually asked for.',
          },
        ],
      },
      roadmap:
        'Exploring additional API sources so the embed editor could eventually turn other activity streams into clean, embeddable widgets.',
      figmaActivityEmbedUrl: 'https://figma-tracker.onrender.com/embed-widget?slug=jason&files=OmcL296OeqZ4xsHzNcap65&style=fimanu',
      images: [
        {
          src: '/images/projects/fimanu/landing.webp',
          label: 'Landing page',
          description: 'The first thing a visitor sees at fimanu.com.',
        },
        {
          src: '/images/projects/fimanu/studio.webp',
          label: 'Studio embed editor',
          description: 'Rebuilt around reading order: data, style and layout controls on the left, live preview on the right.',
        },
        {
          src: '/images/projects/fimanu/dashboard.webp',
          label: 'Early dashboard',
          description: 'The floating-card version, before the rebuild around reading order.',
        },
        {
          src: '/images/projects/fimanu/onboarding.webp',
          label: 'Connect screen',
          description: 'Connect a Figma account to start tracking files.',
        },
      ],
    },
  },
  {
    id: 'product-space',
    year: 2025,
    slug: 'Product Space',
    title: 'Product Space @ UC Davis',
    subtitle: 'Website, brand identity and design system for UC Davis’s product community',
    role: 'VP of Design',
    tools: ['Figma'],
    categories: ['Product', 'Mentorship', 'Marketing', 'UI/UX'],
    accentColor: '#a855f7',
    badge: '100+ FELLOWS',
    timeline: 'Oct 2025 – Jan 2026',
    team: 'Sole designer on the executive board; partnered with club engineers on the website',
    tagline: 'Website, brand identity and design system for UC Davis’s product community.',
    metrics: [
      { label: 'Reach', value: '100+ Fellows' },
      { label: 'Focus', value: 'Website & Brand System' },
    ],
    awards: ['1st Place', 'Honorable Mention'],
    narrative: [
      'As VP of Design and the only designer on the board, I designed the public website, brand identity and tokenized Figma template system for Product Space @ UC Davis.',
    ],
    url: 'https://www.davisproductspace.org',
    status: 'live',
    caseStudy: {
      executiveSummary:
        'As VP of Design and the only designer on the board at Product Space @ UC Davis, I owned the public website, brand identity, marketing materials and Figma design system for a 100+ fellow community.',
      lede: 'As VP of Design and the only designer on the board at Product Space @ UC Davis, I owned the public website, brand identity, marketing materials and Figma design system for a 100+ fellow community.',
      facts: [
        ['What it is', 'A student-run product management and design fellowship at UC Davis.'],
        ['Scope', 'Public website, brand identity, event marketing and reusable Figma templates.'],
      ],
      problemSpace: [
        'Most students who visit a university product club website do not intuitively know what product management is—so explaining what Product Space does without first grounding the discipline loses them.',
        'At the same time, as the sole designer on the board, I had to give the club a coherent identity across flyers, social posts, pitch decks and the website without becoming a bottleneck for every graphic.',
      ],
      sections: [
        {
          id: 'decisions',
          title: 'Decisions',
          blocks: [
            {
              heading: 'Anchor the hero in campus marketing, then teach PM in sequence',
              paragraphs: [
                'Most visitors arrive from flyers or social posts, so I matched the first screen directly to the marketing materials I had already designed—reassuring them right away that they were in the right place.',
                'From there, the page explains what product management is in a short paragraph that interacts as you scroll, before tying the Product Space fellowship timeline directly into the PM concepts fellows actually cover.',
              ],
            },
            {
              heading: 'Lead with community, back it up with real capstone work',
              paragraphs: [
                'We had to decide whether to brand Product Space like a buttoned-up professional org or a student community. I leaned into community—using event photos, group shots and retreat pictures to show the people inside the club, reflecting that PM is about the people building the product, not just the product itself.',
                'To balance that warmth with credibility, I paired the community photography with past capstone projects so prospective fellows and partners could see real work getting shipped.',
              ],
            },
            {
              heading: 'Build a Figma system any board member could use',
              paragraphs: [
                'Because I was the only designer on the board, one-off designs would not survive quarter-to-quarter turnover. I built a tokenized Figma library of reusable templates for social posts, flyers, decks and workshop slides, alongside detailed component specs and margins so club engineers could build the website without ambiguity.',
              ],
            },
          ],
        },
      ],
      validation: [
        'The brand and template system was adopted across the public website, recruitment campaigns, social channels and event decks with consistent visual quality across quarters.',
        'Fellows won two consecutive product convention events, with 50% continuing into PM or design organizations and internships.',
      ],
      lessons: {
        items: [
          {
            title: 'Assuming visitors know the jargon',
            body: 'Leading with club structure before explaining what product management actually is made the site feel insider-only.',
            rule: 'Meet visitors where they just came from, then earn the next concept step by step.',
          },
          {
            title: 'Being a solo designer bottleneck',
            body: 'Doing every flyer and deck by hand does not scale on a student executive board.',
            rule: 'Invest early in reusable templates and clean handoff specs so the team can ship without waiting on you.',
          },
        ],
      },
      images: [
        {
          src: '/images/projects/product-space/landing.webp',
          label: 'Landing page',
          description: 'Ties back to campus marketing before walking visitors through what PM is.',
        },
        {
          src: '/images/projects/product-space/about.webp',
          label: 'About us',
          description: 'Community-first photography paired with the club’s mission and people.',
        },
        {
          src: '/images/projects/product-space/join.webp',
          label: 'Join us',
          description: 'Fellowship timeline mapped to the product concepts students learn.',
        },
      ],
    },
  },
  {
    id: 'spot',
    year: 2025,
    slug: 'Spot',
    title: 'Spot',
    subtitle: 'Finding a free study spot on campus, pitched in 24 hours',
    role: 'Product Designer',
    tools: ['Figma'],
    categories: ['Product', 'UI/UX'],
    accentColor: '#ebd648',
    badge: '1ST PLACE',
    timeline: 'Feb 2025 (competition), redesign Jan 2026',
    team: '2 PMs, 1 designer (me)',
    tagline: 'Finding a free study spot on campus, pitched in 24 hours.',
    metrics: [
      { label: 'Result', value: '1st of 20+ teams' },
      { label: 'Event', value: 'UC Davis Product Convention' },
    ],
    awards: ['1st Place'],
    narrative: [
      "Spot took first place among more than 20 teams at UC Davis's second annual Product Convention, a 24-hour product pitch competition.",
    ],
    url: '',
    status: 'offline',
    caseStudy: {
      executiveSummary:
        "Spot took first place among more than 20 teams at UC Davis's second annual Product Convention, a 24-hour product pitch competition.",
      lede: "Spot took first place among more than 20 teams at UC Davis's second annual Product Convention, a 24-hour product pitch competition. I led the feature set and product direction, and owned the UX, the design system and the pitch design.",
      facts: [['Prompt', 'Ideate a product that improves the education experience of a student.']],
      problemSpace: [
        'The idea came from the team. We asked friends for small pet peeves about university life and chose the one small enough to solve well in 24 hours: finding a good study spot.',
        'Students walk between locations that may or may not have free seats, and the 5 to 15 minutes a day adds up to hours.',
      ],
      sections: [
        {
          id: 'research',
          title: 'Research',
          paragraphs: ['We collected 50+ survey responses. The team wrote the survey and I helped shape the questions.'],
          list: {
            items: [
              '92% study outside their dorm or home on a regular basis.',
              '87% have left a study spot because it was too crowded or noisy.',
              '97% said they would use an app that finds spots in real time, which is stated intent, not observed behavior.',
            ],
          },
          after: ['The most wanted features were availability tracking (82.6%), amenity filters (76.1%) and a map view (69.6%).'],
        },
        {
          id: 'decisions',
          title: 'Decisions',
          blocks: [
            {
              heading: 'Cut unfeasible tracking to focus on the core pitch',
              paragraphs: [
                'High-precision location ideas like Bluetooth device-to-device sensing, facility sensors and physical hardware weren’t feasible to build or prove in 24 hours, so we cut them from v1 and framed them as a future roadmap.',
                'Instead, we scoped the pitch to geofencing: foot-traffic trends from existing data sources, one-tap check-ins when you arrive at a spot, and ratings and reviews—matching the features survey respondents actually asked for.',
              ],
            },
            {
              heading: 'Solve the cold start by hand',
              paragraphs: [
                'A crowdsourced product has no data on day one. Our answer was to seed the initial catalog manually with locations the team gathered ourselves, then rely on user-submitted spots to grow coverage over time.',
              ],
            },
            {
              heading: 'Take a privacy position',
              paragraphs: [
                "We said Spot stores no history that connects an account to where a person physically was. It works from a list of locations, so the data can't be used to find a specific person. Favorites and reviews are choices users make explicitly.",
                'This was a design principle in the pitch, not a shipped system.',
              ],
            },
            {
              heading: 'Flows that end at a destination',
              paragraphs: [
                'I designed every flow to end at a destination, a study spot, rather than a dead end, so people stay in the core loop of finding and going. I also defined the brand and built reusable Figma components.',
              ],
            },
          ],
        },
        {
          id: 'why-we-won',
          title: 'Why the pitch worked',
          nav: 'The pitch',
          paragraphs: [
            'We picked a specific, everyday problem solvable at the scale of a single product, while other teams stayed high-level and had trouble positioning what they were building.',
          ],
        },
        {
          id: 'redesign',
          title: 'The redesign',
          paragraphs: [
            'Spot was my first product design project, and nearly a year later I redesigned it to drop the 24-hour pitch constraints and focus on UI craft. I refreshed the branding and standardized components across the app so every button, dropdown and control looked and behaved consistently instead of varying from screen to screen.',
            'On the map and search views, I tightened the information hierarchy to pack richer location details and more informative search results into a smaller space while keeping them easy to scan.',
          ],
        },
      ],
      validation: [
        { figure: '1st', body: 'First place among more than 20 teams at the second annual UC Davis Product Convention.' },
        'Spot was never built, so I make no usage or retention claims.',
      ],
      lessons: {
        items: [
          {
            title: 'Waiting for the perfect idea',
            body: 'Facing a blank canvas, I stalled. Once I started whiteboarding low-fidelity designs, the motivation followed.',
            rule: 'Start rough and let the work show me the answer.',
          },
          {
            title: 'Quantity over quality under a deadline',
            body: 'I had more items to produce than time, so I spent four to five hours on the polish of the flows, the brand and the reusable components instead of extra marketing graphics.',
            rule: 'Under time pressure, protect the quality of the core work.',
          },
          {
            title: 'Hierarchy and consistency',
            body: 'Coming back to my first product project a year later showed how much inconsistent controls and loose spacing hurt scannability.',
            rule: 'Lock down component patterns early so users never have to re-learn what a button or dropdown looks like.',
          },
        ],
      },
      images: [
        {
          src: '/images/projects/spot/onboarding.webp',
          label: 'Onboarding',
          description: 'Introduces the core loop: find a spot, then go.',
        },
        {
          src: '/images/projects/spot/map-and-catalog.webp',
          label: 'Map and catalog',
          description: 'Availability on the map, with standardized controls and scannable location details.',
        },
        {
          src: '/images/projects/spot/spot-creation.webp',
          label: 'Spot creation',
          description: 'Adding a new spot and its amenities.',
        },
      ],
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
    description: 'Ad poster promoting the UC Davis ARC App.',
    imageUrl: '/images/experiments/campus-rec-ad.webp',
    thumbUrl: '/images/experiments/campus-rec-ad-thumb.webp',
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
    visualAssetType: 'Recruitment Social Post',
    description: 'Social graphic announcing open CS tutor applications.',
    imageUrl: '/images/experiments/cs-tutoring-graphics.webp',
    thumbUrl: '/images/experiments/cs-tutoring-graphics-thumb.webp',
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
    visualAssetType: 'Brand Identity System',
    description: 'Graphics building Product Space\'s visual identity.',
    imageUrl: '/images/experiments/product-space-graphics.webp',
    thumbUrl: '/images/experiments/product-space-graphics-thumb.webp',
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
    contextLabel: 'Published / Marketing Campaign',
    visualAssetType: 'Launch Graphic Series',
    description: 'Launch graphics for Cattlelog\'s milestones.',
    imageUrl: '/images/experiments/cattlelog-graphics.webp',
    thumbUrl: '/images/experiments/cattlelog-graphics-thumb.webp',
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
    visualAssetType: 'Community Event Banner',
    description: 'Promotional assets for Figma community events.',
    imageUrl: '/images/experiments/figma-cl-graphics.webp',
    thumbUrl: '/images/experiments/figma-cl-graphics-thumb.webp',
    year: '2026',
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
    title: 'Collection 52 // Portfolio Series',
    contextLabel: 'Conceptual / Branding',
    visualAssetType: 'Brand Identity Exploration',
    description: 'A personal brand identity exploration.',
    imageUrl: '/images/experiments/collection-52.webp',
    thumbUrl: '/images/experiments/collection-52-thumb.webp',
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
    id: 'collection-52-font-series',
    title: 'Collection 52 // Font Series',
    contextLabel: 'Conceptual / Typography',
    visualAssetType: 'Typography Exploration',
    description: 'A typography exploration in pairing, scale, and rhythm.',
    imageUrl: '/images/experiments/collection-52-font-series.webp',
    thumbUrl: '/images/experiments/collection-52-font-series-thumb.webp',
    year: 2026,
    category: 'conceptual',
    role: 'Self-Initiated',
    log: {
      spark:
        'Part of the same 52-day discipline experiment, but narrowed entirely to type: could a single day\'s constraint be pairing, scale, or rhythm instead of a whole UI?',
      output:
        'A curated set of typography-first explorations from Collection 52, focused on pairing, scale, and rhythm.',
      sandbox:
        'Typography turned out to be the most unforgiving constraint of the entire series: get the rhythm wrong and nothing else in the composition can save it.',
    },
  },
  {
    id: 'collection-52-config-series',
    title: 'Collection 52 // Config Series',
    contextLabel: 'Conceptual / Album Cover',
    visualAssetType: 'Playlist Cover Art',
    description: 'An album cover for a Spotify playlist made for Figma\'s Config conference.',
    imageUrl: '/images/experiments/collection-52-config-series.webp',
    thumbUrl: '/images/experiments/collection-52-config-series-thumb.webp',
    year: 2026,
    category: 'conceptual',
    role: 'Self-Initiated',
    log: {
      spark:
        'Made a Spotify playlist for Figma\'s Config conference and it needed cover art, so this became one of the 52 days.',
      output:
        'A playlist cover for Config, carrying the same visual language as the rest of Collection 52.',
      sandbox:
        'Album art is a different problem than a UI screen: no hierarchy to guide the eye, just a single square that has to hold attention on its own.',
    },
  },

  {
    id: 'linkedin-graphics',
    title: 'LinkedIn Graphics',
    contextLabel: 'Published / Branding & Social',
    visualAssetType: 'LinkedIn Announcement Post',
    description: 'Personal branding graphics for LinkedIn.',
    imageUrl: '/images/experiments/linkedin-graphics.webp',
    thumbUrl: '/images/experiments/linkedin-graphics-thumb.webp',
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
    visualAssetType: 'Promotional Banner Series',
    description: 'Promotional banners for UC Davis Formula Racing.',
    imageUrl: '/images/experiments/formula-ucd.webp',
    thumbUrl: '/images/experiments/formula-ucd-thumb.webp',
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
