# MYSTIFY OBSERVATORY — MASTER CONTEXT v2
**Status:** Pre-Implementation — Planning Complete  
**Version:** 2.0  
**Last Updated:** August 2026  
**Purpose:** Single architectural checkpoint. If every planning document disappeared, this document alone must allow another architect to continue the project correctly.

> This document does not duplicate the Constitution or Architecture Docs. It references them. Its job is state, not depth.

---

## TABLE OF CONTENTS
1. [Executive Summary](#1-executive-summary)
2. [Current Planning Status](#2-current-planning-status)
3. [Locked Decisions](#3-locked-decisions)
4. [Project Portfolio](#4-project-portfolio)
5. [Engineering Philosophy](#5-engineering-philosophy)
6. [Registry Snapshot](#6-registry-snapshot)
7. [Recruiter Layer](#7-recruiter-layer)
8. [Outstanding Workstreams](#8-outstanding-workstreams)
9. [Implementation Principles](#9-implementation-principles)
10. [First Build Order](#10-first-build-order)
11. [Deferred Decisions](#11-deferred-decisions)
12. [Open Questions](#12-open-questions)

---

## 1. EXECUTIVE SUMMARY

Mystify Observatory is a portfolio operating system — a desktop-like browser environment presenting Aryan Kumar's engineering work through three distinct visitor modes: Recruiter, Explorer, and Engineer. It is not a traditional portfolio. It is not an OS clone. It is an observatory: a controlled environment where visitors explore, discover, and inspect.

**The governing thesis of the entire project:**
> Truth exists before presentation.

**The governing principle discovered across all projects:**
> Category Integrity — different kinds of truth remain separate so each can stay honest in its own domain.

**The planning phase is complete.** The remaining work has changed category — from "what should this system be?" to "how do we implement the system we've already defined?"

**Target reaction from a senior engineer:**
> "This person understands systems — and this environment feels strangely aware."

**Target reaction from a recruiter:**
> "Where was this gem hidden — I can't afford to lose him."

---

## 2. CURRENT PLANNING STATUS

| Area | Status | Confidence |
|---|---|---|
| Project Identity & Philosophy | ✅ FROZEN | 10/10 |
| Design System | ✅ FROZEN | 10/10 |
| Three Mode Philosophies | ✅ FROZEN | 10/10 |
| Shell Systems | ✅ FROZEN | 10/10 |
| Observatory Index | ✅ FROZEN | 10/10 |
| Explorer Mode (full spec) | ✅ FROZEN | 9.5/10 |
| Engineer Mode (full spec) | ✅ FROZEN | 9.8/10 |
| Architecture & Data Layer | ✅ FROZEN | 10/10 |
| Constitutional Glossary | ✅ FROZEN | 10/10 |
| Registry Schema | ✅ FROZEN v1.0 | 10/10 |
| Registry Population | ✅ FROZEN v1.0 | 9.5/10 |
| Recruiter Layer | ✅ FROZEN v1.2 | 9.4/10 |
| Shared App Specs | ⬜ NOT STARTED | — |
| Cross-link Completion | ⬜ NOT STARTED | — |
| Mystify Registry Entry | ⬜ DEFERRED | — |
| Polish (Assistant, Mobile, Boot) | ⬜ NOT STARTED | — |

---

## 3. LOCKED DECISIONS

### 3.1 Architectural Laws
- **Law 01:** If information can be represented more honestly as a relationship, the relationship wins.
- **Law 02:** If authority can be represented more honestly as ownership, ownership wins.
- **Law 03:** Decisions are coordinated, not negotiated. Every decision has exactly one coordinating authority.

### 3.2 Observatory Laws
- **Observatory Law:** Only the Validation Engine may prevent a graph mutation.
- **Cascade Law:** Validation → Activation → Consistency → Derivation. Never reversed. Never parallelized.
- **Cross-Link Law 01:** Traversal legality is mode-independent. Modes determine surfacing, not authority.
- **Cross-Link Law 03:** Traversal grants reachability. It never grants authority.
- **Write Boundary Law:** Traversal grants access to facts. Traversal never grants mutation authority.

### 3.3 Design System
- Dark Observatory Surface
- Rounded corners: 16px
- Transitions: 160–200ms ease-out
- JetBrains Mono — all engineering/terminal surfaces
- Inter — all content surfaces
- No red UI elements — amber pulsing for critical states; red ONLY inside terminal `[ERROR]` output

### 3.4 Mode Accent Colors
| Mode | Color | Hex |
|---|---|---|
| Recruiter | Amber | — |
| Explorer | Violet | — |
| Engineer | Cyan | `#00D4FF` |
| Simulation Active | Amber | `#C9924A` |
| Chaos Controls | Orange-Red | `#E8724A` |

### 3.5 Mode Rules (non-negotiable)
- Recruiter: max 2 windows, fullscreen-first, dock drag disabled
- Explorer: max 4 windows, freeform, dock drag enabled
- Engineer: max 4 windows, custom sizing, dock drag enabled
- Three modes are not separate products. They are layered configurations of one Observatory.
- Interpretation affects visibility, not truth. Reality remains singular.

### 3.6 Engineer Mode Data Rules
- `OBSERVED` (cyan `#00D4FF`) — measured at runtime, always live, never faked
- `MODELED` (white `#EAEAEA`) — architectural truth, never pretending to be measured
- `SIMULATION` (amber `#C9924A`) — always labeled, always stoppable, never running silently
- **Three-Second Rule:** Inspector must always answer "measured or modeled?" within 3 seconds
- **Anti-Theater Rule:** Never fake a metric that could be real

### 3.7 Shared Application Rule
Profile, Projects, Lab, and Certifications share **one implementation** across all three modes.
- Allowed variation: naming, accent color, window chrome, typography emphasis
- Not allowed: different content, different functionality, different data models

### 3.8 The OBSERVED / MODELED Distinction (Engineer Mode)
- State View Condition A: Deployed and running — real signals render LIVE
- State View Condition B: Deployed but dormant — partial state, honest about gap
- State View Condition C: Not deployed — architectural intent only
- **NEVER render Condition C as Condition A.**

---

## 4. PROJECT PORTFOLIO

### 4.1 Taxonomy
| Tier | Projects |
|---|---|
| **Flagship** | Mystify Observatory, CyberShield, HaloTask Pro |
| **Featured** | StockSphere |
| **Evolution** | AquaVeda v0 → v1 → v2 |
| **Active Development** | DevLens |

### 4.2 Project Theses (locked — philosophical spine of the portfolio)
| Project | Thesis |
|---|---|
| Mystify Observatory | Truth exists before presentation. |
| CyberShield | Trust decisions should be explainable. |
| HaloTask Pro | Productivity software should survive interruption. |
| StockSphere | Business software succeeds by modeling ownership correctly. |
| AquaVeda | Information should become coordinated action. |
| DevLens | Architecture should be observable. |

### 4.3 Engineering Identities
| Project | Engineering Identity |
|---|---|
| Mystify Observatory | Ontological Design |
| CyberShield | Evidence Aggregation |
| HaloTask Pro | Resilient Execution |
| StockSphere | Business Boundaries |
| AquaVeda | Coordinated Systems |
| DevLens | Developer Observability |

### 4.4 Project Entry Questions (Projects App — first 10 seconds must answer)
| Project | Entry Question |
|---|---|
| Mystify | Why does this portfolio exist? |
| CyberShield | Why should I trust this conclusion? |
| HaloTask Pro | What happens when the network disappears? |
| StockSphere | How do you prevent one business from seeing another's data? |
| AquaVeda | How does information become coordinated action? |
| DevLens | How do developers understand systems faster? |

### 4.5 Deployment Status
| Project | Frontend | Backend | Database | Notes |
|---|---|---|---|---|
| CyberShield | Vercel — Live | Render — Live | MongoDB Atlas | AI service issue under investigation |
| HaloTask Pro | Vercel — Live | Render + Railway | MongoDB Atlas | Dual backend for resilience |
| StockSphere | Vercel — Live | Render — Live | MySQL | Docker-supported, Java 17 |
| AquaVeda v0 | Live | Live | MongoDB | SIH prototype — preserved |
| AquaVeda v1 | — | — | MongoDB (local) | Complete, undeployed |
| AquaVeda v2 | — | — | TBD | Next.js rebuild, in progress |
| DevLens | — | — | — | VS Code extension, pre-release |
| Mystify Observatory | Vercel (planned) | — | — | Domain TBD (mystify.dev candidate) |

### 4.6 AquaVeda Evolution Chain
```
AquaVeda v0  (SIH Prototype — 36hr hackathon build)
     │
     │ EVOLVES_TO
     ▼
AquaVeda v1  (Architecture — modular MERN, complete, undeployed)
     │
     │ EVOLVES_TO
     ▼
AquaVeda v2  (Production — Next.js rebuild, in active development)
```
Version metadata:
- v0: version=0, predecessor=null, successor=aquaveda-v1
- v1: version=1, predecessor=aquaveda-v0, successor=aquaveda-v2
- v2: version=2, predecessor=aquaveda-v1, successor=null

### 4.7 Resume Strategy (post-Observatory launch)
Featured on resume: Mystify Observatory, CyberShield, HaloTask Pro, StockSphere
Removed from resume: AquaVeda (evolution story cannot fit one page — fully documented in Observatory)
HaloTask Pro replaces AquaVeda in next resume revision.

---

## 5. ENGINEERING PHILOSOPHY

### 5.1 The Cross-Project Pattern (DEFINITIVE)
```yaml
id:           pat-01
name:         Category Integrity
source:       DERIVED
origin:       EMERGENT
strength:     DEFINITIVE
status:       FEATURED

thesis: >
  Different kinds of truth must be kept separate so each
  can remain honest in its own domain.

description: >
  Across every project, the most important architectural decisions
  involved preventing category collapse — stopping evidence from
  becoming conclusion, intent from becoming state, ownership from
  becoming access, observation from becoming verified knowledge,
  analysis from becoming presentation. This is not separation of
  concerns for maintainability. It is separation so that different
  kinds of truth do not become confused with each other.

projects: [mystify, cybershield, halotask, stocksphere, aquaveda, devlens]
```

### 5.2 The Scope Progression (emergent — not designed)
The project theses form a progression of increasing abstraction:
```
CyberShield   → Application level  (trust decisions)
HaloTask      → Product level      (user experience under failure)
StockSphere   → Business level     (ownership and tenancy)
AquaVeda      → Community level    (coordinated civic action)
DevLens       → Engineering level  (developer understanding)
Mystify       → Knowledge level    (truth before presentation)
```
This was not designed top-down. It emerged independently. That makes it evidence, not branding.

### 5.3 The Recurring Lesson Across Projects
- CyberShield taught: remove unnecessary product scope
- HaloTask Pro taught: design for interruption, not ideal conditions
- StockSphere taught: model ownership before features
- AquaVeda taught: separate kinds of information before implementing them
- DevLens teaches: document architectural decisions before building on them

### 5.4 Emerging Pattern (candidate — not yet a registry node)
```
Prototype → Architecture → Production
```
Seen in: AquaVeda (explicit), Mystify (implicit), DevLens (in progress), CyberShield (feature reduction as maturation). Needs Discovery nodes before becoming a Pattern node.

---

## 6. REGISTRY SNAPSHOT

### 6.1 Canonical Schema (v1.0 — FROZEN)

**Six registries:** Project, Constraint, Tradeoff, Observation, Pattern, Discovery

**Project Registry fields:**
`id, name, category, status, thesis, signal, summary, capability, engineering_identity, maturity{flagship/recruiter/engineer/explorer}, deployment, technologies, links, version, predecessor, successor`

**Constraint Registry fields:**
`id, project, constraint, impact, response, status, review, cost, severity{LOW/MODERATE/HIGH/CRITICAL}, nature{PERMANENT/TEMPORARY}`

**Tradeoff Registry fields:**
`id, project, decision, alternatives, reason, exchange{gained/sacrificed}, cost, status{ACCEPTED/REVISITING/SUPERSEDED/VALIDATED}`

**Observation Registry fields:**
`id, project, observation, occurred, context, evidence, candidate_discovery`

**Pattern Registry fields:**
`id, name, source{DERIVED/MANUAL}, origin{EMERGENT/INTENTIONAL}, thesis, description, derived_from{observations[]/tradeoffs[]}, projects[], strength{EMERGING/DEVELOPING/STRONG/DEFINITIVE}, status{CANDIDATE/CONFIRMED/FEATURED}`

**Discovery Registry fields:**
`id, name, status{EVOLVING/MATURE/CHALLENGED/RETRACTED}, summary, reveals[], supported_by[], confidence{LOW/MODERATE/HIGH}, notes`
*(Schema defined. Population deferred to Explorer Mode spec.)*

### 6.2 New Relationship Added to Ontology
```yaml
relationship:     EVOLVES_TO
class:            Semantic
owner:            ProjectRegistry
semantic_contract: >
  A project version was succeeded by a more architecturally mature
  version. Knowledge and constraints from the predecessor informed
  the successor. The predecessor is preserved, not replaced.
```

### 6.3 Registry Population Summary
| Registry | Nodes | Status |
|---|---|---|
| Project | 8 (incl. 3 AquaVeda versions) | Populated — Mystify deferred |
| Constraint | 8 | Populated |
| Tradeoff | 9 | Populated |
| Observation | 10 | Populated — pure facts only |
| Pattern | 1 (Category Integrity) | Populated |
| Discovery | 0 | Schema only — population deferred |

### 6.4 Critical Schema Rules
- Observations are **pure facts**. No conclusions. No lessons. No interpretations.
- Conclusions belong in Discovery Registry.
- Patterns derive from Observation IDs and Tradeoff IDs — not from Project IDs directly.
- `candidate_discovery` field on Observation nodes captures future Discovery content without losing it.
- Mystify Observatory registry entry is a **special case** — dedicated session required. Do not force it into the same shape as other projects.

### 6.5 Backup Priority Rule (counterintuitive)
A per-write backup of TradeoffRegistry (tens of nodes) may be more important than a daily backup of ObservationRegistry (thousands of nodes). TradeoffRegistry has the highest semantic density per node.

---

## 7. RECRUITER LAYER

**Status: FROZEN v1.2**

### 7.1 Success Metric
> The recruiter leaves the first 90 seconds wanting to start a conversation.
Not: resume downloaded. Not: contact clicked. A conversation initiated.

### 7.2 Resume Philosophy
> Resume earns attention. Observatory earns conviction.

### 7.3 Boot Sequence
```
00:00:01   [system]      initializing observatory...
00:00:02   [registry]    loading knowledge graph...
                         6 projects · 14 constraints · 11 tradeoffs
00:00:03   [session]     visitor context: unknown
00:00:03   [system]      rendering truth layer... complete
00:00:04   [identity]    select your lens
```
- Registry counts must be driven from registry data — never hardcoded
- Only expose counts that improve comprehension

### 7.4 Mode Selection
Three cards. Language only. No icons.
- Recruiter: "You're evaluating whether this engineer is worth an interview. Clarity awaits."
- Explorer: "You're curious what this place is hiding. Discovery awaits."
- Engineer: "You want to see how this system actually works. Truth awaits."

### 7.5 Flagship Card Sequence
1. **Mystify Observatory** — special card type ("The system you're currently exploring")
2. **CyberShield** — Evidence Aggregation
3. **HaloTask Pro** — Resilient Execution

StockSphere → Featured Projects section (not flagship cards)

### 7.6 Card Anatomy Rules
- Engineering Signal dominates
- Tech stack: one line only ("Built with X, Y and Z")
- Thesis: subtle footer — never repeated in body copy
- "View Project" behavior: opens Projects App (Workstream 2 territory — no further spec here)

### 7.7 Evidence Card Key Lines
- "Every project is backed by structured engineering evidence. Constraints, tradeoffs, observations, and design decisions are stored as first-class data rather than hidden implementation history."
- Engineering Principle: **Category Integrity** — "Different kinds of truth remain separate so each can stay honest in its own domain."
- "See why this emerged →" — opens lightweight explanation inside Recruiter Mode (3 cross-project examples), then links to Engineer Mode. Never ejects recruiter directly into Engineer Mode.

### 7.8 Contact Card Rules
- Collapsed by default — [ Start Conversation ] expands form
- Inline form — no mailto, no tab switch
- Primary: inline contact form
- Secondary: LinkedIn, GitHub
- Response time: "Typically within 48 hours"
- Headline: "Interested in working together?"

### 7.9 Resume Button Rules
```
Always visible in Recruiter Mode
One-click PDF download
No modal · No confirmation · No analytics popup
Label: "Download Resume"
```

### 7.10 Journey Success / Failure States
**Success:** Understands engineering identity · Trusts authenticity · Initiates contact or opens a project
**Failure:** Confused about what Mystify is · Misses flagship projects · Leaves before evidence model registers · Downloads resume and closes tab

### 7.11 Contact Information
- Email: aryan.k.dev.mystify@gmail.com
- LinkedIn: linkedin.com/in/aryan-kumar-mystify7777
- GitHub: github.com/Mystify7777
- Portfolio: Vercel (initial), domain TBD — treat as configurable, not hardcoded

---

## 8. OUTSTANDING WORKSTREAMS

### Workstream 2 — Shared App Specs (LARGEST GAP)
Four apps, one implementation, three presentations.
Build order:
1. **Projects App** — highest traffic, Recruiter Layer already links into it
2. **Profile App** — identity, timeline, engineering philosophy, resume, contact
3. **Lab** — experiments, hidden discoveries, most flexible
4. **Certifications** — content architecture, lowest dependency

For each app, spec must define: layout, navigation, interaction rules, information hierarchy, shared components, registry mapping, cross-links.

### Workstream 3 — Mystify Registry Entry (special session)
Mystify is simultaneously: portfolio, graph, OS, knowledge base, flagship, container.
It is the only project that both contains the portfolio and is contained within it.
Do not force into same shape as other projects. Dedicated session after Projects App spec exists.

### Workstream 4 — Cross-link Completion (small)
Remaining items:
- Full check models for each traversal class
- Failure models (mostly blank — highest remaining architectural debt)
- Reference Traversal authority: Graph Layer vs Destination Registry (deferred from Session I)
- Formal write-boundary rules

### Workstream 5 — Polish (small, last)
- Assistant personality (Signal Interface tone is locked; Assistant tone is not defined)
- Boot sequence system log copy (cannot be generic — must be Observatory-specific)
- Mobile adaptation scope (described as "Observatory Launcher, not desktop compressed" — exact scope not finalized)
- Six wireframe fixes (listed in section 12)

---

## 9. IMPLEMENTATION PRINCIPLES

### From AI Prompting Strategy (locked)
- AI is: implementation accelerator, component generator, refactor assistant
- AI is NOT: system architect, interaction designer, observability strategist
- Never ask AI to build "the portfolio" — always isolate systems
- Every prompt must define: system scope, architectural context, state ownership, performance expectations, styling constraints

**Universal Prompt Template:**
```
Project Context: You are building a module for the Mystify Observatory portfolio.
Stack: Next.js / TypeScript / Tailwind CSS / Zustand / Framer Motion
Design Language: restrained, observability-focused, atmospheric, industrial precision, performance-aware
Goal: [DEFINE SPECIFIC GOAL]
Component Scope: [DEFINE RESPONSIBILITIES]
Constraints: No duplicated systems, Reuse shared components, Preserve accessibility, Avoid unnecessary motion, Maintain observatory tone
State Rules: [LOCAL VS GLOBAL STATE]
Performance Rules: minimize rerenders, lazy-load heavy systems, isolate expensive rendering
```

### Component Build Pipeline (per component)
```
Architecture → Prompt → Generate → Review → Validate → Integrate → Optimize
```

### Component Litmus Test (Engineer Mode)
> "What privilege does this give the Inspector?"
> Answer must be one of: Structure / State / History / Constraints / Tradeoffs
> If the answer is "None — it just looks technical" → Delete it.

### Master Context as Architectural Checksum
When implementation raises a question, ask: "Does this violate Master Context?"
If yes → either the implementation is wrong, or Master Context needs an intentional versioned update.
No silent drift. Versions are explicit.

---

## 10. FIRST BUILD ORDER

```
Phase 1 — Shell & Recruiter
  1. Shared primitives and layout systems
  2. Shell: Status Bar, Dock, Window Manager, Notifications
  3. Navigation: Command Palette, Observatory Index
  4. Recruiter Workspace
  5. Projects App, Profile App, Lab App, Certifications App

Phase 2 — Explorer
  6. Explorer Environment (layers, workspace)
  7. Discovery Mechanics
  8. Signal Interface (Explorer Terminal)
  9. Entity System

Phase 3 — Engineer
  10. Engine Room Level 0 — System Topology
  11. Engine Room Level 1 — Project Inspection (all 5 views)
  12. Engine Room Level 2 — Subsystem Inspection
  13. Engine Room Level 3 — Cross-Project Analysis

Phase 4 — Advanced & Polish
  14. Hidden Subsystems
  15. AI Entities (implementation)
  16. Assistant
  17. Mobile adaptation
  18. Final integration pass
```

**Pre-implementation planning sessions still needed (in order):**
```
1. Projects App Spec        (Workstream 2 — highest priority)
2. Profile App Spec         (Workstream 2)
3. Lab Spec                 (Workstream 2)
4. Certifications Spec      (Workstream 2)
5. Mystify Registry Entry   (special session)
6. Cross-link Completion    (Workstream 4)
7. Polish decisions         (Workstream 5)
```

---

## 11. DEFERRED DECISIONS

| Decision | Deferred To | Reason |
|---|---|---|
| Mystify Observatory registry entry | After Projects App spec | Mystify is both container and project — needs Projects App to exist first to understand how it differs |
| Discovery Registry population | Explorer Mode spec | Discoveries are surfaced by Explorer — population follows spec |
| Principle Registry | Future | Constitutional layer above Pattern — recognized but not yet needed |
| Reference Traversal authority | Cross-link Completion | Graph Layer vs Destination Registry — affects Level 3 query structure |
| Assistant personality | Polish session | Signal Interface tone locked; Assistant is distinct and needs its own definition |
| Mobile adaptation scope | Polish session | "Observatory Launcher, not desktop compressed" — exact inclusions not finalized |
| AquaVeda v2 full spec | When v2 has substance | Next.js rebuild in progress — too early to spec |
| DevLens full spec | When foundation phase complete | ADR-first architecture ongoing — premature to spec |
| Portfolio domain | Pre-launch | Candidates: mystify.dev, mysti.fy — treat all URLs as configurable |

---

## 12. OPEN QUESTIONS

These are unresolved. Do not assume answers.

**Q1 — Recruiter Mode live evidence (partially resolved):**
Evidence Card copy is locked. "See why this emerged →" links to a lightweight explanation. Implementation must decide how many cross-project examples to show and what they say.

**Q2 — Reference Traversal authority:**
When traversing `Project → AFFECTS → Constraint`, who coordinates — Graph Layer or ConstraintRegistry? Affects Level 3 cross-project query structure. Explicitly deferred.

**Q3 — Evolved Tradeoffs tab content at Level 3:**
Authentication approach evolution (Sessions → JWT → JWT + revocation) was cited as one example. What are the others? Needs project content to answer.

**Q4 — Mobile adaptation scope:**
What is included vs excluded on mobile? "Observatory Launcher" framing is locked but exact scope is not.

**Q5 — Assistant personality:**
Signal Interface tone is locked (dry, observant, restrained, observatory voice). Assistant is portfolio-scoped intelligence, not general chatbot. Its distinct personality is undefined.

**Q6 — Boot sequence system log copy:**
The logs that appear during initialization cannot be generic. Content must be Observatory-specific. Deferred to Polish session.

**Q7 — Six wireframe fixes still needed:**
1. Header counts (OBSERVED/MODELED/SIMULATIONS) must update per-view tab — not static
2. OBSERVED panel subtitle must reflect active tab
3. Constraints View panel header reads "TRADEOFFS" — label mismatch
4. Level 2 subtitle: "CyberShield — Service" → "CyberShield — Threat Engine"
5. Auth Service in External Dependencies → move to main topology (sibling service, not external)
6. Level 3 MODELED count label — clarify it's aggregated, not new data

---

## APPENDIX — CONTACT & IDENTITY

**Aryan Kumar**  
B.Tech Computer Science and Engineering  
Bengal College of Engineering and Technology, Durgapur  
Graduating: 2026 | CGPA: 8.52  

Email: aryan.k.dev.mystify@gmail.com  
LinkedIn: linkedin.com/in/aryan-kumar-mystify7777  
GitHub: github.com/Mystify7777  
Portfolio: TBD (Vercel initial, mystify.dev candidate)  

**Achievements:**
- Smart India Hackathon 2024 Finalist
- 500+ LeetCode problems solved
- Hacktoberfest contributor (2023–present)

---

*Master Context v2 compiled from: all ChatGPT session archives (Pre-A through Session J), all Claude Code session archives, Claude.ai planning sessions, Observatory Architecture Docs 1–5, Observatory Constitution Parts I–XII, Engine Room Level 1/2/3 Specifications, Locked Wireframe PDF, System Architecture V1 PDF, AI Prompting Strategy V1 PDF, Project Dossiers (5 projects), Registry Schema v1.0, Registry Population v1.0, Recruiter Layer v1.2.*

*All sections marked FROZEN are decisions that must not be re-opened unless a critical architectural contradiction is discovered during implementation. Versioned updates are explicit — no silent drift.*
