# Observatory Architecture

## Doc 4 — Schema Spec

**Status:** Locked  
**Sessions:** F (F.0 through F.4)  
**Depends on:** Doc 1, Doc 2, Doc 3  
**Purpose:** Define the exact shape of truth for every node in the Observatory.

---

> Schema design answers: what information does it actually contain?
> This is different from architecture, which answers: what can exist?
> The architecture is already settled. This document defines shapes.
>
> Every field in this document was pressure-tested.
> Every rejected field is in Doc 1 Appendix A.
> If a field looks surprisingly absent, check the graveyard first.

---

## Section 0 — Schema Laws

These laws were discovered during Session F. Every schema in this document is a consequence of them. They apply to every future schema addition.

---

**Schema Law 01: Typed Depth**

> A field declares its category first. Category determines what additional structure is legal.

A discriminator permits conditional subfields. It does not require them. A category may be constitutive without adding depth (see: TECHNICAL on Constraint).

---

**Schema Law 02: Truth vs Presentation**

> Content fields describe truth. Presentation fields describe prioritization.
> Presentation metadata may not live inside domain registries.

Test: Could this field change without changing the truth of the node?
If yes → presentation field → belongs outside domain registry.

---

**Schema Law 03: Category vs Capability**

> Categories influence expectations. Categories do not grant capabilities.

Node categories may not determine registry participation. Capabilities belong to the node type, not to category values. Changing type should not grant or remove legal relationships.

---

**Schema Law 04: Truth / Interpretation / Presentation**

> Three distinct field categories. Never collapse them.

```
Truth           Describes what a node IS. Changing it changes the node.
Interpretation  Describes how a node is understood. Changing it changes explanation.
Presentation    Describes how a node is surfaced. Lives outside domain registries.
```

---

**Schema Law 05: Category vs State**

> Category describes enduring nature. State describes current condition.

```
Changing type:      Potentially changes what the node IS (ontological)
Changing status:    Changes what condition the node is IN (lifecycle)
```

---

**Schema Law 07: Self-Originated vs Externally-Originated Truth**

> Self-originated truth is subject to internal evidence.
> Externally-originated truth is subject only to the authority that issued it.

---

**Schema Law 08: Transient vs Terminal State**

> States may be transient or terminal.

```
Transient   Reversible: ACTIVE, DORMANT, PAUSED
Terminal    Irreversible: SUPPORTED, CONTRADICTED, EXPIRED, REVOKED
```

---

**Schema Law 09: Explicit Relationship Modeling**

> When a concept is inherently relational, model both sides explicitly.

One-sided declarations are incomplete relationships in disguise.

---

## Section 1 — Content Registry Schemas

### 1.1 Project

**Layer structure:**

| Layer                    | Purpose                                         | Fields                        |
| ------------------------ | ----------------------------------------------- | ----------------------------- |
| Identity                 | What is this?                                   | id, name                      |
| Interpretation           | How should a human understand this?             | summary                       |
| Truth: Category          | What kind of work is this?                      | type                          |
| Truth: State             | What condition is this in?                      | status                        |
| Truth: External Presence | Where does this exist externally?               | deployment, repository, links |
| Observatory Meaning      | Carried by graph edges — nearly empty by design | —                             |

