# Engine Room — Level 1 Access Ladder Specifications v1.0

## State / History / Constraints / Tradeoffs

---

## PREAMBLE

Level 1 contains five views. Structure is locked. This document specs the remaining four.

Each view answers a distinct question. They are not visual variations of each other — they are different privileges, exposing different layers of the system.

```
Structure      How is this project assembled?          ✓ Locked
State          How is this behaving right now?         → This document
History        How did it become this way?             → This document
Constraints    What fought back?                       → This document
Tradeoffs      Why was this decision made?             → This document
```

The Anti-Theater Rule applies to every view:

> Never fake a metric that could be real.
> Never pretend a model is a metric.

The three-second rule applies to every view:

> Is this measured or modeled? Answerable within three seconds.

---

---

# STATE VIEW SPECIFICATION v1.0

## The Hardest View

State is where Engineer mode succeeds or fails. Every other view is a modeling problem — accurate, architectural, stable. State is the only view that makes claims about the present moment. If those claims are invented, the entire workspace becomes theater.

## The Central Question

> "How is this behaving right now?"

The honest answer for a portfolio project is:
**It depends entirely on whether the project is deployed.**

Most portfolio projects exist in one of three conditions:

```
CONDITION A    Deployed and running
               Real state is available.
               OBSERVED signals exist.

CONDITION B    Deployed but dormant (free tier cold start, no traffic)
               Partial state available.
               Some OBSERVED, some inferred.

CONDITION C    Not deployed / local only
               No runtime state exists.
               State View shows architectural intent only.
```

The State View must handle all three conditions honestly.
It must never render Condition C as if it were Condition A.

## The OBSERVED / MODELED Split — State View

```
OBSERVED (genuinely measurable)         MODELED (architectural intent)
────────────────────────────────        ────────────────────────────────
Inspector session signals               Service health claims
  Time at this view                     Latency values (unless real)
  Nodes inspected                       Uptime percentages (unless real)
  Simulations triggered                 Request counts (unless real)
  Chaos actions triggered               Error rates (unless real)

Historical deployment data              Current deployment data
  (labeled RECORDED, not LIVE)          (only if actually live)
  Last deploy timestamp
  Last known version
  Deploy platform

Simulation outputs                      Invented metrics
  (labeled SIMULATION, amber)           (never, under any condition)
```

## State View Layout

```
STATE VIEW

┌─────────────────────────────────────────────────────────────┐
│ STATE                                          (MODELED)     │
│ Runtime Condition                                            │
│                                                             │
│  PROJECT STATUS                                             │
│  CyberShield                                                │
│                                                             │
│  Condition: CONDITION B — Deployed, dormant                 │
│  Platform:  Render (Free Tier)                              │
│  Version:   v2.3.1                                          │
│  Last Deploy: 09:12:41 AM  (RECORDED)                       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ SERVICE STATES                              (MODELED)        │
│ Architectural intent — not live measurement                  │
│                                                             │
│  API Gateway      Designed: Active          Not measured    │
│  Auth Service     Designed: Active          Not measured    │
│  Threat Engine    Designed: Active          Not measured    │
│  Audit Service    Designed: Active          Not measured    │
│  Redis            Designed: Connected       Not measured    │
│  MongoDB          Designed: Connected       Not measured    │
│                                                             │
│  These reflect architectural design, not deployment state.  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ SIMULATION                                  (SIMULATION)     │
│ Run a scenario to observe modeled behavior                   │
│                                                             │
│  [ Run: Normal Load ]  [ Run: High Latency ]                │
│  [ Run: Service Failure ]  [ Run: Cold Start ]              │
│                                                             │
│  SIMULATION ACTIVE label appears when running               │
│  Outputs render here — always amber-labeled                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Condition Handling

### Condition A — Deployed and Running

If a real deployment API is available and returning genuine signals, those signals render in the OBSERVED panel with LIVE badge. No simulation needed. No modeling of service health.

Real metrics only qualify as OBSERVED if:

- They come from an actual running endpoint
- They are fetched at render time, not hardcoded
- They degrade visibly if the service goes down

### Condition B — Deployed but Dormant

The most common real-world state for portfolio projects on free tiers.

```
PROJECT STATUS
Condition: Deployed — Cold (Free Tier)
Platform:  Render
Note:      This service sleeps between requests.
           State shown is architectural intent.
           Last active: [timestamp if available]
