# Engine Room — Level 2 & Level 3 Specifications v1.0

## Subsystem Inspection / Cross-Project Constraints & Tradeoffs

---

## PREAMBLE

With Level 1 locked, two levels remain.

```
Level 2    Subsystem Inspection
           Entered from Level 1 Structure View by selecting a subsystem node
           Question: How does this specific component work?

Level 3    Constraints & Tradeoffs (Cross-Project)
           Entered from sidebar or from Level 2
           Question: What patterns emerge across the entire body of work?
```

These levels serve fundamentally different purposes.

Level 2 is a depth extension of Level 1 — the same Access Ladder applied to a smaller surface.
Level 3 is a width extension of Level 0 — the same relationship thinking applied to decisions, not topology.

They are not symmetrical. They require different specs.

---

---

# LEVEL 2 — SUBSYSTEM INSPECTION SPECIFICATION v1.0

## What It Is

Level 2 is entered when the Inspector selects a subsystem node in the Level 1 Structure View and descends.

```
ENGINE ROOM  >  CyberShield  >  Threat Engine
```

It applies the Access Ladder to a single subsystem — a service, a pattern, a library, a data store — rather than the entire project.

## What It Is Not

Level 2 is not a more detailed version of Level 1. It is a narrower version.

At Level 1, the Inspector sees the whole project assembled.
At Level 2, the Inspector sees one component in isolation.

The distinction matters because subsystems have their own structure, their own constraints, their own history. They are not just boxes in the Level 1 topology diagram. They are systems within systems.

## The Central Question

> "How does this specific component work?"

## Which Subsystems Qualify for Level 2

Not every node in the Level 1 topology deserves a Level 2 view. A Library node (JWT Auth, Rule Engine) may have one relevant fact. A Service node (Threat Engine, Auth Service) has its own architecture worth inspecting.

```
Always qualifies:
  Service nodes         Auth Service, Threat Engine, Audit Service
  Subsystem nodes       Pattern Matcher, ML Model

Qualifies if non-trivial:
  Data store nodes      Redis, MongoDB (if configuration matters)
  External nodes        3rd Party Intel API (if integration is complex)

Rarely qualifies:
  Library nodes         JWT Auth, Rule Engine (link to docs instead)
  Simple dependency     Nodes with a single relationship
```

A node that navigates to Level 2 but has nothing to show is worse than a node that doesn't offer descent at all. The Inspector expects depth when they descend. If depth isn't there, say so honestly.

```
LEVEL 2 — SUBSYSTEM INSPECTION
JWT Auth Library

This component has no internal architecture to inspect.
It is a third-party library used by Auth Service for
token signing and verification.

Documentation: [link if available]
→ Return to CyberShield Structure [link]
```

That is an honest Level 2 with nothing to show. It is correct. It is not embarrassing. It is what the observatory does.

## Level 2 Layout

Level 2 inherits the Level 1 layout with three changes:

**1 — Breadcrumb extends one level deeper:**

```
ENGINE ROOM  >  CyberShield  >  Threat Engine
```

**2 — Access Ladder applies to the subsystem:**

```
Structure    Internal architecture of Threat Engine
State        How Threat Engine behaves (if observable)
History      How Threat Engine evolved
Constraints  What Threat Engine encountered
Tradeoffs    Decisions made for Threat Engine specifically
```

**3 — Chaos Controls become maximally specific:**

```
CHAOS CONTROLS
Target: Threat Engine

  [ Inject Pattern Noise ]       Degrade classifier input
  [ Simulate Redis Failure ]     Remove cache layer
  [ Degrade ML Confidence ]      Lower threshold, observe behavior
  [ Isolate from Auth Service ]  Remove Uses relationship
```

Every other rule from Level 1 applies unchanged. OBSERVED / MODELED split. Three-second rule. Anti-theater rule. Empty state honesty.

## Level 2 Structure View

Same pattern as Level 1 Structure, scoped to one subsystem.

```
STRUCTURE VIEW                                    (MODELED)
Internal Architecture — Threat Engine

  Input Layer
      │
      ├── Pattern Matcher
      │       └── Rule Engine (Library)
      │
      └── ML Model
              ├── Depends → Redis (cache)
              └── Depends → 3rd Party Intel API (external)

  Output Layer
      └── Shares → Audit Service (finding log)

EXTERNAL DEPENDENCIES
  3rd Party Intel API    Threat signature database
  Redis                  Classifier result cache
```

The topology is smaller. The vocabulary is identical. The relationship legend is not repeated — it is still visible in the sidebar from Level 1.

## Level 2 State View

Identical rules to Level 1 State View. Condition A/B/C applies to the subsystem specifically.

Chaos Controls at Level 2 produce outputs in Level 2 State View. If the Inspector is at Level 1 State View and triggers a chaos action on a subsystem, the output is scoped to that subsystem's state panel.

## Level 2 History View

Subsystem history is often shorter and more focused than project history. That is correct. A three-entry timeline is not thin — it is accurate.