```typescript
Project {
    // Identity
    id: string
    name: string

    // Interpretation
    summary: string
    // Prose. Mode-neutral. Does not duplicate graph relationships.
    // Bad: "Affected by deployment constraints." (graph already knows)
    // Good: "A personal inventory platform exploring offline-first sync."

    // Truth: Category (enduring — changing may change what this IS)
    type: "APPLICATION" | "SYSTEM" | "LIBRARY" | "EXPERIMENTAL_PLATFORM"

    // Typed Depth per type:
    // APPLICATION:
    uiSurface?: string

    // SYSTEM:
    consumers?: string[]

    // LIBRARY:
    apiSurface?: string
    packageManager?: string

    // EXPERIMENTAL_PLATFORM:
    investigationScope?: string  // extensible enum — domain of inquiry

    // Truth: State (lifecycle — changing does not change identity)
    status: "ACTIVE" | "DORMANT" | "COMPLETED" | "ARCHIVED"

    // Typed Depth per status:
    // ACTIVE:
    lastActivityAt?: timestamp

    // DORMANT:
    dormantSince?: timestamp
    revivalCondition?: string    // truth claim — "blocked by deployment cost"

    // COMPLETED:
    completedAt?: timestamp

    // ARCHIVED:
    archivedAt?: timestamp
    archiveReason?: string       // truth claim — why removed from lifecycle

    // Truth: External Presence
    deployment?: {
        platform: "RENDER" | "VERCEL" | "NETLIFY" | "SELF_HOSTED" | "NONE"
        url?: string
        environment: "PRODUCTION" | "STAGING" | "DEVELOPMENT"

        // RENDER depth:
        serviceType?: "WEB_SERVICE" | "STATIC_SITE" | "BACKGROUND_WORKER"
        region?: string
        coldStart?: boolean

        // VERCEL depth:
        projectId?: string
        teamId?: string

        // SELF_HOSTED depth:
        host?: string
        infrastructure?: string
    }

    repository?: {
        host: "GITHUB" | "GITLAB" | "PRIVATE" | "NONE"

        // GITHUB depth:
        owner?: string
        repo?: string

        // GITLAB depth:
        projectId?: string

        // PRIVATE depth:
        visibilityReason?: string
    }

    links?: Array<{
        type: "DEMO" | "DOCUMENTATION" | "CASE_STUDY" | "WRITEUP" | "OTHER"
        url: string
        label?: string
        // NO audience field — presentation concern, not content
    }>
}
```

**What is absent and why:**

- `audience` on links → presentation disguised as content (Schema Law 02)
- `featuredOrder` → presentation (Schema Law 02)
- `constraintCount` → dishonest summary of graph relationships (Architectural Law 01)
- `researchObjective` → duplicates summary (compression, Appendix A in Doc 1)
- Layer 4 (Observatory Meaning) → entirely carried by graph edges

---

### 1.2 Experiment

**Layer structure:**

| Layer                   | Purpose                            | Fields               |
| ----------------------- | ---------------------------------- | -------------------- |
| Identity                | What is this?                      | id, name             |
| Interpretation          | Two temporal orientations          | hypothesis?, summary |
| Truth: Category         | What domain does this investigate? | category             |
| Truth: Execution State  | Did it run?                        | status               |
| Truth: Conclusion State | What was learned?                  | outcome?             |

**Two orthogonal state machines:**

```
Execution State     ACTIVE → PAUSED → COMPLETED | ABANDONED
                    Answers: Did the experiment run?

Conclusion State    INCONCLUSIVE | SUPPORTED | CONTRADICTED
                    Answers: What did we learn?
                    Terminal — irreversible once set.
```

```typescript
Experiment {
    // Identity
    id: string
    name: string

    // Interpretation (temporally oriented)
    hypothesis?: string
    // Prospective — what we thought before running
    // Written at creation, not at conclusion

    summary: string
    // Retrospective — what this was
    // Written after or during, not at creation

    // Truth: Category
    category: string  // extensible enum
    // Shared vocabulary with EXPERIMENTAL_PLATFORM.investigationScope

    // Truth: Execution State (transient — can transition)
    status: "ACTIVE" | "PAUSED" | "COMPLETED" | "ABANDONED"

    // PAUSED depth:
    pausedSince?: timestamp
    pauseReason?: string

    // COMPLETED depth:
    completedAt?: timestamp

    // ABANDONED depth:
    abandonedAt?: timestamp
    abandonReason?: string

    // Truth: Conclusion State (terminal — set once, not reversed)
    outcome?: "INCONCLUSIVE" | "SUPPORTED" | "CONTRADICTED"
}
```

**Invariants (see Doc 3):**

- INV-04: `status = COMPLETED → outcome must exist`
- INV-05: `outcome = SUPPORTED → status must = COMPLETED`

**Valid state combinations:**