```

Service states show "Designed: Active / Not measured" — honest about the gap between design and current observation.

### Condition C — Not Deployed

```
PROJECT STATUS
Condition: Not Deployed
Environment: Local / Development only

This project has no live deployment.
State View shows architectural design intent only.
No runtime signals are available.
```

Service states show architectural design only.
The OBSERVED panel shows Inspector session signals only (same as Level 0 format).

Nothing is invented. Nothing glows green.

## Simulation Integration

Simulations are the State View's most powerful feature — and its most dangerous.

**The rule:** Simulation outputs must always be visually distinct from observations. No simulation output can ever be confused for a real measurement.

```
SIMULATION ACTIVE — High Latency Injection

  API Gateway      Latency: 847ms    ← SIMULATED
  Auth Service     Latency: 1,243ms  ← SIMULATED
  Threat Engine    Degraded          ← SIMULATED

  These values are simulated, not measured.
  [ Stop Simulation ]
```

Amber label. "SIMULATED" annotation on each value. Stop button always visible.

## Chaos Controls → State View Relationship

When a Chaos Control is triggered, its output renders in State View if State View is active. If State View is not active, the output queues and is available when the Inspector navigates to State.

Chaos outputs are always labeled SIMULATION.
They are never merged with OBSERVED signals.
They are never merged with MODELED signals.

Three categories. Always separate. Always labeled.

## What State View Is Not

```
✗  Not a health dashboard with green/red indicators
✗  Not a live ops panel with request counters
✗  Not a system monitor with CPU/RAM for the project
✗  Not a fake deployment feed
✗  Not "structure view but with status icons"
```

---

---

# HISTORY VIEW SPECIFICATION v1.0

## The Easiest View (But Only If Treated Honestly)

History is a modeling problem, not a UI problem. The data is architectural truth — what actually happened to the project over time. It cannot be faked. If nothing happened, nothing is shown.

## The Central Question

> "How did this become what it is?"

## Data Category

History is entirely **MODELED**. It represents recorded architectural decisions — not live measurement, not simulation. Label it once at the view header. Do not repeat the label on every entry.

## What History Contains

```
RECORDED HISTORY
Events that actually occurred, in sequence

VERSION HISTORY
  v1.0  v1.5  v2.0  v2.3.1

ARCHITECTURE CHANGES
  What changed structurally between versions

REASONS
  Why the change was made (not "what I wanted" — what prompted it)

FAILURES
  What broke, what didn't work, what was abandoned

REWRITES
  When something was replaced entirely and why

TRADEOFFS MADE THEN
  Decisions that were accepted at a specific version
  (Links to Tradeoffs View for full detail)
```

## History View Layout

```
HISTORY VIEW                                      (MODELED)
Evolution Timeline — CyberShield

TIMELINE

v1.0  ────────────────────────────────  Initial Build
      Architecture: Monolith
      Decision: Speed of initial development
      Constraint: Solo build, no infrastructure budget

      ↓

v1.5  ────────────────────────────────  Auth Separation
      Change: Auth Service extracted from core
      Reason: Deployment bottlenecks — every auth change
              required full redeploy
      Result: Independent deploy cadence for auth
      Cost:   Inter-service latency introduced

      ↓

v2.0  ────────────────────────────────  Threat Engine
      Change: ML pattern matching extracted as service
      Reason: Processing isolation — classifier was blocking
              API response thread
      Result: Non-blocking threat detection
      Tradeoff: → see Tradeoffs View [link]

      ↓

v2.3.1  ──────────────────────────────  Current
        Last deploy: 09:12:41 AM
        Platform: Render
        Status: Stable
```

## Failure Entries

Failures are first-class citizens in History View. They are not hidden, softened, or labeled as "learning opportunities."

```
v1.3  ────────────────────────────────  SMTP Failure
      Attempt: Native email delivery
      Result:  SMTP blocked by Render platform
      Response: Third-party relay pipeline
      Note:    → see Constraints View [link]
