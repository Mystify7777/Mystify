# MYSTIFY OBSERVATORY — MASTER CONTEXT DOCUMENT
**Status:** Planning Phase — Pre-Implementation  
**Last Organized:** August 2026  
**Purpose:** Single source of truth across all prior sessions, chats, wireframes, and architecture docs

---

## TABLE OF CONTENTS
1. [Project Identity](#1-project-identity)
2. [Design System](#2-design-system)
3. [Three Modes — Core Philosophy](#3-three-modes--core-philosophy)
4. [Locked Shell Systems](#4-locked-shell-systems)
5. [Observatory Index](#5-observatory-index)
6. [Explorer Mode — Full Spec](#6-explorer-mode--full-spec)
7. [Engineer Mode — Full Spec](#7-engineer-mode--full-spec)
8. [Architecture & Data Layer](#8-architecture--data-layer)
9. [Constitutional Glossary](#9-constitutional-glossary)
10. [Tech Stack & AI Prompting Rules](#10-tech-stack--ai-prompting-rules)
11. [Implementation Order](#11-implementation-order)
12. [What Remains To Be Done](#12-what-remains-to-be-done)
13. [Open Questions](#13-open-questions)

---

## 1. PROJECT IDENTITY

### What It Is
Mystify Observatory is a portfolio operating system — a desktop-like environment that presents Aryan's work through three distinct visitor perspectives. It is not a traditional portfolio. It is not an OS clone. It is not a game. It is an **observatory**: a controlled environment where visitors explore, discover, and inspect.

> "The environment itself is the primary artifact. Applications are sectors inhabiting it."

**Core Test:** Every element must reinforce the Digital Observatory metaphor. If it doesn't, it's cut.

### The Three Visitor Types

| Mode | Governing Idea | Visitor Role | Core Question | Mood |
|------|---------------|--------------|---------------|------|
| Recruiter | Curation | Reviewer | What has this person done? | Clarity, warmth, trust |
| Explorer | Archaeology | Observer | What is hidden here? | The observatory becomes aware of you |
| Engineer | Observability | Inspector | How does this system actually work? | The system tells the truth |

These are **not separate products, themes, or independent environments**. They are layered configurations of one Observatory. Interpretation affects visibility, not truth. Reality remains singular; presentation may vary.

### Emotional Objectives
**Primary:** Respect, productive unease  
**Secondary:** Curiosity, delight, technical admiration  
**Target reaction from a senior engineer:** *"This person understands systems — and this environment feels strangely aware."*

---

## 2. DESIGN SYSTEM

**Status: LOCKED**

### Visual Language
- Dark Observatory Surface
- Rounded corners: 16px
- Transitions: 160–200ms ease-out
- JetBrains Mono (all engineering/terminal surfaces)
- Inter (all content surfaces)
- No red UI elements anywhere — amber pulsing for critical states; red ONLY inside terminal `[ERROR]` log output

### Mode Accent Colors

| Mode | Color | Hex |
|------|-------|-----|
| Recruiter | Amber | — |
| Explorer | Violet | — |
| Engineer | Cyan | `#00D4FF` |
| Simulation Active | Amber (borrowed from Recruiter) | `#C9924A` |
| Chaos Controls | Orange-Red | `#E8724A` |

### Notification Severity Colors
- **Cyan:** Info
- **Amber:** Warning
- **Pulsing Amber:** Critical
- **No red** in UI anywhere

---

## 3. THREE MODES — CORE PHILOSOPHY

### Recruiter Mode
**Purpose:** Confidence that investing interview time is worthwhile. Not discovery, not inspection — decision support.

**UX Decisions:**
- Simplified UI surface, guided navigation
- Maximum 2 windows open at once
- Prominent flagship projects with metric callouts
- Direct path to resume and contact
- Reduced visual complexity — no topology overlays, no active terminal
- Fullscreen-focused workflows

**Personality:** Helpful assistant.  
**Success Condition:** A recruiter closes the tab knowing exactly what you build and why you're worth a conversation.

**The 3-Card Sequence:**
1. **Profile / Evidence Card** — "This engineer thinks in systems rather than features." Must eliminate the primary doubt: *Did this person actually build this?* Show something only someone who built it could show. The Observatory architecture itself is the strongest candidate — the constitutional law hierarchy governing a portfolio is *unexpected*, and unexpected = memorable.
2. **Flagship Projects** — "This engineer can execute complex ideas into functioning software." Leave believing *Can Build*, not merely *Can Design*.
3. **Resume & Contact** — "Contacting this person is low risk and high value." Not a mini-portfolio — a friction-remover.

**Bottom Bar:** Auto-hides. **Dock drag reordering:** Not allowed.

---

### Explorer Mode
**Purpose:** Cultivate presence and discovery. The observatory becomes aware of you.

**UX Decisions:**
- Environmental storytelling
- Observatory reacts to the observer's behavior
- Discovery indicators
- Hidden routes and secret systems
- Entities: Knight and Fairy
- Maximum 4 windows

**Personality:** Aware observatory.  
**Success Condition:** The explorer finds something they didn't expect, and tells someone about it.

**Bottom Bar:** Auto-hides, shows Observatory log, pulse dots, hint trigger. **Dock drag reordering:** Allowed.

---

### Engineer Mode
**Purpose:** Reveal structural truth and observability. The system tells the truth.

**UX Decisions:**
- Truthful data only — never fake a metric that could be real
- Real metrics, topology views, debug tools, chaos controls
- Performance visibility
- Maximum 4 windows, custom sizing

**Personality:** Control room.  
**Success Condition:** An engineer spends more time in the Engine Room than planned, and comes away believing you could build their infrastructure dashboard.

**The OBSERVED / MODELED / SIMULATION Rule:**
- `OBSERVED` (cyan) — Measured at runtime. Always live. Never estimated. Never faked.
- `MODELED` (neutral/white) — Architectural truth. Always accurate. Never pretending to be measured.
- `SIMULATION` (amber) — Explicitly interactive. Always labeled. Never running silently.

**The Three-Second Rule:** An Inspector must always be able to answer "is this measured or modeled?" within three seconds. If not, the UI has failed.

**Anti-Theater Rule:** Never fake a metric that could be real. Never pretend a model is a metric.

**Status Bar Contract (always visible):**
```
OBSERVED: LIVE ●    MODELED: STATIC ●    DATA TRUTH: VERIFIED
```

**Bottom Bar:** Always visible in Engineer mode. **Dock drag reordering:** Allowed.

---

## 4. LOCKED SHELL SYSTEMS

**Status: ALL LOCKED — Do not redesign unless a critical UX flaw is discovered. Prefer extension over replacement.**

### 4.1 Status Bar
**Height:** 32px | **Zones:** Left / Center / Right

| Zone | Recruiter | Explorer | Engineer |
|------|-----------|----------|----------|
| Left | Identity | Identity | Identity |
| Center | Context (helpful messages) | Awareness (observatory observations) | State (system readouts) |
| Right | Utility | Presence | Control |

**Right-side items per mode:**
- Recruiter: Weather, Search, Notification dot, Profile, Clock
- Explorer: Weather, Search, Discovery indicator, Observatory pulse, Motion toggle, Notifications, Profile, Clock
- Engineer: Connectivity, FPS, Search, Debug, Motion, Notifications, Profile, Clock

**Easter egg — 7 rapid center clicks:**
- Recruiter: Knight appears
- Explorer: Knight or Fairy
- Engineer: Text becomes "stop."

---

### 4.2 Bottom Bar

| Mode | Contents | Behavior |
|------|----------|----------|
| Recruiter | Minimal ambient status | Auto-hides |
| Explorer | Observatory log, Pulse dots, Hint trigger | Auto-hides |
| Engineer | System log, Pattern analysis, Secure connection, Session timer, Version info | Always visible |

---

### 4.3 Dock
**Position:** Bottom center | **Material:** Dark surface, edge lighting, reflection beneath, subtle arc curvature

| Property | Value |
|----------|-------|
| Icon size | 50px |
| Hover size | 56px |
| Height | 68px |

**Apps (left to right):** ◈ Observatory Index, Profile, Projects, Engine Room, Terminal, Lab, Certifications, Assistant, Trash

**Trash naming by mode:** Recruiter = "Recycle Bin" / Explorer = "Archive Vault" / Engineer = "Null Container"

**Drag reordering:** Explorer ✓ / Engineer ✓ / Recruiter ✗. Persistent order stored in localStorage. Silent reset if invalid.

---

### 4.4 Window Manager
**Five window types:** Standard Window, Active Terminal, Engine Room Canvas, Assistant Panel, Passive Terminal Panel

**Window limits:** Recruiter = max 2, fullscreen-first | Explorer = max 4, freeform | Engineer = max 4, freeform, custom sizing

**Title bar:** 24px, auto-hides after 3 seconds

**Close animations:**
- Recruiter: Fade
- Explorer: Glass shatter (limited frequency)
- Engineer: Technical disassembly (limited frequency)

**Every window carries metadata:**
- `WindowOwner` (e.g., ProjectRegistry)
- `WindowScope` (e.g., PROJECT)
- `WindowContext` (e.g., CyberShield)

---

### 4.5 Notification System
**Panel:** 360px desktop / 320px tablet | **Max height:** 480px | **Position:** Drops from notification icon  
**Toast lane:** Bottom-right | **Toast spacing:** 16px from right, 16px above dock | **Sound:** Disabled globally

**Severity:** INFO → Panel only | WARNING → Panel + badge | IMPORTANT → Panel + badge + toast

**Categories:** ⚡ Performance / ⚙ System / ◈ Observatory

**Per-mode behavior:** Engineer = Grouped notifications / Explorer = Flat feed / Recruiter = Minimal feed

**Chaos notification:** Persistent, never ages, has "Reset All Controls" button

---

### 4.6 Command Palette
**Status: LOCKED (v0.3)**

**Trigger:** CMD+K or Search icon  
**Result item anatomy:** Fixed 48px row height  
**Badge/command type system:** NAV, LAY, DIS, SYS, ENT

**Per-mode personality:**
- **Recruiter:** Simple navigation — clean and focused
- **Explorer:** Navigation + discoveries + hints — locked/uncatalogued sectors, mysterious entities section
- **Engineer:** Navigation + diagnostics + runtime actions — Chaos controls section with DISABLED state

**Mobile:** Simplified sheet behavior  
**"New Window" indicator (Shift+Enter):** Appears on hover only for window-capable commands — never by default

---

## 5. OBSERVATORY INDEX

**Status: LOCKED (v1.1)**

The Observatory Index is the spatial navigation system of the entire portfolio. **Not an app drawer. Not a sitemap. Not a launcher.** It is the master topology map of the observatory — a living system map.

**Trigger:** ◈ Index button in dock (leftmost), or CMD+K → Index  
**Overlay behavior:** Full viewport minus status bar. Renders above all windows, below modals. Does NOT close other windows.  
**Close:** ESC, click ◈ again, or click outside map canvas  
**Open animation:** Fade in + nodes materialize from center outward, 220ms ease-out, staggered by layer

**What it answers:**
- Recruiter: "I understand how this place is organized."
- Explorer: "There are parts of this place I haven't seen yet."
- Engineer: "I can see the topology of this entire system."

**Structure — Spatial Hierarchy:**
- **Core:** Engine Room (dominant central node)
- **Layer 1:** Identity, Application, Knowledge sectors
- **Layer 2:** Terminal, Lab, Observatory Guide
- **Unknown Sector:** Locked/sealed — visible but inaccessible

**Mode Transformation (same structure, different lens):**
- **Recruiter:** Amber, sparse connections, large nodes, clean
- **Explorer:** Violet, atmospheric dots, mysterious energy
- **Engineer:** Cyan, denser connections, Engine Room visually dominant

**Interaction States:** Default → Hover Projects → Selected → Hover Terminal

**Connection type legend (line style only, never color):** Direct / Indirect / Data Flow / Dependency

**Philosophy Cards (keep as implementation guardrails):**
- "Not a Menu"
- "Context First"
- "Layers Not Links"
- "Discoverable"

---

## 6. EXPLORER MODE — FULL SPEC

**Status: FULLY SPECIFIED**

### 6.1 Explorer Environment
**Layer architecture (back to front):** Far → Mid → Near → Surface → Null  
**Dock icon:** Special explorer styling  
**Discovery glow counter:** Visible in status bar  
**Interaction modes:** Passive observation + Active interaction

### 6.2 Entity System
**Status: LOCKED**

Entities are **not rewards, mascots, characters, or lore**. They are **evidence of habitation**. They are presences, not characters. Their purpose is to reinforce the feeling that the Observatory is inhabited.

**Entities:** Knight (system protection / discipline) + Fairy (curiosity / playful exploration)  
**Future entities:** Possible — but must not be designed until Explorer architecture is complete

**Rules:**
- Entity existence should emerge from systems rather than from scripted spectacle
- Entities are not NPCs
- No cartoon energy
- Silence rule strictly enforced (entities do not speak; the Observatory speaks)
- Rare appearances
- Subtle movement
- Limited interference

**Knight — trigger:** 7 rapid clicks on status bar center text  
**Entity interaction flow:** Click interaction → cursor interaction → proximity system → ambient triggers → entity message overlay

**Entity Schema:**
```
Entity {
  id
  name        // human-readable designator, not personality
  type: KNIGHT | FAIRY | ...  // extensible
}
```
Note: `type` not `archetype` — archetype smuggles interpretation into truth.

---

### 6.3 Environmental Reactions
**Status: LOCKED**

> "Entities make the observatory feel inhabited. Discovery makes it feel deep. Environmental Reactions make it feel awake."

**Three reaction surfaces:**
1. Ambient Geometry
2. Status Bar Text
3. Observatory Index

**Priority ladder (most to least foreground):**
1. ENTITY
2. DISRUPTION
3. DISCOVERY
4. STATE
5. ATTENTION

**Core principle:** The observer should not consciously notice reactions. The Observatory should simply feel alive.

---

### 6.4 Signal Interface (Explorer Terminal)
**Status: LOCKED (v1.1)**

> "The terminal is not a command line. It is a listening post."

**NOT:** bash shell / chatbot / assistant  
**IS:** The Observatory's voice — a listening post and observation layer

**Two layers:**
1. **Passive Signal Feed** — observes and reacts; reveals continuity and contextual awareness
2. **Active Signal Interface** — permits intentional interaction; reveals understanding rather than control

**Log format:** `HH:MM:SS  [tag]  message...` — always lowercase, always monospace

**Tag system:** `[observer]` `[entity]` `[discovery]` `[session]` `[mode]`

**Hidden commands (6 total):**
- `who` — observer identity
- `what` — observatory description
- `when` — time/session awareness
- `why` — purpose
- `trace` — entity probable origin
- `where` — **observatory-relative position** (3 contextual variants based on observer state — never touches real-world location data)
  - If Index is open: "you are already looking at the answer"
  - If explored an area: returns the region
  - Default: vague/poetic

**Listen state behavior:** Cursor remains visible, becomes **static** (frozen, not dimmed). Opacity unchanged. Input disabled. Logs accelerate. The cursor freezes because: "the system has shifted its attention."

**Extended behaviors locked from wireframe:**
- **Terminal Fatigue** — prevents mechanical command repetition without punishing curiosity
- **Terminal Drift** — vocabulary becomes slightly more familiar over extended sessions ("Language evolves. No more frequent. No more dramatic.")
- **Deep Session State** — Observatory notices the observer has been present 45+ minutes and logs it
- **Post-Entity State** — 90s elevated log activity after an entity appears; [entity] entries as delayed record
- **Interaction Memory** — persistent recognition of prior sessions

**Software/character line (locked principle):**
> "Every decision for the Signal Interface should be tested: does this behave like a character or like software? Character decisions are almost always correct. Software decisions are almost always wrong."

---

### 6.5 Discovery Mechanics
**Status: LOCKED (v1.0)**

Discoveries are **evidence, not rewards or achievements**. They reveal truths that already exist; they increase understanding rather than progression.

**What can be discovered:** Sectors, Entities, Patterns, hidden system access  
**Discovery philosophy:** Things exist before they are discovered. Hidden content is *unwitnessed*, not absent.  
**Observatory State Progression:** evolving → mature → challenged → retracted  
**Storage:** linked to session state  
**At-it trigger system:** Ambient + interaction-based, never scripted

---

## 7. ENGINEER MODE — FULL SPEC

**Status: FULLY SPECIFIED**

### 7.1 Governing Idea
- **Governing Idea:** Observability
- **Visitor Role:** Inspector
- **Question:** How does this system actually work?
- **Mood:** The system tells the truth.

### 7.2 Engine Room — Navigation Architecture

**Primary navigation:** Sidebar Hierarchy (descent-based — Inspector descends, does not browse)  
**Secondary navigation:** Breadcrumb at top of main panel, always visible

```
ENGINE ROOM  >  System Topology
ENGINE ROOM  >  CyberShield  >  Threat Engine
ENGINE ROOM  >  CyberShield  >  Threat Engine  >  Tradeoffs
```

**Navigation rules:**
- Level 0 is accessible from any depth (clicking "System Topology" resets to root)
- Level 1 requires selecting a project node at Level 0
- Level 2 requires selecting a subsystem at Level 1
- Level 3 accessible from sidebar at any depth (doesn't require descent through Level 2)
- Simulations and Chaos Controls appear only at Level 1+
- No "Quick Inspect" shortcut. Descent is always earned.

---

### 7.3 Level 0 — System Topology

**Status: LOCKED (wireframe locked)**

**Purpose:** Explain relationships between systems, not implementations.

> "Level 0 exists to explain relationships, not implementations."

**Contains:** Portfolio Topology Graph (MODELED), Observed Panel (LIVE), System Events, Relationship Legend  
**Does NOT contain:** Chaos Controls, Simulations, Subsystem metrics, Latency displays, Health status cards, Technology logos

**Level 0 Header Block:**
```
LEVEL 0 — SYSTEM TOPOLOGY
Portfolio Ecosystem Overview

OBSERVED          MODELED          SIMULATIONS
9                 22               3
Runtime Signals   Relationships    Available
```

**Node Tiers:**
- **Tier 1 (largest):** Projects — Mystify (Web Application), HaloTask (Productivity Suite), CyberShield (Security Platform)
- **Tier 2 (medium, no type label):** Shared Systems — Design System, Auth Pattern, Data Layer, Logging System
- **Tier 3 (only visible after Level 1 descent):** Dependencies — JWT, Redis, WebSocket Layer, Component Library

**Why Tier 1 shows type labels, Tier 2 does not:** Projects are destinations. Patterns are supporting evidence. Equal visual weight creates noise and pulls the Inspector toward infrastructure before products. Wrong order.

**Relationship Vocabulary (line style only, NOT color):**

| Relationship | Line Style |
|---|---|
| Uses | Solid arrow |
| Shares | Double solid |
| Inspired | Dashed arrow |
| Replaced | Dashed, heavier |
| Succeeded | Dotted arrow |
| Depends | Dashed, thin |

**Retired nodes:** 40% opacity, no fill. The Replaced relationship always terminates at a retired node.

**Observed Panel (right column — only OBSERVED surface at Level 0):**
```
FPS (Current)            58 FPS
Session Duration         00:34:11
Memory Usage             41 MB
Window Count             3
Mode                     Engineer
Active Tab               Engine Room
Notifications Queue      2
Command Count            128
Discoveries              7
Last Interaction         09:34:09 AM
```

**System Events panel (below graph — OBSERVED, live):**
```
09:34:09   [session]    Engineer mode initialized
09:33:58   [mode]       Switched from Explorer
09:31:42   [discovery]  Node catalogued: Terminal
09:28:15   [entity]     Entity trace: origin unknown
09:27:01   [session]    Return visitor detected. 3 sessions.
```

---

### 7.4 Level 1 — Project Inspection

**Status: LOCKED (all 5 views wireframed and locked)**

**Purpose:** Expose the Access Ladder for a specific project

**Access Ladder — five views:**

| View | Question | Data Category |
|------|----------|---------------|
| Structure | How is this project assembled? | MODELED |
| State | How is it behaving right now? | OBSERVED where possible, MODELED where not |
| History | How did it become this way? | MODELED (RECORDED label) |
| Constraints | What fought back? | MODELED |
| Tradeoffs | Why was this decision made? | MODELED |

**State View — Three Conditions:**
- **Condition A:** Deployed and running — real signals render LIVE
- **Condition B:** Deployed but dormant (free tier) — partial state, honest about gap
- **Condition C:** Not deployed — no runtime state, shows architectural intent only
- The view must handle all three honestly. NEVER render Condition C as Condition A.

**History View key principle:** Failures are first-class citizens. Not hidden, not softened, not called "learning opportunities." Engineers reading constraint hits will nod in recognition — that is credibility.

**Constraints View — Constraint anatomy:**
```
CONSTRAINT
  What it was        The technical or environmental fact
  Impact             What it prevented or complicated
  Response           What was done
  Status             Accepted / Resolved / Deferred / Ongoing
  Review             Living documentation note (not a closed record)
  Cost               What the response cost (if applicable)
```

**Constraints View — important empty state note:**
> "An empty Constraints View suggests incomplete documentation, not a constraint-free project."
This exact text should appear as literal UI text.

**Tradeoffs View — Tradeoff anatomy:**
```
TRADEOFF
  Decision       What was chosen
  Alternatives   What else was considered (at least one — mandatory)
  Reason         Why this option
  Cost           What the choice costs
  Status         Accepted / Revisiting / Superseded
```

Cross-view links (Tradeoffs → Constraints, History → Tradeoffs) navigate within Level 1 — they switch the active tab, not open modals.

**Simulations (Level 1+):**
```
SIMULATIONS ACTIVE — High Latency Injection
  API Gateway      Latency: 847ms    ← SIMULATED
  Auth Service     Latency: 1,243ms  ← SIMULATED
  (Always amber-labeled, always stoppable)
```

**Chaos Controls (Level 1+, target = specific project):**
```
CHAOS CONTROLS
Target: CyberShield
  [ Inject High Latency ]
  [ Disable Auth Service ]
  [ Simulate Cold Start ]
  [ Isolate Threat Engine ]
```

---

### 7.5 Level 2 — Subsystem Inspection

**Status: LOCKED**

Same Access Ladder applied to a single subsystem. Breadcrumb extends one level deeper.

**Which nodes qualify:**
- Always: Service nodes (Auth Service, Threat Engine, Audit Service), Subsystem nodes
- Qualifies if non-trivial: Data store nodes (Redis, MongoDB), External nodes (3rd Party Intel API)
- Rarely: Library nodes, simple dependencies

**Empty Level 2 (honest):**
```
LEVEL 2 — SUBSYSTEM INSPECTION
JWT Auth Library

This component has no internal architecture to inspect.
It is a third-party library used by Auth Service for
token signing and verification.

Documentation: [link if available]
→ Return to CyberShield Structure [link]
```

**Chaos Controls at Level 2 become maximally specific:**
```
CHAOS CONTROLS
Target: Threat Engine
  [ Inject Pattern Noise ]
  [ Simulate Redis Failure ]
  [ Degrade ML Confidence ]
  [ Isolate from Auth Service ]
```

---

### 7.6 Level 3 — Cross-Project Constraints & Tradeoffs

**Status: LOCKED**

The only view in Engineer mode that looks across the entire portfolio simultaneously. Answers: *"What does this body of work reveal about how this engineer thinks?"*

**Three pattern types revealed:**
1. **Recurring Constraints** — same constraint across multiple projects = environmental, not project-specific
2. **Consistent Tradeoffs** — same decision across multiple projects = considered default
3. **Evolved Tradeoffs** — same decision made differently across projects = most interesting; reasoning changed

**Filter system:** Constraints / Tradeoffs / Both | Group by: Type / Project / Status

**Level 3 does NOT contain:**
- Summaries ("Aryan tends to prefer...")
- Evaluations ("This shows strong engineering judgment")
- Narratives ("Across his portfolio, we can see...")
- Scores or technology counts

> "Level 3 presents data. The Inspector synthesizes it."

---

### 7.7 Engineer Event Tags
```
[session]    [view]    [node]    [command]
```

---

### 7.8 Shared Rules Across All Engineer Levels

**Data Category Labels:**
- `OBSERVED` — cyan (`#00D4FF`), in header only
- `MODELED` — white (`#EAEAEA`), in header only
- `SIMULATION` — amber (`#C9924A`), in header AND on each simulated value (exception to the header-only rule)

**Empty State Rules (all views):**
- State View — no deployment: "No runtime state available."
- History View — new project: "No version history recorded."
- Constraints View — no docs: "No constraints documented for this project." (with note that this is suspicious)
- Tradeoffs View — no docs: "No tradeoffs documented for this project."

**Component Litmus Test (before adding anything):**
> "What privilege does this give the Inspector?"
> Answer must be one of: Structure / State / History / Constraints / Tradeoffs
> If the answer is "None — it just looks technical" → Delete it.

---

## 8. ARCHITECTURE & DATA LAYER

**Status: FULLY SPECIFIED — Docs 1–5 locked, Glossary locked**  
**Source:** Observatory Architecture Docs 1–5 (Sessions A through G.1 + Session I)

### 8.1 Constitutional Architectural Laws

**Architectural Law 01:** If information can be represented more honestly as a relationship, the relationship wins. (Key word: *honestly*, not compactly or efficiently.)

**Architectural Law 02:** If authority can be represented more honestly as ownership, ownership wins. Every time process was attempted (voting, committees, approval chains), the solution collapsed. Every time ownership and topology were used, the solution stabilized.

**Architectural Law 03:** Decisions are coordinated, not negotiated. Every decision has exactly one coordinating authority. Coordinating authorities render outcomes; they may consult multiple authorities for facts.

### 8.2 The Ten Core Node Types

```
Content Registries      Decision Registries     Observatory Registries    Truth Registries
──────────────────      ───────────────────     ──────────────────────    ────────────────
Project                 Constraint              Entity                    Observation
Experiment              Tradeoff                Sector                    Discovery
Certification           Pattern
```

The 3-3-2-2 balance is diagnostic. Invented ontologies produce prime numbers of node types. Discovered ones produce symmetry.

### 8.3 The Nine Core Relationships

| Relationship | Class | Owner | Semantic Contract |
|---|---|---|---|
| OBSERVED | Referential | Graph Layer | What entity/object was witnessed |
| OCCURRED_IN | Referential | Graph Layer | Where an Observation took place |
| AFFECTS | Semantic | ConstraintRegistry | Constraint narrows decision space for Project |
| RESPONSE_TO | Semantic | TradeoffRegistry | Tradeoff exists because Constraint existed |
| EMBODIED_BY | Semantic | TradeoffRegistry | Project becomes evidence of a Tradeoff decision |
| ASSOCIATED_WITH | Semantic | EntityRegistry | Affinity between Entity and Sector |
| REVEALS | Semantic | DiscoveryRegistry (rule) + Graph Layer (storage) | Makes existing node known to observer |
| SUPPORTED_BY | Evidentiary | DiscoveryRegistry | Observations contribute evidence toward Discovery |
| DERIVED_FROM | Evidentiary | PatternRegistry | Observations demonstrate recurrence toward Pattern |

### 8.4 The Evidence Pipeline
```
Observation → Discovery → Pattern
Witnessing    Understanding  Abstracting
"I saw"       "I learned"    "This keeps being true"
```

**Key separation — Fact vs Finding:**
- Observations are facts. They cannot be retracted.
- Discoveries are findings. They can be challenged, weakened, or retracted — while the supporting Observations remain intact.

### 8.5 Registry Ownership

| Registry | Family | Critical Type | Primary Risk |
|---|---|---|---|
| ProjectRegistry | Content | Connectivity | Cascading unavailability |
| ExperimentRegistry | Content | Standard | Node loss before outcome recorded |
| CertificationRegistry | Content | Standard | Issuer verification link rot |
| ConstraintRegistry | Decision | Standard | Silent loss of pressure context |
| TradeoffRegistry | Decision | Knowledge Density | **Highest semantic density** — one lost Tradeoff may erase entire decision chain |
| PatternRegistry | Decision | Standard/Authority | Incorrect derived strength |
| EntityRegistry | Observatory | Standard | Affinity drift |
| SectorRegistry | Observatory | Standard | Accessibility state inconsistency |
| ObservationRegistry | Truth | **Throughput** | **Corruption** (absence recoverable; incorrect evidence is not) |
| DiscoveryRegistry | Truth | **Authority** | REVEALS corruption (incorrect visibility claims) |

**Backup Priority Rule (counterintuitive):**
A per-write backup of TradeoffRegistry (tens of nodes) may be more important than a daily backup of ObservationRegistry (thousands of nodes). TradeoffRegistry has the highest semantic density per node — losing one node loses the entire reasoning chain permanently.

### 8.6 The Four Invariant Engines

| Engine | Role | Fires | Authority |
|---|---|---|---|
| Validation Engine | Authoritative | BEFORE mutation (synchronous) | Only engine that can block writes |
| Activation Engine | Interpretive | AFTER state change (reactive) | Changes visibility state only |
| Consistency Engine | Advisory | AFTER commit / scheduled | Emits Observations only |
| Derivation Engine | Computational | ON dependency change | Updates computed fields only |

**The Observatory Law:** Only the Validation Engine may prevent a graph mutation.

**The Cascade Law:** Validation → Activation → Consistency → Derivation. Never reversed. Never parallelized across layers.

### 8.7 The Seven Named Invariants

| ID | Name | Rule |
|---|---|---|
| INV-01 | Discovery Evidence | Discovery requires ≥1 SUPPORTED_BY Observation |
| INV-02 | Derived Pattern Evidence | Pattern(source=DERIVED) requires ≥1 DERIVED_FROM Observation |
| INV-03 | Discovery Visibility Gate | REVEALS active only when Discovery.status = mature |
| INV-04 | Completed Experiment Outcome | status=COMPLETED → outcome must exist |
| INV-05 | Supported Experiment Completion | outcome=SUPPORTED → status must=COMPLETED |
| INV-06 | Tradeoff Exchange Validity | exchange.gained ≠ exchange.sacrificed |
| INV-07 | Sealed Sector Observation Block | No new Observations may OCCUR_IN a SEALED Sector (historical edges remain forever) |

**Foundational invariants (never remove):** INV-01, INV-02, INV-03

### 8.8 Cross-Link Laws

**Cross-Link Law 01:** Traversal legality is mode-independent. Modes determine surfacing. Modes do NOT determine authority.

**Cross-Link Law 03:** Traversal grants reachability. It never grants authority.

**Write Boundary Law:** Traversal grants access to facts. Traversal never grants mutation authority.

**Session I Principle 01:** The authority that renders an outcome is not required to own the facts used to render it.

**Failure Constitutional Ruling:** Missing facts produce qualified outcomes. They do not halt evaluation, permit assumption, or transfer authority.

**Validation Outcome Taxonomy:** Legal / Illegal / Undetermined (NOT Allow/Reject)

### 8.9 Traversal Taxonomy

| Class | Question | Coordinator |
|---|---|---|
| Owned Traversal | What do I own? | Local Registry |
| Reference Traversal | What does this connect to? | Graph Layer (note: pressure point, final verification deferred to Engineer Mode spec) |
| Justification Traversal | Why is this allowed to exist? | Validation Engine |
| Derivation Traversal | How was this computed? | Derivation Engine |
| Visibility Traversal | May I see this? | Activation Engine |

### 8.10 Schema Laws Summary

| Law | Rule |
|---|---|
| 01 — Typed Depth | A field declares its category first. Category determines what additional structure is legal. |
| 02 — Truth vs Presentation | Content fields describe truth. Presentation fields describe prioritization. Presentation may NOT live in domain registries. |
| 03 — Category vs Capability | Categories influence expectations. They do not grant capabilities. |
| 04 — Three Field Types | Truth / Interpretation / Presentation — never collapse them. |
| 05 — Category vs State | Category = enduring nature. State = current condition. |
| 07 — Two Epistemological Pipelines | Self-originated truth: subject to internal evidence. Externally-originated truth (Certifications): subject only to the issuing authority. |
| 08 — Transient vs Terminal State | Transient = reversible. Terminal = irreversible. |
| 09 — Explicit Relationship Modeling | Inherently relational concepts must declare both sides explicitly. |

### 8.11 Shared Application Architecture

**Status: LOCKED**

Profile, Projects, Lab, and Certifications share **one implementation** across all three modes.

**Allowed per-mode variation:** Naming conventions, accent color, minor cosmetic theming, window chrome, typography emphasis

**NOT allowed:** Different content, different functionality, different information hierarchy, mode-specific data models

All three modes consume the same registry data. Only presentation changes.

---

## 9. CONSTITUTIONAL GLOSSARY

**Status: LOCKED (Post-Glossary Session)**

### Locked Terms

**Consequence** — An enforcement act performed by an Enforcement Authority. Not: Effect, Outcome, State Transition. Pressure note: All known consequences produce state transitions, but state transition status is an observed pattern, not part of the constitutional definition.

**Rendering Authority** — The authority responsible for interpreting available inputs according to owned rules and producing an outcome within its designated domain. Interpretation = Computation + Ownership of Rules. Ownership of rules is what transforms computation into rendering.

**Effect** — A downstream result whose existence depends upon a consequence. Effects have no authority. Effects may chain.

**Outcome** — The result rendered by a Rendering Authority. Answers "What was rendered?" not "What was enforced?"

**Outcome Basis** — The informational sufficiency foundation upon which an outcome was rendered. Classifications: Complete / Partial / Insufficient. Identical outcomes may possess different Outcome Bases.

**Enforcement Authority** — The authority responsible for performing consequences within its designated domain. Role ≠ Implementation. Co-location does not collapse roles.

**Fact** — Information evaluated by a Rendering Authority during outcome production. Fact is a role, not a type — the same information may function as Fact, Outcome, or Framework at different moments.

**Authoritative Information** — Information whose validity originates within a recognized authority. Originated Validity ≠ Inherited Validity.

**State Domain** — The domain that owns a distinct class of authoritative state. Defined by state class ownership, not storage location.

**Traversal Class** — A category of traversal defined by the architectural question being asked and the authority responsible for answering it. Traversal grants reachability; authority renders answers.

### Watching
**Fact Authority** — Does governing fact admissibility require an authority distinct from Rendering Authority, Enforcement Authority, and State Domain? Unresolved. May survive. May be displaced.

### Dissolved
**Verdict** — Empty dissolution. Owned nothing. Everything collapsed into Outcome.  
**Alias** — Absorptive dissolution. Points at real concepts (Traversal projection, alternate origin) already named elsewhere.

### Structural Separations (Locked)

The recurring Observatory motif — **Proximity does not confer authority** — has appeared 6+ times:

- Meaning ≠ Ownership
- Ownership ≠ Governance
- Fact Ownership ≠ Outcome Authority
- Dependency ≠ Authority
- Evaluation ≠ Authorization
- Outcome Owner ≠ Consequence Owner

### Diagnostic Tests
- **Necessity Test:** What architectural distinction becomes inexpressible if this term is removed?
- **Authority Prerequisite Test:** Has the object been stabilized before authority over the object is defined?
- **Verdictification Test:** Is there an architectural step between Outcome and what this term claims to represent?
- **Intersection Test:** Are all dimensions independently load-bearing?
- **Originated Validity Test:** Does validity originate here, or is it inherited?
- **Reconstruction Test:** Could a future Inspector reconstruct this honestly from the graph alone? If yes → graph wins; remove the field.
- **Citation Test:** Can I cite this edge independently of its nodes? If yes → Evidentiary class.
- **Metric Test:** If two values produce identical graph behavior, the metric is likely interpretation rather than truth.

---

## 10. TECH STACK & AI PROMPTING RULES

### Tech Stack
- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Animation:** Framer Motion

### AI Collaboration Philosophy
AI is: implementation accelerator, component generator, refactor assistant, debugging collaborator, documentation tool.

AI is NOT: system architect, interaction designer, observability strategist, performance authority.

The human remains responsible for architecture, system integrity, performance governance, emotional tone, interaction coherence.

### Prompting Rules

**RULE 1:** Never ask AI to build "the portfolio." Always isolate systems.

**RULE 2:** Every prompt must define: system scope, architectural context, state ownership, performance expectations, styling constraints, accessibility requirements.

**RULE 3:** Prompt for behaviors, not visuals alone.

**RULE 4:** AI-generated code must always be reviewed, validated, profiled, integrated incrementally. Never blindly merged.

**Universal Prompt Template:**
```
Project Context: You are building a module for the Digital Observatory portfolio.
Stack: Next.js / TypeScript / Tailwind CSS / Zustand / Framer Motion
Design Language: restrained, observability-focused, atmospheric, industrial precision, performance-aware
Goal: [DEFINE SPECIFIC GOAL]
Component Scope: [DEFINE RESPONSIBILITIES]
Constraints: No duplicated systems, Reuse shared components, Preserve accessibility, Avoid unnecessary motion, Maintain observatory tone
State Rules: [LOCAL VS GLOBAL STATE]
Performance Rules: minimize rerenders, lazy-load heavy systems, isolate expensive rendering
```

### AI Anti-Patterns

**Dangerous Prompts:**
- "build my whole portfolio" — architectural chaos
- "make it futuristic" — visual inconsistency
- "add cool animations" — meaningless motion
- "improve everything" — uncontrolled refactors
- "optimize this" — vague goals

**Dangerous Behaviors:**
- Merging huge AI outputs blindly → instability
- Regenerating systems repeatedly → architecture drift
- Changing libraries impulsively → integration chaos
- Skipping validation → hidden regressions

### Component Build Pipeline (Per Component)
Architecture → Prompt → Generate → Review → Validate → Integrate → Optimize

---

## 11. IMPLEMENTATION ORDER

### Phase 1 — Shell & Recruiter
1. Shared primitives and layout systems
2. Shell (Status Bar, Dock, Window Manager, Notifications)
3. Navigation systems (Command Palette, Observatory Index)
4. Recruiter Workspace (final pass)
5. Profile App, Projects App, Lab App, Certifications App

### Phase 2 — Explorer
6. Explorer Environment (layers, workspace)
7. Discovery Mechanics
8. Signal Interface (Explorer Terminal)
9. Entity System

### Phase 3 — Engineer
10. Engine Room Level 0 — System Topology
11. Engine Room Level 1 — Project Inspection (all 5 views)
12. Engine Room Level 2 — Subsystem Inspection
13. Engine Room Level 3 — Cross-Project Analysis

### Phase 4 — Advanced & Polish
14. Hidden Subsystems
15. AI Entities (implementation)
16. Assistant
17. Mobile adaptation
18. Final integration pass

---

## 12. WHAT REMAINS TO BE DONE

### Planning Still Needed (Before Implementation)

**A. Recruiter Mode App Specs**
Session J was started but not completed. What remains:
- Final content of each of the 3 Quick-Access cards (Evidence/Profile card, Flagship Projects, Resume & Contact)
- Exact sequence and evidence strategy to eliminate the "Is this person real?" doubt
- What constitutes the "live evidence" a recruiter recognizes as authentic

**B. Explorer Mode App Specs**
The environment, entity system, discovery mechanics, and terminal are all specced, but the mode-level Explorer Workspace spec has not been formally compiled.

**C. Engineer Mode App Specs**
Wireframes for Engine Room Levels 1 (State/History/Constraints/Tradeoffs views), Level 2, and Level 3 are locked. What's still needed:
- Level 1 State / History / Constraints / Tradeoffs wireframe refinements (6 specific fixes from wireframe review)
- Level 2 representative wireframe (one subsystem)
- Level 3 wireframe (cross-project view, particularly the Evolved Tradeoffs tab)
- Engineer mode full spec consolidation into master context

**D. Cross-Link System Spec (Doc 6)**
Session I completed the Traversal Taxonomy and Cross-Link Laws. What remains:
- Full check models for each traversal class
- Failure models (mostly untouched — blank slate)
- Reference Traversal authority (Graph Layer vs Destination Registry — deferred to Engineer Mode)
- Formal write-boundary rules

**E. Shared App Architecture**
The shared app strategy is locked (one implementation, three presentations), but the actual app-level specs for Profile, Projects, Lab, and Certifications have NOT been written yet. These were explicitly deferred until registry architecture existed. Registries are now fully specified. These are unblocked.

**F. Constitution Part IX–XII**
The Constitution Parts IX–XII (Interpretations & Surfaces, Governance & Evolution, Glossary, Watching Terms) are in the Documentation folder and locked. They supplement the architecture docs and act as the philosophical backbone.

### Wireframe Fixes Still Needed (From Review)
1. Header counts (OBSERVED/MODELED/SIMULATIONS) must update per-view tab, not be static
2. OBSERVED panel subtitle must reflect the active tab
3. Constraints View panel header reads "TRADEOFFS" — label mismatch, must fix
4. Level 2 subtitle: "CyberShield — Service" → "CyberShield — Threat Engine"
5. Auth Service in External Dependencies → move to main topology (it's a sibling service, not external)
6. Level 3 MODELED count label — clarify it's aggregated, not new data

---

## 13. OPEN QUESTIONS

These are the questions that have been identified but not yet resolved. Do not assume answers — bring them explicitly.

**Q1 — Recruiter Mode live evidence:**
What is the specific live evidence in the Profile/Evidence card that a non-technical recruiter will immediately recognize as authentic capability? The Observatory architecture is the obvious candidate — but is it presented in a way that someone who doesn't know what "graph-native knowledge architecture" means can recognize as unusual?

**Q2 — Reference Traversal authority:**
When traversing `Project → AFFECTS → Constraint`, who is the coordinating authority — the Graph Layer (which owns connectivity) or the Destination Registry (ConstraintRegistry, which owns meaning)? This was explicitly deferred to Engineer Mode. The answer affects how Level 3 cross-project queries are structured.

**Q3 — Recruiter content for flagship projects:**
Which 2–3 projects anchor the entire experience? The observatory structure is ready to hold them, but the actual projects (names, what they demonstrate, their tradeoffs and constraints) need to be filled in. The Engine Room specs use CyberShield, HaloTask, and Mystify as placeholders.

**Q4 — Evolved Tradeoffs tab content at Level 3:**
The Evolved Tradeoffs tab (decisions made differently across projects — the most valuable pattern type) is not shown in the wireframe. What decisions evolved between projects? Authentication approach was cited as the example (Sessions → JWT → JWT + revocation layer). What are the others?

**Q5 — Mobile adaptation scope:**
Mobile is described as "Observatory Launcher, not desktop compressed" with a simplified structure. The exact scope of what's included vs excluded on mobile has not been finalized.

**Q6 — Assistant personality:**
The Signal Interface tone is locked (dry, observant, restrained, observatory voice). The Assistant system is scoped (portfolio-scoped intelligence, not general chatbot) but its distinct personality is not defined. The original review flagged: "The Terminal's tone is defined. The Assistant deserves the same."

**Q7 — Boot sequence system logs:**
The boot sequence spec says system logs appear during initialization. What do they say? This is where tone is established first. The content cannot be generic — it must be specific to the Observatory.

---

*This document was compiled from all available sources: ChatGPT conversation archives (Sessions Pre-A through Session J), Claude Code conversation archives, Observatory Architecture Docs 1–5, Observatory Constitution Parts I–XII, Engine Room Level 1 & 2 & 3 Specifications, Locked Wireframe PDF, System Architecture V1 PDF, AI Prompting Strategy V1 PDF, and the status-bar spec JSX file.*

*All sections marked LOCKED are decisions that should not be re-opened unless a critical architectural contradiction is discovered.*