```
ACTIVE    + null             ✓ Running, no conclusion yet
PAUSED    + null             ✓ Paused, no conclusion yet
COMPLETED + SUPPORTED        ✓ Ran to completion, hypothesis confirmed
COMPLETED + CONTRADICTED     ✓ Ran to completion, hypothesis disproved
COMPLETED + INCONCLUSIVE     ✓ Ran to completion, insufficient signal
ABANDONED + null             ✓ Stopped, learned nothing
ABANDONED + CONTRADICTED     ✓ Stopped because it was clearly wrong
ABANDONED + INCONCLUSIVE     ✓ Stopped, not enough signal
ABANDONED + SUPPORTED        ✗ INV-05 violation — SUPPORTED requires COMPLETED
COMPLETED + null             ✗ INV-04 violation — COMPLETED requires outcome
```

---

### 1.3 Certification

**Epistemological note:**
Certification is the only Content node operating under the authority-originated pipeline. The Observation Constitution and internal evidence machinery do not apply to it.

```typescript
Certification {
    // Identity
    id: string
    name: string

    // Interpretation
    summary?: string

    // External Truth (authority-originated)
    issuer: {
        name: string
        // "AWS", "Google", "Meta" — stable even if URLs change
        // Required. Not optional. A Certification without an issuer
        // is not a Certification — it is an unverifiable claim.
    }
    awardedAt: timestamp
    expiresAt?: timestamp  // null for perpetual certifications

    // Verification (separate concern from issuer identity)
    verification?: {
        credentialId?: string
        verificationUrl?: string
        // issuer.name does not change if these change
        // Truth and verification are different layers
    }

    // Observed State (externally controlled transitions)
    status: "ACTIVE" | "EXPIRED" | "REVOKED"

    // EXPIRED depth:
    expiredAt?: timestamp

    // REVOKED depth:
    revokedAt?: timestamp
    revokedReason?: string
    // Revocation is an external authority action — the issuer made a
    // second claim superseding the first. Observatory records both.
    // It adjudicates neither.
}
```

**What is absent and why:**

- `supportingObservations` → Certifications do not require internal evidence
- `derivedConfidence` → External authority is not confidence-weighted
- `patternLinks` → Certifications do not emerge from graph analysis

---

## Section 2 — Decision Registry Schemas

### 2.1 Constraint

**Design note:** Intentionally sparse. Most Constraint meaning lives in AFFECTS relationships and in the Tradeoffs that respond to it. The schema carries identity and category only.

```typescript
Constraint {
    // Identity
    id: string
    name: string

    // Interpretation
    summary: string

    // Truth: Category
    type: "PLATFORM" | "TIME" | "KNOWLEDGE" | "LEGAL" | "RESOURCE" | "TECHNICAL"

    // Typed Depth per type:

    // PLATFORM depth:
    platform?: string
    // "Render", "Vercel", "MongoDB Atlas" — different platforms, different constraints

    // TIME depth:
    deadline?: timestamp
    // Time constraints have a boundary condition — this is that boundary

    // KNOWLEDGE depth:
    skillArea?: string
    // "Kubernetes", "WebGL" — knowledge constraints are domain-specific

    // LEGAL depth:
    jurisdiction?: string
    // "GDPR", "HIPAA" — legal constraints are jurisdiction-specific

    // RESOURCE depth:
    limit?: string
    // "$0 monthly budget", "2GB memory cap" — objective, quantifiable boundary

    // TECHNICAL: no depth
    // The category name is constitutive. "Technical constraint" is the claim.
    // Adding affectedLayer? would contextualize, not describe.
}
```

**What is absent and why:**

- `severity` → Metric Test: changing it changes no edges, no invariants (Doc 1, Appendix A)
- `impact` → Depends on what is affected; belongs to Tradeoff or relationship
- `scope` → Consequence territory, not constraint territory
- `affectedLayer` on TECHNICAL → contextualizes, doesn't describe (Doc 1, Appendix A)
- `priority` → Presentation concern (Schema Law 02)

---

### 2.2 Tradeoff