```
HISTORY VIEW                                      (MODELED)
Evolution Timeline — Threat Engine

v1.0  ───────────  Signature-only matching
      No ML. Rule-based pattern detection only.
      Decision: MVP speed. ML adds complexity.

v1.5  ───────────  Hybrid: Rules + ML prototype
      Constraint: Rule-only missed polymorphic threats
      Added: ML confidence layer alongside rules
      Cost: Increased latency on classification path

v2.0  ───────────  Current: ML-primary, rules as fallback
      Reason: ML accuracy exceeded rules at 94% threshold
      Rules retained as fallback for low-confidence cases
```

## Level 2 Constraints and Tradeoffs Views

Identical rules to Level 1. Scoped to the subsystem.

Constraints at the subsystem level are often the most technically specific entries in the entire workspace. They are where real engineering problems live.

```
CONSTRAINTS VIEW                                  (MODELED)
What fought back — Threat Engine

3rd Party Intel API Rate Limits        Technical  ·  Ongoing

  What:     Free tier: 100 API calls/day
  Impact:   Classifier cannot refresh signatures in real time
  Response: Redis cache with 24hr TTL. Batch refresh on schedule.
  Cost:     Signatures up to 24 hours stale
  Status:   Ongoing — resolved only by paid API tier
```

---

---

# LEVEL 3 — CONSTRAINTS & TRADEOFFS (CROSS-PROJECT) SPECIFICATION v1.0

## What It Is

Level 3 is the only view in Engineer mode that looks across the entire portfolio simultaneously. It is not a deeper view — it is a wider one.

Where Level 0 reveals relationships between projects at the topology level, Level 3 reveals relationships between decisions across projects.

```
Level 0    How are these systems related?         (topology)
Level 3    What patterns emerge in how decisions were made?  (meta)
```

## The Central Question

> "What does this body of work reveal about how this engineer thinks?"

This is the most senior question in the workspace. It is not answerable by inspecting one project. It requires seeing all of them together.

## Who Uses Level 3

Level 3 is for the Inspector who has already descended into at least one project. They have seen Structure, History, Constraints, Tradeoffs at the project level. Now they want to zoom back out and look for patterns.

It is not designed for first-time visitors. It is not hidden from them either. An Inspector who jumps to Level 3 first will find it less informative — not because it's locked, but because context precedes synthesis.

## Layout

Level 3 is a full-canvas view. It replaces the central topology graph with a cross-project analysis surface.

```
┌──────────────────────────────────────────────────────────────┐
│  ENGINE ROOM  >  Constraints & Tradeoffs                     │
├──────────────┬───────────────────────────────────────────────┤
│              │                                               │
│  NAVIGATION  │  CROSS-PROJECT VIEW                           │
│  HIERARCHY   │                                               │
│              │  Filter: [ Constraints ] [ Tradeoffs ] [ Both ]│
│  0  System   │  Group:  [ By Type ] [ By Project ] [ By Status]│
│     Topology │                                               │
│              │  ─────────────────────────────────────────── │
│  1  Project  │                                               │
│     Inspect  │  PLATFORM CONSTRAINTS                         │
│              │                                               │
│  2  Sub-     │  Free Tier Cold Starts                        │
│     system   │    Mystify     ·  Accepted                    │
│              │    HaloTask    ·  Accepted                    │
│  3  Const.   │    CyberShield ·  Ongoing                     │
│  ● &Tradeoffs│                                               │
│              │  SMTP Restrictions                            │
│              │    CyberShield ·  Accepted                    │
│              │    [Not applicable to other projects]         │
│              │                                               │
│              │  ─────────────────────────────────────────── │
│              │                                               │
│              │  RECURRING TRADEOFFS                          │
│              │                                               │
│              │  localStorage for Client Persistence          │
│              │    HaloTask    ·  Accepted                    │
│              │    Mystify     ·  Accepted                    │
│              │                                               │
│              │  MongoDB as Primary Store                     │
│              │    HaloTask    ·  Accepted                    │
│              │    CyberShield ·  Accepted                    │
│              │                                               │
└──────────────┴───────────────────────────────────────────────┘
```

## What Level 3 Reveals

### Pattern 1 — Recurring Constraints

When the same constraint appears across multiple projects, that is a signal. It means the constraint is environmental (platform limitation, budget ceiling) rather than project-specific.

```
Free Tier Cold Starts
  Mystify      Accepted
  HaloTask     Accepted
  CyberShield  Ongoing

Reading: This engineer consistently works within free-tier constraints.
         Cold starts are a known cost, not an oversight.
```

The Inspector does not need to be told this reading. They arrive at it themselves.

### Pattern 2 — Consistent Tradeoffs

When the same tradeoff is made across multiple projects, that is also a signal. It means the decision is a considered default, not a one-time choice.

```
localStorage for Client Persistence
  HaloTask     Accepted
  Mystify      Accepted

Reading: This engineer defaults to zero-infrastructure persistence
         for portfolio-scale projects. Conscious cost: not cross-device.
```

### Pattern 3 — Tradeoffs That Evolved

When the same decision was made differently across projects, that is the most interesting signal. It means something changed — new information, new context, new constraints.