```

The Inspector reads this and immediately understands: this engineer encountered a real platform constraint and solved it. That is more credible than a clean success story.

## What History Does Not Contain

```
✗  "I wanted to..."
✗  "My vision was..."
✗  "I'm proud of..."
✗  Vague milestone names ("Major Update", "Big Refactor")
✗  Success stories without context
✗  Version numbers without content
```

History shows what happened and why. Not how the engineer felt about it.

## Timeline Interaction

- Each version node is expandable
- Expanding reveals full context: architecture at that version, decisions made, constraints encountered
- Links to Constraints View and Tradeoffs View from relevant entries
- No hover animations — static expansion only. History is a record, not a performance.

---

---

# CONSTRAINTS VIEW SPECIFICATION v1.0

## The Strongest View

Most portfolios hide constraints. They show outcomes — the finished system, the working feature, the clean architecture diagram. They do not show what fought back.

Constraints View is the privilege that reverses this. It is where the Inspector sees not what Aryan built, but what Aryan encountered — and how they responded.

> Recruiters evaluate achievements. Engineers evaluate constraints.

## The Central Question

> "What fought back?"

## Data Category

Constraints are **MODELED** — they represent recorded engineering reality. They are not measured at runtime. They are documented facts about what the system encountered during development and deployment.

## Constraint Anatomy

Every constraint entry contains exactly these fields:

```
CONSTRAINT
  What it was        The technical or environmental fact
  Impact             What it prevented or complicated
  Response           What was done
  Status             Accepted / Resolved / Deferred / Ongoing
  Cost               What the response cost (if applicable)
```

Status is always one of four values. Never "Completed." Never "Fixed." Engineering constraints are rarely truly resolved — they are responded to.

```
Accepted    The constraint was real. The response was chosen. Cost acknowledged.
Resolved    The constraint no longer applies. Explain why.
Deferred    Known. Not yet addressed. Honest about it.
Ongoing     Still present. Still managed. Still a factor.
```

## Constraints View Layout

```
CONSTRAINTS VIEW                                  (MODELED)
What fought back — CyberShield

FILTER  [ All ] [ Platform ] [ Budget ] [ Technical ] [ Time ]

─────────────────────────────────────────────────────────────

SMTP Blocked by Render                     Platform  ·  Accepted

  What:     Render free tier blocks outbound SMTP entirely
  Impact:   Email delivery pipeline broken at deployment
  Response: Custom fallback pipeline via third-party relay
            (Resend API — free tier, 100 emails/day limit)
  Cost:     100 email/day ceiling until paid tier
  Status:   Accepted — revisit at scale

─────────────────────────────────────────────────────────────

No Budget for Domain-Verified Sending      Budget  ·  Deferred

  What:     Domain verification requires paid DNS + sending service
  Impact:   Deliverability risk, potential spam classification
  Response: Documented. Accepted risk at current scale.
  Cost:     Unknown deliverability impact
  Status:   Deferred — threshold: first 500 users

─────────────────────────────────────────────────────────────

Render Cold Starts (Free Tier)             Platform  ·  Ongoing

  What:     Free tier services sleep after 15 minutes of inactivity
  Impact:   First response latency: 2–4 seconds
  Response: Documented in tradeoffs. Not hidden. Added loading
            state to UI to communicate delay honestly.
  Cost:     Poor first-impression experience for cold visitors
  Status:   Ongoing — resolved only by paid tier upgrade

─────────────────────────────────────────────────────────────

JWT Revocation Complexity                  Technical  ·  Accepted

  What:     Stateless JWT cannot be invalidated server-side
            without additional infrastructure
  Impact:   Compromised tokens valid until expiry
  Response: Short expiry window (15min access, 7day refresh)
            Revocation list scoped to security events only
  Cost:     Additional refresh token infrastructure
  Status:   Accepted — adequate at current threat model