**Design note:** Densest schema in the Decision Cluster. Carries what the graph cannot: pre-outcome reasoning.

**The rationale field:**
`rationale` survives the Reconstruction Test because some reasoning is genuinely unobservable. The rejected alternatives in a decision never enter the graph. Only the chosen path survives. If rationale is not captured at decision time, it is gone. This is the one field in the Observatory that exists specifically because the graph cannot reach it.

**The exchange structure:**
A Tradeoff is not a value. It is a relationship between values. Both sides must be explicit (Schema Law 09).

```typescript
Tradeoff {
    // Identity
    id: string
    name: string

    // Interpretation
    summary: string

    rationale?: string
    // SURVIVES THE RECONSTRUCTION TEST.
    // Could a future Inspector reconstruct "why this felt reasonable
    // before the outcome was known" from graph evidence alone? No.
    // The rejected alternatives leave no graph trace.
    // This field exists to hold what the graph cannot reach.
    // DO NOT REMOVE. See Doc 1 Appendix A for full reasoning.

    // Truth: Exchange (both sides required — Schema Law 09)
    exchange: {
        gained: ValueType
        sacrificed: ValueType
        // INV-06: gained ≠ sacrificed
    }
}

type ValueType =
    "PERFORMANCE" |
    "SIMPLICITY" |
    "COST" |
    "FLEXIBILITY" |
    "MAINTAINABILITY" |
    "RELIABILITY"
```

**What is absent and why:**

- `confidence` → Metric Test: changing it changes no edges, no invariants (Doc 1 Appendix A)
- `impact` → Consequence territory; belongs to Observation chain
- `alternatives` → Graph cannot carry this; would belong in summary
- `successMetric` → Owned by Discovery
- Single `category` (not exchange pair) → Incomplete relationship in disguise (Schema Law 09)

---

### 2.3 Pattern

**Design note:** Sparse. Evidence architecture is entirely graph-carried. Schema holds only the authored abstraction claim.

**The abstraction principle:**
Pattern is about abstraction, not recurrence. Recurrence is the _evidence_. The Pattern is the _higher-order claim_ placed over that evidence.

**Two sources, two schemas:**

```
AUTHORED    statement required (claim to be expressed)
            strength manually set
            0 Observations required

DERIVED     statement optional (graph may imply the abstraction)
            strength computed by Derivation Engine
            ≥1 Observation required (INV-02)
```

```typescript
Pattern {
    // Identity
    id: string
    name: string

    // Interpretation
    statement?: string
    // Required for AUTHORED — the specific abstraction claim
    // Optional for DERIVED — graph carries the evidence; abstraction may be implied
    //
    // SURVIVES THE RECONSTRUCTION TEST for AUTHORED patterns:
    // Many abstractions can explain the same observations.
    // The specific framing exists only because someone authored it.
    // The graph cannot recover which interpretation was chosen.

    // Truth: Provenance
    source: "AUTHORED" | "DERIVED"

    // Truth: Signal Strength
    strength: number  // 0.0 – 1.0
    // For AUTHORED: manually set by author
    // For DERIVED: computed by Derivation Engine from DERIVED_FROM edge weights
    // Metric: "how consistently does this appear?" (not "how certain are we?")
    // strength ≠ confidence — these measure different things
}
```

**What is absent and why:**

- `recurrence.context` → Graph already knows (traverse DERIVED_FROM → OBSERVED) (Doc 1 Appendix A)
- `recurrence.subject` → Redundant with name (Doc 1 Appendix A)
- `confidence` → Wrong metric; patterns use strength (recurrence), not confidence (certainty)
- Domain/topic fields → Graph carries this via connected nodes

---

## Section 3 — Observatory Registry Schemas

### 3.1 Entity

**Design note:** Possibly the most compressed schema in the ontology. Dense graph presence. Sparse fields. Everything interesting — movement, appearance, affinity, history, behavior — lives in Observations and edges.

**Why so sparse:**
The Observatory Existence Principle: Entity exists before it is witnessed. The schema must contain only what is true independent of observation history. That turns out to be very little.