```
Authentication Approach
  Mystify      Sessions (server-state)  ·  v1
  HaloTask     JWT (stateless)          ·  Accepted
  CyberShield  JWT + revocation layer   ·  Accepted

Reading: Authentication thinking evolved across three projects.
         Sessions → JWT → JWT with complexity management.
         Each step had a reason.
```

This is what the Level 3 view makes visible. Not the decisions — the evolution of thinking behind decisions.

## Filter System

```
Constraints    Show only constraints across projects
Tradeoffs      Show only tradeoffs across projects
Both           Default — show all (grouped by type)
```

Grouping:

```
By Type        Groups all platform constraints together, all budget constraints,
               all technical constraints, all architecture tradeoffs, etc.
               Best for pattern recognition.

By Project     Shows all constraints and tradeoffs for Mystify, then HaloTask,
               then CyberShield.
               Best for project comparison.

By Status      Accepted, Ongoing, Deferred, Revisiting.
               Best for seeing what is still active vs resolved.
```

## What Level 3 Does Not Contain

```
✗  Summaries ("Aryan tends to prefer...")
✗  Evaluations ("This shows strong engineering judgment")
✗  Narratives ("Across his portfolio, we can see...")
✗  Scores or ratings
✗  Technology counts ("Used React in 3/4 projects")
```

Level 3 presents data. The Inspector synthesizes it.

The moment Level 3 starts synthesizing on behalf of the Inspector, it becomes a pitch document. Engineer mode does not pitch. It observes.

## Level 3 and Dialogue

Level 3 is where Dialogue — the tertiary mode of inspection — most naturally occurs.

An Inspector who has read the cross-project tradeoffs now has enough context to ask real questions. Not "what did you build" — but "I see you moved from sessions to JWT between Mystify and HaloTask — what changed?"

That question is the beginning of a real engineering conversation. Level 3 made it possible. Level 3 did not initiate it.

---

---

# FULL NAVIGATION MAP — ENGINE ROOM

```
LEVEL 0  ─────────────────────────  SYSTEM TOPOLOGY
         Default entry
         Question: How are these systems related?
         Contains: Portfolio topology graph, Observed panel, System Events
         Descent: Click project node → Inspected Node panel → Enter Inspection

         │
         ▼

LEVEL 1  ─────────────────────────  PROJECT INSPECTION
         Entered from Level 0 node selection
         Question: How is this project assembled?
         Contains: Access Ladder (Structure/State/History/Constraints/Tradeoffs)
                   Simulations, Chaos Controls (project-scoped)
         Descent: Click subsystem node in Structure View → Enter Subsystem

         │
         ▼

LEVEL 2  ─────────────────────────  SUBSYSTEM INSPECTION
         Entered from Level 1 Structure View subsystem node
         Question: How does this specific component work?
         Contains: Access Ladder (same five views, subsystem-scoped)
                   Chaos Controls (maximally specific)
         Ascent: Breadcrumb → back to Level 1

         │
         ▼

LEVEL 3  ─────────────────────────  CONSTRAINTS & TRADEOFFS
         Entered from sidebar at any depth
         Question: What patterns emerge across the body of work?
         Contains: Cross-project constraint and tradeoff analysis
                   Filter and grouping controls
         No further descent.
```

Level 3 is accessible from any depth via sidebar. It is not hidden behind Level 2. An Inspector can jump to Level 3 from Level 0 if they want the wide view first.

Navigation is never forced. Descent is the recommended path. It is not the only path.

---

---

# ENGINEER MODE — COMPLETE SPEC STATUS

```
✓  Governing idea, visitor role, mood                     Locked
✓  OBSERVED / MODELED / SIMULATION as design primitives   Locked
✓  Three-second rule                                      Locked
✓  Anti-theater rule                                      Locked
✓  Access Ladder (five views)                             Locked
✓  Navigation: Sidebar hierarchy + breadcrumb             Locked
✓  Level 0 — System Topology                              Locked (wireframe locked)
✓  Level 1 — Structure View                               Locked (wireframe locked)
✓  Level 1 — State View                                   Locked
✓  Level 1 — History View                                 Locked
✓  Level 1 — Constraints View                             Locked
✓  Level 1 — Tradeoffs View                               Locked
✓  Level 2 — Subsystem Inspection                         Locked
✓  Level 3 — Cross-Project Constraints & Tradeoffs        Locked
✓  Engineer-mode tag set ([session][view][node][command])  Locked
✓  Status bar contract                                     Locked
✓  SIMULATION ACTIVE label (amber)                         Locked
✓  Chaos Controls scope rules                              Locked
✓  Node tier hierarchy (Projects/Patterns/Dependencies)    Locked
✓  Relationship vocabulary and line-style rules            Locked
✓  Cross-view link behavior                                Locked
✓  Empty state rules                                       Locked

REMAINING:
→  Level 1 State / History / Constraints / Tradeoffs wireframes (one pass)
→  Level 2 wireframe (one representative subsystem)
→  Level 3 wireframe (cross-project view)
→  Engineer mode full spec consolidation into master context doc
```

---

_Engine Room Level 2 & Level 3 Specifications v1.0_
_All decisions above are locked unless explicitly revisited._
_Mystify Observatory — Engineer Workspace_
