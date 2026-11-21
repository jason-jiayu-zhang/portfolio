# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: recruiters and hiring managers evaluating Jason Jiayu Zhang for design-engineer and product-design roles. They skim, compare candidates, and want proof of shipped work quickly. Success is a click on Contact ("Let's talk") or the resume.

## Product Purpose

Personal portfolio of Jason Jiayu Zhang, a design engineer and product designer. It shows shipped product work (Cattlelog, Fimanu), the process behind it through case studies, an experiment log, a studio/about section, and a downloadable resume. It exists to turn a skim into a conversation.

## Positioning

A single person who designs and ships: Figma-to-code parity, design systems and full-stack engineering, with ownership from 0-to-1 ideation through 1-to-100 iteration. Tagline in repo data: "to nurture others to love the art of making."

## Operating Context

Static React SPA deployed on Vercel (jason.zhangjiayu.com). Routes: home (hero, work, studio, about), `/case-studies/:slug`, experiment log, 404. Resume is `/Resume.pdf`.

## Capabilities and Constraints

- Stack in place: React 19, TypeScript, Vite, Tailwind 3, react-router, GSAP, Lenis. Content lives in `src/data/portfolio.ts` and `src/data/about.ts`.
- Navigation: Work, Studio, About, Resume, plus a Contact / "Let's talk" action.
- Socials: LinkedIn, X, email, GitHub (see `BIO` in portfolio.ts).
- Case-study template carries: role, timeline, team, At a Glance (product, goal, impact), problem framing, ideation and iteration collections, process (research, define, design).
- Light copy edits are allowed; preserve voice and meaning.

## Brand Commitments

- Name: Jason Jiayu Zhang; role label "Design Engineer".
- Existing barcode-style "JJZ" logo mark appears in the user's reference designs; recreate it as SVG, since no file exists in the repo.
- Reference designs supplied by the user (two screenshots, 2026-11-18) are binding visual input for the redesign; the visual world itself is decided in new-work, not here.

## Evidence on Hand

User confirmed as accurate: Cattlelog 55,000+ users (case study) / 40,000+ UC Davis students (timeline copy), Fimanu 100 users, 50+ formal user interviews, Posthog finding of under 0.5% of sessions using the "Cooked Comparison" feature with 90% of that use unintentional. Assets: `public/images/projects`, `public/images/mountains`, `public/images/experiments`, headshots (`jason-*.webp`), `public/Resume.pdf`, `public/favicon.svg`. Note the 55,000 vs 40,000 figures describe different things (users vs active students); keep each where it was used.

## Product Principles

1. Proof before polish: shipped work and numbers appear in the first scroll.
2. One clear next step for a recruiter: contact or resume is always reachable.
3. The work is the star; interface and decoration serve it.
4. Show the thinking, not only the result: case studies tell process honestly, in the author's voice.
5. Fast and legible on any device; a recruiter on a phone gets the same story.

## Accessibility & Inclusion

No product-specific standard stated. Default target: WCAG 2.2 AA, including reduced-motion support for any scroll or parallax effects.
