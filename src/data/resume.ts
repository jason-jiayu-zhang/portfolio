// The resume, one page. ResumePage renders it; `npm run resume` prints that
// page to public/Resume.pdf. Edit here, run the script, commit both.

export type ResumeRole = {
  org: string
  role: string
  period: string
  points: string[]
}

export const RESUME = {
  name: 'Jason Jiayu Zhang',
  title: 'Design Engineer',
  contact: [
    { label: 'jason.zhangjiayu.com', href: 'https://jason.zhangjiayu.com' },
    { label: 'linkedin.com/in/jason-jiayu-zhang', href: 'https://www.linkedin.com/in/jason-jiayu-zhang/' },
    { label: 'jason.jiayu.zhang@gmail.com', href: 'mailto:jason.jiayu.zhang@gmail.com' },
    // On the printed page only; the web view leaves the phone number off.
    { label: '+1 (916) 260-6067', href: 'tel:+19162606067', printOnly: true },
  ],
  experience: [
    {
      org: 'Figma',
      role: 'Campus Ambassador',
      period: 'Jul 2025 – Present',
      points: [
        'Founded the first Figma campus chapter at UC Davis and reached 1,000+ students from 20+ majors with workshops on design systems and rapid prototyping.',
        'Mentored 50+ student designers through portfolio critiques and workflow guidance, helping peers land internships at companies including Pinterest and IBM.',
      ],
    },
    {
      org: 'Cattlelog',
      role: 'Product Designer & UI Engineer',
      period: 'Mar 2025 – Present',
      points: [
        'Built the design system behind Cattlelog (40,000+ users) in React, TypeScript, and Tailwind CSS on Headless UI and Radix UI primitives, with components kept in sync with the Figma design tokens.',
        'Built a library of accessible components, including Framer Motion micro-interactions and Recharts grade-distribution charts; with a Vite build pipeline, it cut frontend delivery time by 30%.',
        'Improved performance and search discovery by 25% with TanStack Virtual for long lists and TanStack Query for data fetching, and confirmed the gains in PostHog analytics.',
      ],
    },
    {
      org: 'Fimanu',
      role: 'Full Stack Designer & Developer',
      period: 'Jan 2026 – Present',
      points: [
        'Designed and built a full-stack productivity platform in React, TypeScript, and Tailwind CSS that turns raw user data into interactive heatmaps.',
        'Wrote the Figma integration: OAuth for sign-in, and the Figma REST API to pull design metadata in real time and keep the database in sync.',
        'Ran usability tests on the data-visualization screens (95% task completion across 10+ participants) and shipped every UI revision that came out of them.',
      ],
    },
    {
      org: 'Product Space @ UC Davis',
      role: 'Vice President of Design',
      period: 'Jan 2025 – Dec 2025',
      points: [
        'Led the visual identity and UI/UX for the fellowship\'s website and social channels; the redesign raised application click-through 15% each quarter over the fall-quarter baseline.',
        'Ran the creative pipeline for 2 recruitment cycles, producing 45+ assets for social, web, and presentations under one consistent brand.',
      ],
    },
    {
      org: 'Spot',
      role: 'Product Designer',
      period: 'Feb 2025',
      points: [
        'Designed a real-time campus map that shows which study spots are free, after finding that students lose time hunting for one.',
        'Tested demand with 50+ surveys and 5 interviews, and used the findings to drive 4 rapid iterations of the core user journey.',
        'Delivered user flows, branding, and high-fidelity Figma prototypes in under 24 hours, then pitched it to Best Overall at ProdCon out of 20+ teams.',
      ],
    },
  ] satisfies ResumeRole[],
  education: {
    school: 'University of California, Davis',
    degrees: 'B.A. Design, B.S. Computer Engineering',
    period: 'Sep 2024 – Jun 2028 (expected)',
  },
  awards: [
    { name: 'Best Overall', at: 'ProdCon', year: '2025' },
    { name: 'Best Design', at: 'Product Showcase' },
    { name: 'Honorable Mention', at: 'Davis Design Fest' },
  ],
  skills: [
    {
      group: 'Design / AI Tools',
      items: ['Figma + Figma MCP', 'Antigravity', 'Adobe Creative Cloud', 'Claude Code', 'Google Stitch', 'Sketch'],
    },
    {
      group: 'Programming',
      items: ['TypeScript', 'Git / GitHub', 'HTML / CSS / JS', 'React / React Native', 'Tailwind', 'Vite', 'Python', 'Java', 'C / C++'],
    },
    {
      group: 'Practice',
      items: [
        'A/B testing', 'Agentic workflows', 'AI-integrated design', 'CLI design', 'Copywriting', 'Design engineering',
        'Design systems', 'Design validation', 'Developer workflows', 'Frontend development', 'Information architecture',
        'Journey mapping', 'Product analytics', 'Product strategy', 'Prototyping', 'Responsive design', 'Storyboarding',
        'UI/UX design', 'Usability testing', 'User interviews', 'User personas', 'User research', 'UX writing',
        'Visual design', 'Wireframing',
      ],
    },
  ],
}