```typescript
Entity {
    // Identity
    id: string
    name: string
    // Human-readable designator. Not personality. Not biography.
    // Distinguishes this Entity from others of the same type.

    // Truth: Category
    type: "KNIGHT" | "FAIRY" | string  // extensible
    // NO Typed Depth — graph owns behavior, movement, and role
    // The category name is constitutive
    // NOT "archetype" — that word smuggles interpretation into truth
}
```

**What is absent and why:**

- `personality` → Not Observatory architecture
- `biography` → Not Observatory architecture
- `behavior` → Belongs to Observation
- `location` → Entity is not furniture; movement is Observation
- `affinity` → Belongs to ASSOCIATED_WITH edge
- `history` → Belongs to Observation chain
- `dialogue` → Not Observatory architecture
- `archetype` → Vocabulary that smuggles interpretation; use `type`

---

### 3.2 Sector

**Design note:** Near-minimal. Named space with accessibility state. Graph carries habitation, history, and association.

**Accessibility vs visibility:**

```
Visibility  → observer state (rejected under Schema Law 02)
Sealed      → place state (survives — true regardless of who is watching)
```

A SEALED Sector is known to exist and cannot be entered. This changes graph behavior (INV-07). That is the test for a truth field.

```typescript
Sector {
    // Identity
    id: string
    name: string

    // Interpretation
    summary?: string
    // Optional. Sectors accumulate observable evidence faster than Projects.
    // A dense graph will eventually describe a Sector without a summary.
    // Summary is for intent the graph hasn't had time to fill in yet.

    // Truth: Category
    type: "ARCHIVE" | "SIGNAL" | "ENGINE" | "RESEARCH" | "UNKNOWN"

    // Truth: Accessibility State
    accessibility: "OPEN" | "SEALED" | "RESTRICTED"

    // SEALED depth:
    sealedAt?: timestamp
    sealReason?: string

    // RESTRICTED depth:
    condition?: string
    // What must be true for access to be permitted
}
```

**Invariant (see Doc 3):**

- INV-07: `accessibility = SEALED → New Observations may not OCCUR_IN this Sector`

---

## Section 4 — Truth Registry Schemas

### 4.1 Observation

**Design note:** The most important schema in the Observatory. Foundation of the entire evidence architecture. Every other schema is downstream.

**The four-layer model:**

| Layer                     | Question                           | Fields                                     |
| ------------------------- | ---------------------------------- | ------------------------------------------ |
| Existence                 | Can this node legally exist?       | id, type                                   |
| Graph Admissibility       | Can this be queried and traversed? | primarySubject, observer, timestamp, scope |
| Evidentiary Admissibility | Can this support truth claims?     | provenance                                 |
| Interpretation            | What does this mean in context?    | metadata                                   |

**Article 1 of the Observation Constitution:**

> An Observation may exist without provenance, but it may not participate in truth formation without provenance.

```typescript
Observation {
    // Layer 1: Existence
    id: string
    type: ObservationType
    // Examples: entity_appeared | pattern_detected | signal_witnessed |
    //           inspector_descended | consistency_violation_detected | ...
    // Enum is extensible — the Observatory will discover new observation types

    // Layer 2: Graph Admissibility (all four required for traversal)
    primarySubject: NodeReference
    // The thing most directly witnessed

    observer: {
        type: "INSPECTOR" | "ENTITY" | "ENGINE"
        id: string
        // Inspector: human identifier
        // Entity: entity node id
        // ENGINE: engine identifier (e.g., "consistency-engine")
    }

    timestamp: timestamp

    scope: string
    // The context or boundary within which the observation occurred

    // Layer 3: Evidentiary Admissibility (required for truth formation)
    provenance?: {
        origin: string
        collectionMethod:
            "MANUAL" |
            "TRIGGERED" |
            "AMBIENT" |
            "SYSTEM_AUDIT" |
            "DERIVED"
        // Must be enum — PatternRegistry queries by collectionMethod
        // Free text destroys query capability

        generatedBy: {
            type: "INSPECTOR" | "ENTITY" | "ENGINE"
            id: string
            operation?: string
            // ENGINE only — e.g., "INV-01_AUDIT", "CROSS_REGISTRY_CHECK"
            // This is the third instance of Typed Depth in the schema
        }
    }

    // Layer 4: Interpretation
    metadata?: Record<string, unknown>
    // Free-form context. Does not gate admissibility.
}
```