─────────────────────────────────────────────────────────────
```

## Filter System

Five filter categories, mutually exclusive single-select:

```
All          All constraints (default)
Platform     Hosting, infrastructure, deployment environment
Budget       Financial constraints, free tier limitations
Technical    Architectural constraints, library limitations
Time         Constraints accepted due to timeline pressure
```

## Status Indicators

Visual differentiation by status — but never red/green (violates color rules):

```
Accepted    #A6A6A6 — secondary text. Stable. Acknowledged.
Resolved    #00D4FF — engineer accent. Notable. Explain how.
Deferred    #C9924A — amber. Attention. Has a threshold condition.
Ongoing     #707070 — muted. Present. Managed. Not urgent.
```

## What Constraints View Reveals

The Inspector reading Constraints View learns:

1. What the real platform is (not "Render" as a logo — Render as a constraint source)
2. How cost decisions were made (not "free tools" — "free tier with specific ceiling")
3. Where technical debt was consciously accepted (not hidden — documented with threshold)
4. How the engineer thinks under constraint (not just what they built)

This is the view where peer engineers nod. Not because the constraints are impressive — because they're familiar. Every engineer has hit platform SMTP blocks. Every engineer has shipped a JWT implementation and thought about revocation. Recognition is credibility.

## What Constraints View Is Not

```
✗  Not a bug tracker
✗  Not a list of apologies
✗  Not "known issues" from a README
✗  Not a feature backlog
✗  Not a list of things that "could be improved"
```

Constraints are facts that shaped the system. Not regrets. Not wishes.

---

---

# TRADEOFFS VIEW SPECIFICATION v1.0

## The Highest Privilege

Every other view shows the system. Tradeoffs View shows the thinking behind the system.

This is the view where Dialogue begins — not because Aryan initiates it, but because the Inspector reads a tradeoff and immediately asks: _Would I have made the same decision?_ That question is peer-to-peer thinking. It emerges from the content. It is never asked for.

## The Central Question

> "Why was this decision made?"

## Data Category

Tradeoffs are **MODELED** — documented reasoning, not runtime measurement. Label once at header. The data is architectural truth.

## Tradeoff Anatomy

Every tradeoff entry contains exactly these fields:

```
TRADEOFF
  Decision       What was chosen
  Alternatives   What else was considered (at least one)
  Reason         Why this option
  Cost           What the choice costs
  Status         Accepted / Revisiting / Superseded
```

Status for tradeoffs:

```
Accepted       Decision made. Cost acknowledged. Not revisiting.
Revisiting     Active reconsideration. New information arrived.
Superseded     A later decision replaced this one. Link to what replaced it.
```

## Tradeoffs View Layout

```
TRADEOFFS VIEW                                    (MODELED)
Why decisions were made — CyberShield

FILTER  [ All ] [ Architecture ] [ Data ] [ Infrastructure ] [ Security ]

─────────────────────────────────────────────────────────────

Why MongoDB?                         Architecture  ·  Accepted

  Decision:     MongoDB as primary data store
  Alternatives: PostgreSQL (considered), SQLite (rejected early)
  Reason:       Flexible schema during rapid iteration —
                threat signature format was unknown at v1.0
                Schema rigidity would have required migrations
                on every classifier update
  Cost:         Weaker relational guarantees
                No joins — application-level data assembly
                Aggregation pipeline complexity vs SQL
  Status:       Accepted
  Note:         If relational reporting becomes a requirement,
                this is the first decision to revisit.

─────────────────────────────────────────────────────────────

Why JWT over Sessions?               Security  ·  Accepted

  Decision:     Stateless JWT authentication
  Alternatives: Server-side sessions with Redis store
  Reason:       Stateless — no Redis dependency for auth path
                Simpler horizontal scaling model
                Auth Service can be deployed independently
  Cost:         Token revocation complexity
                15-minute access window creates UX friction
                Refresh token infrastructure required
  Status:       Accepted
  Note:         → Constraint: JWT Revocation Complexity [link]

─────────────────────────────────────────────────────────────

Why Render over Railway / Fly.io?    Infrastructure  ·  Accepted

  Decision:     Render as deployment platform
  Alternatives: Railway (pricing), Fly.io (complexity)
  Reason:       Render free tier sufficient for portfolio-scale
                Familiar deployment model (git push → deploy)
                Zero ops overhead for solo project
  Cost:         SMTP blocked (platform policy)
                Cold starts on free tier
                No persistent disk on free tier
  Status:       Accepted
  Note:         → Constraint: SMTP Blocked by Render [link]
                → Constraint: Render Cold Starts [link]

─────────────────────────────────────────────────────────────

Why localStorage for Session State?  Data  ·  Accepted

  Decision:     localStorage for client-side session persistence
  Alternatives: sessionStorage (tab-scoped), cookie (server round-trip)
  Reason:       Instant persistence without infrastructure
                No server round-trip on page reload
                Zero cost
  Cost:         Not cross-device — session does not transfer
                XSS risk if not sanitized (mitigated)
  Status:       Accepted
  Note:         Cross-device sync deferred until explicit requirement

─────────────────────────────────────────────────────────────
```

## Cross-View Links

Tradeoffs and Constraints are related systems. A tradeoff often produces a constraint. A constraint often explains a tradeoff.

Links between them are explicit and bidirectional:

```
In Tradeoffs View:
  Why Render?  →  "→ Constraint: SMTP Blocked [link]"

