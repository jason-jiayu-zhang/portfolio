---
version: 1
slug: "src-pages-casestudypage-tsx"
primary_target: "src/pages/CaseStudyPage.tsx"
related_targets: ["src/descent/Altimeter.tsx","src/descent/RouteProfile.tsx"]
---

# Case study (`/case-studies/:slug`)

Scope: one project's case study, its own route, separate from the home descent. Mode: Read. Reader: a recruiter or hiring manager who came from a camp's "Read the case study" and wants proof, ownership and judgment fast, then a way to the next project or to contact.

Constraints: content and facts come only from `src/data/portfolio.ts`; Resume and Let's talk stay reachable at every scroll position; WCAG 2.2 AA; reduced motion respected.

## Direction contract

THESIS: A case study is one route down from its camp. The page opens on the sky with the project's name and a drawn elevation profile whose waypoints are the case study's major sections, then descends through the strata to the valley floor. It refuses the generic doc page: sticky header bar, side table of contents, a stack of identical H2 sections.

OWN-WORLD: The home descent unchanged: strata sky, alpine, treeline, lake, camp, valley, each with its drawn edge; cream mats with the soft fall shadow carry screens and callouts; Satoshi 900 caps wordmark for the project name; Satoshi 400 reading in paper on dusk; tabular altitudes; the cream altimeter rail as the page's navigation.

STORY: The reader learns what the product is and its headline result in the first scroll, follows problem, ownership and decisions, reads the evidence as a ruled ledger at the lake, the lessons at base camp, then takes the next ascent or opens contact.

FIRST VIEWPORT: Altimeter rail at left reading the camp altitude, with a back link to Ascents; exit bar top right. Sky band: project wordmark, subtitle in lead weight, Role / When / Team / Built with facts in Night, Visit mat button. Across the sky band's foot, the alpine band's top edge is the route profile: a descending ridge line with linked waypoints (name above in Night, altitude below in paper), solid sand where climbed, dashed mist ahead. Below it the alpine band starts with the results-first lede beside the lead screen on a mat.

FORM: Route profile, position 4 of 7 on my ordered list (dealt lead). seed:de2ca9ffd57b0267. Kept from the declined wayfinding challenger: the rail always names the current section and every next one ahead.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Decisions
- Waypoints on the profile are the major legs only (first story section, sections with decision blocks, Results, What I learned); the rail lists every section.
- The profile does not pin; the altimeter rail is the persistent wayfinding, so two sticky navs never compete.
- Screens repeat no image already shown above.