**Three observer types and their trust tiers:**

```
INSPECTOR   Intentional, human-directed
            Highest interpretive authority
            Can be questioned, not dismissed

ENTITY      Ambient, presence-triggered
            Medium authority
            Atmospheric, not analytical

ENGINE      Structural, consistency-driven
            Authority limited to engine's scope
            Never interprets — only reports
```

**System Observations (consistency violations):**
When the Consistency Engine detects a violation, it emits:

```typescript
{
    type: "consistency_violation_detected",
    observer: { type: "ENGINE", id: "consistency-engine", operation: "[specific audit]" },
    primarySubject: affectedNode,
    provenance: {
        collectionMethod: "SYSTEM_AUDIT",
        generatedBy: { type: "ENGINE", id: "consistency-engine", operation: "[audit]" }
    }
}
```

These Observations are exempt from triggering further Consistency Engine audits (loop prevention).

---

### 4.2 Discovery

**Design note:** The finding node. Bridges evidence and knowledge. Carries confidence and lifecycle state.

```typescript
Discovery {
    // Identity
    id: string
    type: string
    // Classification of what was understood

    // Truth: Epistemic Strength
    confidence: number  // 0.0 – 1.0
    // Assessment of the conclusion, not of individual evidence links
    // confidence lives on Discovery, not on SUPPORTED_BY edges
    // Metric: "how certain are we?" (epistemic claim)

    // Truth: Lifecycle State
    status: "evolving" | "mature" | "challenged" | "retracted"
    // evolving:   Accumulating evidence. REVEALS edges inactive.
    // mature:     Sufficient evidence. REVEALS edges active (INV-03).
    // challenged: Confidence dropping. Revealed nodes marked uncertain.
    // retracted:  REVEALS suspended. Node persists. Trust revoked.
}
```

**Invariant (see Doc 3):**

- INV-01: Requires ≥1 SUPPORTED_BY Observation
- INV-03: REVEALS active only when status = mature (Activation Engine)

**What is absent and why:**

- `supportingCount` → Derived metric; computed by Derivation Engine from SUPPORTED_BY edges
- `subject` → Carried by REVEALS edges and supporting Observations
- `description` → Carried by associated Observations and Patterns

---

## Section 5 — Field Reference

### 5.1 Cross-Schema Field Patterns

**Typed Depth discriminators (Schema Law 01):**

| Field                         | Node          | Discriminator Values                                  |
| ----------------------------- | ------------- | ----------------------------------------------------- |
| `type`                        | Project       | APPLICATION, SYSTEM, LIBRARY, EXPERIMENTAL_PLATFORM   |
| `status`                      | Project       | ACTIVE, DORMANT, COMPLETED, ARCHIVED                  |
| `deployment.platform`         | Project       | RENDER, VERCEL, NETLIFY, SELF_HOSTED, NONE            |
| `repository.host`             | Project       | GITHUB, GITLAB, PRIVATE, NONE                         |
| `links[].type`                | Project       | DEMO, DOCUMENTATION, CASE_STUDY, WRITEUP, OTHER       |
| `type`                        | Constraint    | PLATFORM, TIME, KNOWLEDGE, LEGAL, RESOURCE, TECHNICAL |
| `status`                      | Experiment    | ACTIVE, PAUSED, COMPLETED, ABANDONED                  |
| `outcome`                     | Experiment    | INCONCLUSIVE, SUPPORTED, CONTRADICTED                 |
| `status`                      | Certification | ACTIVE, EXPIRED, REVOKED                              |
| `type`                        | Entity        | KNIGHT, FAIRY, ... (extensible)                       |
| `type`                        | Sector        | ARCHIVE, SIGNAL, ENGINE, RESEARCH, UNKNOWN            |
| `accessibility`               | Sector        | OPEN, SEALED, RESTRICTED                              |
| `observer.type`               | Observation   | INSPECTOR, ENTITY, ENGINE                             |
| `provenance.generatedBy.type` | Observation   | INSPECTOR, ENTITY, ENGINE                             |
| `provenance.collectionMethod` | Observation   | MANUAL, TRIGGERED, AMBIENT, SYSTEM_AUDIT, DERIVED     |
| `source`                      | Pattern       | AUTHORED, DERIVED                                     |