In Constraints View:
  SMTP Blocked  →  "→ Tradeoff: Why Render? [link]"
```

The Inspector can follow the chain. The system is internally coherent.

## Alternatives Are Mandatory

Every tradeoff entry must name at least one alternative that was considered and rejected. Tradeoffs without alternatives are not tradeoffs — they are decisions made without evaluation.

```
✓  "Why MongoDB? Alternatives: PostgreSQL, SQLite"
✗  "Why MongoDB? It fit our needs."
```

The second is a claim. The first is engineering evidence.

## Intent Is Still Withheld

Tradeoffs View is the closest the workspace comes to Aryan's voice. But it does not tip into narrative.

```
✓  "Reason: Flexible schema during rapid iteration —
            threat signature format was unknown at v1.0"

✗  "I chose MongoDB because I wanted flexibility during
    the early stages of development when I wasn't sure
    what the final data model would look like."
```

The first is evidence. The second is a story. Engineer mode tells the truth. It does not tell stories.

The Inspector reads the evidence and infers the thinking.
Their inference is more credible than the declared version.

## What Tradeoffs View Is Not

```
✗  Not a justification document ("here's why I was right")
✗  Not a regret list ("I should have used...")
✗  Not a technology showcase ("I used the best tools")
✗  Not a retrospective ("looking back, I would...")
✗  Not a future roadmap ("next I plan to...")
```

Tradeoffs are decisions made at a specific time with specific information. They are documented as such. The Inspector evaluates them in that context.

## Where Dialogue Begins

After reading Tradeoffs View, the Inspector has seen:

```
Structure      How the system is assembled
State          How it behaves (what's real, what's modeled)
History        How it became this way
Constraints    What fought back
Tradeoffs      Why decisions were made
```

At this point, the Inspector knows enough to have a real conversation. Not because Aryan asked for one — because the inspection generated questions.

That is the correct sequence. Dialogue emerges from inspection. It is never initiated.

---

---

# CROSS-VIEW CONSISTENCY RULES

The following rules apply to all four views and must be enforced at implementation:

## Data Category Labels

```
OBSERVED     Cyan (#00D4FF)     Always in header, never repeated per-item
MODELED      White (#EAEAEA)    Always in header, never repeated per-item
SIMULATION   Amber (#C9924A)    Always in header AND on each simulated value
```

SIMULATION is the exception — it repeats per-value because simulation outputs can be mixed with modeled content on the same screen. The Inspector must never confuse them.

## Empty State Rules

Every view must have an honest empty state:

```
State View — no deployment:
"No runtime state available. This project has no live deployment."

History View — new project:
"No version history recorded. History appears as the project evolves."

Constraints View — no documented constraints:
"No constraints documented for this project."
(Note: this is suspicious. Every real project has constraints.
 An empty Constraints View suggests incomplete documentation,
 not a constraint-free project.)

Tradeoffs View — no documented tradeoffs:
"No tradeoffs documented for this project."
(Same note. Every architecture has tradeoffs.)
```

## Link Behavior

Cross-view links (Tradeoffs → Constraints, History → Tradeoffs) navigate within Level 1 — they switch the active Access Ladder tab. They do not open modals, panels, or new windows. Navigation stays clean.

## Chaos Controls Scope

Chaos Controls affect State View outputs only. They do not alter History, Constraints, or Tradeoffs. Those views are records — they cannot be "chaosed." Only present-moment state can be simulated under stress.

## Access Ladder Tab Behavior

All five tabs (Structure / State / History / Constraints / Tradeoffs) are always visible at Level 1. They are never hidden, disabled, or locked behind interaction. The Inspector can jump to Tradeoffs without reading Structure first.

The spec recommends descent order. It does not enforce it.
An Inspector who jumps to Tradeoffs immediately is an Inspector who knows what they're looking for. That is a valid inspection pattern. The workspace respects it.

---

# SPEC STATUS

```
✓  State View v1.0           — Locked
✓  History View v1.0         — Locked
✓  Constraints View v1.0     — Locked
✓  Tradeoffs View v1.0       — Locked

Next:
→  Wireframes for all four views (one pass)
→  Level 2 — Subsystem Inspection spec
→  Level 3 — Cross-Project Constraints & Tradeoffs spec
```

---

_Engine Room Level 1 — Access Ladder Specifications v1.0_
_All decisions above are locked unless explicitly revisited._
_Mystify Observatory — Engineer Workspace_