**Interpretation fields (survive Reconstruction Test):**

| Field         | Node                                               | Why It Survives                                    |
| ------------- | -------------------------------------------------- | -------------------------------------------------- |
| `summary`     | Project, Experiment, Constraint, Tradeoff, Sector? | Graph cannot recover intent                        |
| `hypothesis?` | Experiment                                         | Graph cannot recover pre-run thinking              |
| `rationale?`  | Tradeoff                                           | Graph cannot recover pre-outcome reasoning         |
| `statement?`  | Pattern                                            | Graph cannot recover specific authored abstraction |

**Computed fields (Derivation Engine owned):**

| Field        | Node                 | Computed From                    |
| ------------ | -------------------- | -------------------------------- |
| `strength`   | Pattern (DERIVED)    | DERIVED_FROM edge weights        |
| `confidence` | Discovery            | SUPPORTED_BY contribution values |
| `affinity`   | ASSOCIATED_WITH edge | Observation evidence             |

### 5.2 Required vs Optional Field Reference

**Always required (existence-level):**

- All `id` fields
- `Observation.primarySubject`, `.observer`, `.timestamp`, `.scope`
- `Certification.issuer`
- `Tradeoff.exchange`
- `Discovery.status`, `.confidence`

**Required for function (admissibility-level):**

- `Observation.provenance` (for truth formation participation)
- `Experiment.outcome` when `status = COMPLETED` (INV-04)

**Conditionally required (Typed Depth):**

- Subfields within discriminated types (e.g., `GITHUB` requires `owner`, `repo`)

---

## Section 6 — Schema Evolution Rules

### 6.1 What Can Change Without Migration

Per Governance Law 03 (additive evolution):

```
✓  Adding new enum value to existing discriminator
✓  Adding new optional field to any schema
✓  Adding new Typed Depth subfield to existing discriminator
✓  Extending extensible enum (Entity.type, Sector.type, Observation.type)
```

### 6.2 What Requires Constitutional Change Process

Per Governance Law 04:

```
✗  Making optional field required
✗  Removing existing field
✗  Changing enum value semantics (not just adding)
✗  Changing invariant thresholds (see INV-02 example in Doc 2)
✗  Adding required fields to existing nodes
```

### 6.3 Fields That May Never Be Removed

These fields are constitutionally foundational. Removing them breaks invariants, cascades, or core epistemological contracts.

```
Observation.provenance      Removes evidentiary admissibility mechanism
Observation.observer        Removes observer trust tier system
Discovery.status            Removes INV-03 trigger; REVEALS becomes permanently active
Discovery.confidence        Removes epistemic weight from knowledge formation
Pattern.source              Removes INV-02 conditional; breaks AUTHORED/DERIVED distinction
Tradeoff.exchange           Removes INV-06; removes Schema Law 09 compliance
Tradeoff.rationale          Removes only mechanism for preserving pre-outcome reasoning
Experiment.outcome          Removes INV-04 and INV-05 targets
Certification.issuer        Removes the constitutional requirement that makes it a Certification
```

---

_Doc 4 complete._
_Every schema here is smaller than it would have been without the laws._
_Every absent field has a tombstone in Doc 1._
_The compression was not laziness. It was honesty._

---

**Document Metadata**

- Architecture Sessions: F (F.0–F.4)
- Node schemas: 10
- Schema Laws applied: 01–05, 07–09
- Typed Depth instances: 17
- Interpretation fields (Reconstruction Test survivors): 4 nodes
- Fields that may never be removed: 9
- Invariant references: 7 (to Doc 3)
