# Observatory Architecture

## Doc 1 — Ontology + Relationship Catalog

**Status:** Locked  
**Sessions:** A · B · C (foundational)  
**Purpose:** Preserve discovered terrain. Protect Future Monster from rediscovery.

---

> This document records what was discovered, not what was designed.
> The distinction matters. Designed systems have reasons. Discovered systems have evidence.
> Everything here was pressure-tested before it was accepted.

---

## Section 0 — Constitutional Foundations

These principles existed before the nodes. They explain why the ontology has the shape it does. The nodes did not produce the principles. The principles determined which nodes survived.

Reading this section after Section 1 produces the wrong mental model.

---

### 0.1 The Observatory Existence Principle

> Things exist before they are discovered.

This is not a philosophical statement. It is a graph invariant.

A node may exist with zero Observations pointing at it. An Entity may be unwitnessed. A Sector may be uninhabited. A Pattern may be unencountered. None of these conditions make the node invalid.

**Consequence for schema:** nodes must contain enough truth to exist independently of their observation history.

**Consequence for Discovery:** `REVEALS` makes things known. It does not create them.

**Consequence for Explorer Mode:** hidden content is not absent content. It is unwitnessed content.

---

### 0.2 Fact / Finding Separation

> Observations are facts. Discoveries are findings.

These are different cognitive events with different graph representations and different epistemological status.

```
Observation     I witnessed something.
                Occurred. Historical. Immutable once recorded.

Discovery       I understood something.
                Interpreted. Confidence-bearing. Evolving.
```

A fact cannot be retracted. A finding can be challenged, weakened, or retracted — while the facts that supported it remain intact.

**Consequence:** Discovery.status may become `retracted`. The supporting Observations remain valid.

---

### 0.3 Singular vs Recurring Separation

> Discovery is a singular abstraction. Pattern is a recurring abstraction.

```
Discovery       "I learned X."          One conclusion from evidence.
Pattern         "X keeps being true."   Recurring conclusion from evidence.
```

A Discovery can be true after a single Observation. A Pattern fundamentally requires recurrence — without it, Pattern cannot exist by definition. This is ontological, not implementation.

**Consequence:** different evidence requirements, different metrics (confidence vs strength), different invariants.

---

### 0.4 Evidence vs Authority Distinction

> The Observatory has two epistemological pipelines. They must never merge.

```
Evidence-Originated Knowledge       Authority-Originated Knowledge
─────────────────────────────       ──────────────────────────────
Observation → Discovery → Pattern   Issuer → Certification

Authority emerges FROM evidence.    Authority exists BEFORE the claim.
Can be questioned internally.       Can only be recorded, verified, expired.
```

The internal pipeline does not trust itself because it is internal. It trusts itself because it earned the right through accumulated evidence.

**Consequence:** No internal engine (Validation, Derivation, Consistency) may generate a Certification. External authority remains external.

---

### 0.5 Causality Direction Rule

> Edges follow causality, not query convenience.

Storing edges in the direction most convenient for queries produces subtly incorrect graphs. The Observatory stores edges in causal direction and exposes inverse traversals as aliases where needed.

```
Canonical:  Constraint → AFFECTS → Project
Alias:      Project → CONSTRAINED_BY → Constraint  (traversal only)
```

**Consequence:** future query design must not change edge direction to suit traversal patterns.

---

### 0.6 The Node Necessity Test

A node is legitimate if and only if both directions hold:

```
Forward:    Node survives without its edges.    (independent meaning exists)
Reverse:    Edge does not survive without node.  (edge depends on node)
```

If a concept fails either direction, it is not a node — it is a relationship, a field, or an Observation type.

---

### 0.7 The Architectural Laws

Two laws govern the entire system. Everything else is application of these.

**Architectural Law 01:**

> If information can be represented more honestly as a relationship, the relationship wins.

The key word is _honestly_. Not compactly, not efficiently. Honestly.

**Architectural Law 02:**

> If authority can be represented more honestly as ownership, ownership wins.

Every time process was attempted — voting, committees, approval chains — the solution collapsed. Every time topology was used — ownership, consequence maps, authority domains — the solution stabilized.

---

## Section 1 — Ontology

### The Ten Core Node Types

Nodes are organized into four families. Family membership is structural, not merely categorical.

```
Content Registries      Project, Experiment, Certification
Decision Registries     Constraint, Tradeoff, Pattern
Observatory Registries  Entity, Sector
Truth Registries        Observation, Discovery
```

The 3-3-2-2 balance is diagnostic. Invented ontologies produce prime numbers of node types. Discovered ones produce symmetry.

---

### 1.1 Project

**Constitutional Definition:**

> The central work artifact. The thing that was built.

**Constitutional Purpose:**
A Project is affected by Constraints, embodies Tradeoffs, produces Observations, contains Discoveries, and reveals Patterns. It is the primary node of the Content family.

**Registry Owner:** ProjectRegistry

**Node Necessity Test:**

- Project survives without AFFECTS edges → yes, a project exists even without documented constraints
- AFFECTS does not survive without a Project → correct, the edge requires something that does the affecting

**What Project Explicitly Does Not Own:**

- Constraint objects, Tradeoff objects, Observation objects — stored by reference only
- Deployment consequences — owned by Graph Layer
- Discovery support — owned by DiscoveryRegistry
- Presentation priority (featured, highlighted) — owned by ViewModel Layer

**Compression History:**

- `researchObjective` field → compressed into summary + graph
- `audience` field on links → rejected (presentation disguised as content)
- EXPERIMENTAL_PLATFORM special registry participation → rejected (capability vs category confusion)

**Schema:**

```
Project {
    id
    name
    summary                    // Interpretation — prose, mode-neutral, no graph duplication

    type: APPLICATION | SYSTEM | LIBRARY | EXPERIMENTAL_PLATFORM
        APPLICATION             { uiSurface? }
        SYSTEM                  { consumers? }
        LIBRARY                 { apiSurface?, packageManager? }
        EXPERIMENTAL_PLATFORM   { investigationScope: extensible enum }

    status: ACTIVE | DORMANT | COMPLETED | ARCHIVED
        ACTIVE      { lastActivityAt }
        DORMANT     { dormantSince, revivalCondition? }
        COMPLETED   { completedAt }
        ARCHIVED    { archivedAt, archiveReason? }

    deployment?: {
        platform: RENDER | VERCEL | NETLIFY | SELF_HOSTED | NONE
        url?: string
        environment: PRODUCTION | STAGING | DEVELOPMENT
        // platform-specific depth per Typed Depth (Schema Law 01)
    }

    repository?: {
        host: GITHUB | GITLAB | PRIVATE | NONE
        // host-specific depth per Typed Depth
    }

    links?: [{
        type: DEMO | DOCUMENTATION | CASE_STUDY | WRITEUP | OTHER
        url: string
        label?: string
    }]
}
```

**Notes:**

- `type` = Category (enduring nature, changing it may change what the project IS)
- `status` = State (current condition, can change without changing project identity)
- `deployment` is an embedded domain object, not a registry node
- Observatory meaning is carried entirely by graph edges — Layer 4 is intentionally empty

---

### 1.2 Experiment

**Constitutional Definition:**

> A work artifact whose success criterion is learning, not delivery.

**Constitutional Purpose:**
Experiment is the only Work node evaluated by the Truth Layer rather than by the Work Layer. It authors a hypothesis, runs, and the graph determines whether it was right.

**Registry Owner:** ExperimentRegistry

**Node Necessity Test:**

- Experiment survives without Observation edges → yes, it can exist before running
- Observation does not require an Experiment to exist → correct, Observations are universal

**What Experiment Explicitly Does Not Own:**

- The evidence that evaluates it — owned by ObservationRegistry
- Learning outcomes — reflected in outcome field but evidenced by graph
- Observation production as a defining capability — any node may produce Observations

**Key Distinction:**
Experiment does not exist _because it produces Observations_. It exists _because it is evaluated by them_. Capability-driven vs purpose-driven. Schema Law 03 applies.

**Two Orthogonal State Machines:**

```
Execution State     Did the experiment run?
Conclusion State    What did we learn?
```

**Schema:**

```
Experiment {
    id
    name
    hypothesis?     // Interpretation — prospective, what we thought before
    summary         // Interpretation — retrospective, what this was

    category: extensible enum (shared with EXPERIMENTAL_PLATFORM investigationScope)

    status: ACTIVE | PAUSED | COMPLETED | ABANDONED
        PAUSED    { pausedSince, pauseReason? }
        COMPLETED { completedAt }
        ABANDONED { abandonedAt, abandonReason? }

    outcome?: INCONCLUSIVE | SUPPORTED | CONTRADICTED
}
```

**Domain Invariants:**

```
INV-04: status = COMPLETED → outcome must exist
INV-05: outcome = SUPPORTED → status must = COMPLETED
```

---

### 1.3 Certification

**Constitutional Definition:**

> A recorded external truth claim. Not an achievement earned internally — an assertion made by an external authority.

**Constitutional Purpose:**
Certification is the first node whose primary truth does not originate inside the Observatory. It introduces the authority-originated epistemological pipeline.

**Registry Owner:** CertificationRegistry

**Node Necessity Test:**

- Certification survives without verification edges → yes, AWS certified you regardless of whether the URL exists
- Verification reference does not survive without Certification → correct

**What Certification Explicitly Does Not Own:**

- Internal evidence — Certifications are not supported by Observations
- Derivation — no internal engine may generate a Certification
- Re-certification authority — belongs only to the original issuer

**Critical Field:**
`issuer` is not optional. A Certification without an issuer is not a Certification — it is an unverifiable claim. This is the constitutional distinction.

**Observed State (not Controlled State):**
Certification.status transitions are controlled by the external authority, not the Observatory. The Observatory observes and records. It does not adjudicate.

**Schema:**

```
Certification {
    id
    name
    summary?

    issuer: {
        name: string        // "AWS", "Google" — stable even if URLs change
    }
    awardedAt: timestamp
    expiresAt?: timestamp

    verification?: {        // Separate concern from issuer identity
        credentialId?: string
        verificationUrl?: string
    }

    status: ACTIVE | EXPIRED | REVOKED
        EXPIRED  { expiredAt: timestamp }
        REVOKED  { revokedAt: timestamp, revokedReason?: string }
}
```

---

### 1.4 Constraint

**Constitutional Definition:**

> A condition that restricts available decisions.

A Constraint exists when at least one otherwise-valid decision becomes unavailable, impractical, or disproportionately costly.

**Constitutional Purpose:**
Constraint narrows the decision space. It explains pressure. Everything downstream of a Constraint — Tradeoffs, architectural choices, project shapes — is influenced by it.

**Registry Owner:** ConstraintRegistry

**Node Necessity Test:**

- Constraint survives without AFFECTS edges → yes, "Render SMTP restriction" means something without knowing which projects it affects
- AFFECTS does not survive without Constraint → correct, something must do the affecting

**What Constraint Explicitly Does Not Own:**

- Severity — this is relationship territory or interpretation
- Impact — depends on what is affected, belongs to the edge or Tradeoff
- Scope — owned by consequence, not by the constraint itself

**Intentionally Sparse:**
Constraint may be the purest demonstration of Architectural Law 01. Most of its meaning lives in the relationships it participates in, not in its own fields.

**Schema:**

```
Constraint {
    id
    name
    summary

    type: PLATFORM | TIME | KNOWLEDGE | LEGAL | RESOURCE | TECHNICAL
        PLATFORM  { platform: string }
        TIME      { deadline?: timestamp }
        KNOWLEDGE { skillArea?: string }
        LEGAL     { jurisdiction?: string }
        RESOURCE  { limit?: string }
        TECHNICAL { }           // Category is sufficient — no depth needed
}
```

**Note on TECHNICAL:** The first Typed Depth category to intentionally terminate without subfields. A discriminator permits conditional subfields. It does not require them. The category name is constitutive.

---

### 1.5 Tradeoff

**Constitutional Definition:**

> The recorded acknowledgment of competing values consciously exchanged.

Three load-bearing words:

- **recorded** — it exists because someone wrote it down
- **acknowledged** — the sacrifice was recognized, not accidental
- **consciously** — unintended consequences are Observations, not Tradeoffs

**Constitutional Purpose:**
Tradeoff selects within the decision space that Constraint has narrowed. It embodies the judgment that was made.

**Registry Owner:** TradeoffRegistry

**What Tradeoff Explicitly Does Not Own:**

- Consequences — owned by graph (Observations, Discoveries)
- Alternatives considered — belongs in summary or Experiment
- Success metrics — owned by Discoveries
- Impact scores — relationship territory (rejected under Metric Test)

**Why rationale Survives:**
The Reconstruction Test: could a future Inspector reconstruct why this option felt reasonable _before the outcome was known_, from graph evidence alone? No. The rejected alternatives leave no graph trace. The reasoning existed once, in someone's head, at decision time. `rationale` is the Observatory's mechanism for refusing to lose it.

**The Exchange Structure (Schema Law 09):**
A tradeoff is not a value. It is a relationship between values. "Performance Tradeoff" — compared to what? Both sides must be explicit.

**Schema:**

```
Tradeoff {
    id
    name
    summary
    rationale?      // survives Reconstruction Test
                    // prose — captures reasoning before outcome was known
                    // the graph cannot recover pre-outcome reasoning

    exchange: {
        gained:     PERFORMANCE | SIMPLICITY | COST |
                    FLEXIBILITY | MAINTAINABILITY | RELIABILITY
        sacrificed: PERFORMANCE | SIMPLICITY | COST |
                    FLEXIBILITY | MAINTAINABILITY | RELIABILITY
    }
}

// INV-06: exchange.gained ≠ exchange.sacrificed
```

---

### 1.6 Pattern

**Constitutional Definition:**

> A recurring abstraction — a higher-order claim that something keeps proving true.

**Constitutional Purpose:**
Pattern represents the Observatory's ability to learn from recurrence. Not merely to notice it — to abstract it into a claim.

**Registry Owner:** PatternRegistry

**The Abstraction Principle:**

> Pattern is fundamentally about abstraction. Recurrence is the evidence, not the definition.

```
Recurrence alone:   cold starts occurred × 3     → not yet a Pattern
Pattern:            "Infrastructure constraints   → higher-order claim
                     repeatedly shape product
                     experience."
```

**What Pattern Explicitly Does Not Own:**

- `recurrence.context` — the graph already knows which nodes Pattern connects to
- `recurrence.subject` — redundant with name
- Observation references — owned by DERIVED_FROM edges, not by schema fields

**Two Sources, Different Constraints:**

```
AUTHORED    Declared intentionally. No evidence required.
            statement required. strength manually set.

DERIVED     Generated from evidence. Requires ≥1 Observation.
            statement optional. strength computed by Derivation Engine.
```

**Metric: strength, not confidence.**
Confidence asks: how certain are we? Strength asks: how consistently does this appear? These are different measurements. Mixing them would make Engineer Mode fuzzy.

**Schema:**

```
Pattern {
    id
    name
    statement?      // authored abstraction
                    // required for AUTHORED, optional for DERIVED
                    // survives Reconstruction Test — many abstractions
                    // can explain the same observations; the specific
                    // framing exists only because someone authored it

    source: AUTHORED | DERIVED
    strength: 0.0–1.0
}

// Conditional Invariant (first in the graph):
// INV-02: source = DERIVED → requires ≥1 DERIVED_FROM Observation
```

---

### 1.7 Entity

**Constitutional Definition:**

> An inhabitant of the Observatory. A presence, not a character.

**Constitutional Purpose:**
Entities are evidence of habitation. They appear, depart, leave traces, have affinities, and may themselves be witnesses. They are not NPCs. They are not furniture.

**Registry Owner:** EntityRegistry

**Node Necessity Test:**

- Entity survives without any Observations → yes, the Fairy exists before anyone sees her (Observatory Existence Principle)
- ASSOCIATED_WITH does not survive without Entity → correct

**What Entity Explicitly Does Not Own:**

- Movement — belongs to Observation
- Appearance history — belongs to Observation chain
- Affinity — belongs to ASSOCIATED_WITH edge
- Behavior — belongs to Observation
- Personality, biography, dialogue — not Observatory architecture

**Compression Result:**
Entity may be the most compressed node in the ontology. Dense graph presence. Tiny schema. Everything interesting lives elsewhere.

**Entity as Witness:**
observer field on Observation accepts `type: ENTITY`. Entities don't just appear — they notice things. Those noticings are Observations. Those Observations can support Discoveries. The entity-as-witness thread is a consequence of the Observation model.

**Schema:**

```
Entity {
    id
    name        // human-readable designator, not personality

    type: KNIGHT | FAIRY | ...   // extensible — Observatory may expand
                                 // no Typed Depth — graph owns behavior
}
```

**Note:** `type` not `archetype`. Archetype smuggles interpretation into truth through vocabulary. The field is constitutionally a Category discriminator. Consistency with Constraint.type, Project.type, etc.

---

### 1.8 Sector

**Constitutional Definition:**

> A named place in the Observatory with its own accessibility state.

**Constitutional Purpose:**
Sectors are where Observatory events occur. They have topology, affinity, and — unlike Entities — a physical accessibility state that the Observatory can control.

**Registry Owner:** SectorRegistry

**What Sector Explicitly Does Not Own:**

- Discovery state — Discovery controls awareness, not Sector
- Visibility — Activation Layer concern, rejected under Schema Law 02
- Entity locations — Entities associate with Sectors, they are not contained by them
- Observation history — owned by Observation graph

**Observed vs Controlled State:**
Certification introduced Observed State (externally controlled transitions). Sector introduces something different: Accessibility State — a place condition that remains true regardless of who is watching, and that the Observatory itself may control.

```
Hidden      → observer state (rejected)
Discovered  → observer state (rejected)
Sealed      → place state (survives)
Open        → place state (survives)
```

**Schema:**

```
Sector {
    id
    name
    summary?        // optional — intent the graph can't reconstruct yet

    type: ARCHIVE | SIGNAL | ENGINE | RESEARCH | UNKNOWN

    accessibility: OPEN | SEALED | RESTRICTED
        SEALED      { sealedAt: timestamp, sealReason?: string }
        RESTRICTED  { condition: string }
}

// INV-07: accessibility = SEALED
//         → New Observations may not OCCUR_IN this Sector
//         Historical OCCURRED_IN edges remain valid and immutable
```

---

### 1.9 Observation

**Constitutional Definition:**

> A recorded fact. Something that occurred.

The most important node in the Observatory. Not Project. Not Entity. Not Discovery.

Observation — because every truth claim eventually traces back to one.

**Constitutional Purpose:**
Observation is the foundation of the entire evidence architecture. Everything that claims to know something must cite an Observation or be marked as authored. The Observatory has no other mechanism for establishing truth.

**Registry Owner:** ObservationRegistry

**The Observation Constitution — Four Layers:**

```
Layer 1     Existence           Can this node legally exist?
Layer 2     Graph Admissibility Can this be queried and traversed?
Layer 3     Evidentiary         Can this support truth claims?
Layer 4     Interpretation      What does this mean in context?
```

**Article 1:**

> An Observation may exist without provenance, but it may not participate in truth formation without provenance.

```
Without provenance:     ✓ Exists   ✓ Queryable   ✓ Navigable
                        ✗ Supports Discovery
                        ✗ Supports Pattern
                        ✗ Contributes to Derivation

With provenance:        All of the above ✓
```

**Three Observer Types:**

```
Inspector   Intentional, human-directed. Highest interpretive authority.
Entity      Ambient, presence-triggered. Atmospheric, not analytical.
System      Structural, consistency-driven. Reports, never interprets.
```

**System Observations:**
Consistency violations become first-class Observations with `observer.type: ENGINE`. The Observatory observes itself through the same mechanism it uses to observe everything else. No side channel. No special event bus. One epistemic pipeline.

**Schema:**

```
Observation {
    // Layer 1: Existence
    id
    type    // Entity Appeared | Pattern Detected | Signal Witnessed |
            // Inspector Descended | consistency_violation_detected | ...

    // Layer 2: Graph Admissibility
    primarySubject          // the thing most directly witnessed
    observer: {
        type: INSPECTOR | ENTITY | ENGINE
        id: string
    }
    timestamp
    scope

    // Layer 3: Evidentiary Admissibility
    provenance: {
        origin
        collectionMethod: MANUAL | TRIGGERED | AMBIENT | SYSTEM_AUDIT | DERIVED
        generatedBy: {
            type: INSPECTOR | ENTITY | ENGINE
            id: string
            operation?: string      // ENGINE only — e.g. "INV-01_AUDIT"
        }
    }

    // Layer 4: Interpretation
    metadata
}
```

**Note:** `collectionMethod` must be an enum. PatternRegistry asks: "show recurring observations produced by SYSTEM_AUDIT." Free text destroys that query immediately.

---

### 1.10 Discovery

**Constitutional Definition:**

> A finding — a singular interpreted conclusion derived from observed evidence.

**Constitutional Purpose:**
Discovery bridges evidence and knowledge. It is the moment of understanding, not the moment of witnessing.

**Registry Owner:** DiscoveryRegistry

**Discovery vs Observation:**

```
Observation:    I witnessed the Fairy in the Signal Sector three times.
Discovery:      The Fairy likely originates from the Signal Sector.
```

Same evidence. Different cognitive act. Observations are facts. Discoveries are findings.

**The Discovery Lifecycle:**

```
evolving    Accumulating evidence. REVEALS edges inactive.
mature      Sufficient evidence. REVEALS edges active.
challenged  Confidence dropping. Revealed nodes marked uncertain.
retracted   REVEALS suspended. Node persists. Trust revoked.
```

**Invariant:**
Discovery requires at least one supporting Observation. Without this, Discovery becomes magic. The Observatory explicitly rejects magic masquerading as evidence.

**Schema:**

```
Discovery {
    id
    type
    confidence: 0.0–1.0     // epistemic claim strength
                             // assessment of conclusion, not of evidence
    status: evolving | mature | challenged | retracted
}

// INV-01: Discovery requires ≥1 SUPPORTED_BY Observation
```

---

## Section 2 — Relationships

### The Nine Core Relationships

Three classes. Nine edges. Clean taxonomy.

```
REFERENTIAL     Pure graph topology. Answer: Where? What?
                No payload. Static lifecycle. Owned by Graph Layer.

SEMANTIC        Carry meaning. Answer: Why? How strongly?
                Payload optional. Static or dynamic. Domain registry owned.

EVIDENTIARY     Justify truth claims. Answer: Why should I trust this?
                Payload required. Dynamic. Owned by justified node's registry.
```

**The Citation Test (applied to determine class):**

> Can I cite this edge independently of its nodes?

If yes → Evidentiary. If no → Referential or Semantic.

---

### 2.1 OBSERVED

```
Observation → OBSERVED → Node
```

| Property          | Value                                                                   |
| ----------------- | ----------------------------------------------------------------------- |
| Class             | Referential                                                             |
| Cardinality       | Many → Many                                                             |
| Payload           | None                                                                    |
| Lifecycle         | Static                                                                  |
| Owner             | Graph Layer                                                             |
| Semantic Contract | Records what entity or object was the primary subject of an Observation |

**Note:** `Node` here means any node type — Entity, Project, Constraint, Tradeoff, Pattern, Sector. Observation is universal in what it can witness.

---

### 2.2 OCCURRED_IN

```
Observation → OCCURRED_IN → Sector
```

| Property          | Value                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| Class             | Referential                                                                                         |
| Cardinality       | Many → One                                                                                          |
| Payload           | None                                                                                                |
| Lifecycle         | Static                                                                                              |
| Owner             | Graph Layer                                                                                         |
| Semantic Contract | Records where an Observation took place. Location becomes queryable rather than buried in metadata. |

**Why not metadata:** Explorer asks "where was this observed?" Engineer asks "where did this happen?" Discovery often depends on location. The edge makes location queryable. Metadata does not.

---

### 2.3 AFFECTS

```
Constraint → AFFECTS → Project
```

| Property          | Value                                                            |
| ----------------- | ---------------------------------------------------------------- |
| Class             | Semantic                                                         |
| Cardinality       | Many → Many                                                      |
| Payload           | None                                                             |
| Lifecycle         | Static                                                           |
| Owner             | ConstraintRegistry                                               |
| Semantic Contract | A Constraint changes the available decision space for a Project. |

**UI Alias:** `Project → CONSTRAINED_BY → Constraint` (traversal only — canonical direction is causal)

**Why no payload:** `severity` belongs to Constraint; `impact` depends on context; `scope` belongs to consequence. Edge carries the structural fact of the relationship.

---

### 2.4 RESPONSE_TO

```
Tradeoff → RESPONSE_TO → Constraint
```

| Property          | Value                                                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Class             | Semantic                                                                                                                              |
| Cardinality       | Many → Many                                                                                                                           |
| Payload           | None                                                                                                                                  |
| Lifecycle         | Static                                                                                                                                |
| Owner             | TradeoffRegistry                                                                                                                      |
| Semantic Contract | A Tradeoff exists because a Constraint existed. The tradeoff is a response; the constraint is not the generator. Agency is preserved. |

**Why RESPONSE_TO not GENERATED:** Constraints don't generate anything. Humans do. The graph preserves agency by placing the relationship on the Tradeoff, not the Constraint.

---

### 2.5 EMBODIED_BY

```
Tradeoff → EMBODIED_BY → Project
```

| Property          | Value                                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Class             | Semantic                                                                                                               |
| Cardinality       | Many → Many                                                                                                            |
| Payload           | `{ fidelity: 0.0–1.0 }`                                                                                                |
| Lifecycle         | Static                                                                                                                 |
| Owner             | TradeoffRegistry                                                                                                       |
| Semantic Contract | A Project becomes evidence of a Tradeoff decision. The Project does not merely link to the Tradeoff — it expresses it. |

**UI Alias:** `Project → EMBODIES → Tradeoff`

**Why payload survives:** Project A may _fully_ embody a tradeoff; Project B may _partially_ embody the same tradeoff. Fidelity describes the connection, not either endpoint. It passes the Payload Test.

**The Causality Triangle:**

```
Constraint → AFFECTS → Project
Tradeoff   → RESPONSE_TO → Constraint
Tradeoff   → EMBODIED_BY → Project
```

Engineer Mode query: "Show all projects embodying tradeoffs that responded to deployment constraints." One traversal. No hacks.

---

### 2.6 ASSOCIATED_WITH

```
Entity → ASSOCIATED_WITH → Sector
```

| Property          | Value                                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------------------ |
| Class             | Semantic                                                                                                     |
| Cardinality       | Many → Many                                                                                                  |
| Payload           | `{ affinity: 0.0–1.0 }`                                                                                      |
| Lifecycle         | Dynamic (stored)                                                                                             |
| Owner             | EntityRegistry                                                                                               |
| Semantic Contract | Represents meaningful affinity between an Entity and a Sector. Not physical location. Not current residence. |

**Why not LOCATED_IN:** Entities are presences, not furniture. The Knight is not located in the Archive Wing. The Knight is _affiliated_ with it. Entity movement is recorded as Observations, not as location state.

**Why affinity on the edge:** An Entity's connection to different Sectors varies in strength. Affinity describes the connection itself, not the Entity or the Sector independently. It passes the Payload Test.

**Explicit Non-Uses:**

- Movement → Observation (type: entity_appeared / entity_departed)
- Appearance → Observation
- Traces → Observation

---

### 2.7 REVEALS

```
Discovery → REVEALS → Node
```

| Property          | Value                                                          |
| ----------------- | -------------------------------------------------------------- |
| Class             | Semantic                                                       |
| Cardinality       | Many → Many                                                    |
| Payload           | None                                                           |
| Lifecycle         | Dynamic (derived from Discovery.status)                        |
| Owner             | DiscoveryRegistry (rule) + Graph Layer (materialization)       |
| Semantic Contract | Makes an existing node known to the observer. Does not create. |

**Allowed Targets:** Project, Experiment, Certification, Constraint, Tradeoff, Pattern, Entity, Sector

**Prohibited Targets:** Observation, Discovery

**Why prohibited:** Observations are already facts — they don't require discovery to exist. Discoveries revealing Discoveries creates infinite philosophical nesting. The Observatory has enough of that without building it in structurally.

**Rule ≠ Storage:**

- DiscoveryRegistry owns _when_ REVEALS becomes active (when status = mature)
- Graph Layer materializes the traversal path
- This is the first example of rule ownership and relationship storage being separated

**The Existence/Awareness Separation:**
A Pattern exists independently of any Discovery pointing at it. A hidden Pattern is unencountered, not absent. REVEALS changes awareness state, not existence state. This principle governs content strategy, hidden room design, and Engineer Mode truth guarantees simultaneously.

---

### 2.8 SUPPORTED_BY

```
Discovery → SUPPORTED_BY → Observation
```

| Property          | Value                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| Class             | Evidentiary                                                                                         |
| Cardinality       | Many → Many                                                                                         |
| Payload           | `{ contribution: 0.0–1.0, source: MANUAL \| DERIVED }`                                              |
| Lifecycle         | Dynamic                                                                                             |
| Owner             | DiscoveryRegistry                                                                                   |
| Semantic Contract | An Observation contributes evidence toward a Discovery. These observations support this conclusion. |

**Why evidentiary:** The Citation Test. Engineer Mode shows: "Discovery: Fairy Origin Located. Supported by: Observation #18, #22, #27." The observations are cited. The edge carries weight. It can be cited as evidence.

**Why owned by DiscoveryRegistry not ObservationRegistry:** Evidentiary edges are owned by the registry of the knowledge node they justify. The edge justifies the Discovery, not the Observation.

**`source` field:** Distinguishes Inspector manually linking evidence from the system deriving it. Engineer Mode will filter on this distinction.

**Invariant:**
Discovery requires ≥1 SUPPORTED_BY Observation (INV-01). Without this, Discovery becomes an ungrounded claim. The Observatory explicitly rejects those.

---

### 2.9 DERIVED_FROM

```
Pattern → DERIVED_FROM → Observation
```

| Property          | Value                                                                       |
| ----------------- | --------------------------------------------------------------------------- |
| Class             | Evidentiary                                                                 |
| Cardinality       | Many → Many                                                                 |
| Payload           | `{ weight: 0.0–1.0 }`                                                       |
| Lifecycle         | Dynamic                                                                     |
| Owner             | PatternRegistry                                                             |
| Semantic Contract | These observations collectively demonstrate recurrence toward this Pattern. |

**Why different from SUPPORTED_BY:**

- SUPPORTED_BY: these observations support this conclusion
- DERIVED_FROM: these observations collectively demonstrate recurrence
- Subtle difference. Worth preserving. Same evidence architecture, different semantic contract.

**Conditional Invariant (first in the graph):**

```
Pattern(source = DERIVED)   → requires ≥1 DERIVED_FROM Observation
Pattern(source = AUTHORED)  → requires 0
```

**Two Causal Structures (emergent):**

```
Evidence Chain              Decision Chain
──────────────              ──────────────
Observation                 Constraint
    ↓                           ↓
Discovery                   Tradeoff
                                ↓
"What is true?"             Project

                        "Why was this built this way?"
```

Both chains converge at Pattern — because derived Patterns can emerge from either.

---

## Section 3 — Knowledge Model

### How The Observatory Knows Things

The Observatory is not merely a graph. It is a knowledge system. This section defines the epistemological structure that makes it one.

---

### 3.1 The Evidence Pipeline

```
Observation → Discovery → Pattern
```

Each stage represents a different cognitive act:

```
Observation     Witnessing        "I saw something."          Fact
Discovery       Understanding     "I learned something."      Finding
Pattern         Abstracting       "This keeps being true."    Recurring claim
```

Each stage has different evidence requirements, different metrics, and different invariants.

---

### 3.2 Trust Hierarchy

```
Authored Truth      Highest trust. Created by registry authorship.
                    Subject to internal evidence for evaluation.

Observed Truth      High trust. Created by witnessing.
                    Immutable once recorded.

Modeled Truth       Medium trust. Derived from observations.
                    Confidence-bearing. Evolving.

Derived Truth       Computed trust. Generated by Derivation Engine.
                    Cannot author truth. May compute it.
```

**Operationally:**

```
Validation Engine     Guards authored truth
Activation Engine     Interprets current state
Consistency Engine    Audits modeled coherence
Derivation Engine     Computes derived truth
```

---

### 3.3 The Observation Constitution

See Schema in Section 1.9 for full structure. The constitutional principles:

**Article 1:**

> An Observation may exist without provenance, but it may not participate in truth formation without provenance.

**Article 2 (implicit):**

> The Observatory observes itself through the same mechanism it uses to observe everything else.

Consistency violations are first-class Observations. `observer.type: ENGINE`. No side channel. No special event bus.

---

### 3.4 Key Epistemological Tests

**Reconstruction Test:**

> Could a future Inspector reconstruct this honestly from the graph alone?

If yes → graph wins; remove the field.
If no → field may survive.

Applied to: `rationale` on Tradeoff (survives), `severity` on Constraint (rejected), `researchObjective` on Experiment (rejected).

**Citation Test:**

> Can I cite this edge independently of its nodes?

If yes → Evidentiary class.
If no → Referential or Semantic class.

**Metric Test:**

> If two values produce identical graph behavior, the metric is likely interpretation rather than truth.

Applied to: `confidence` on Tradeoff (rejected — no edges change), `severity` on Constraint (rejected).

**Field Costume Test:**

> Could this information be represented more honestly as a relationship?

If yes → suspect the field. Apply Architectural Law 01.

**Node Test (bidirectional):**

> Node survives without edges. Edge does not survive without node.

Both directions must hold for a node to be legitimate.

---

### 3.5 The Three-Category Field Model

Every field in every schema belongs to exactly one of:

```
Truth           Describes what a node IS.
                Changing it changes the node.
                Examples: status, type, deployment, exchange

Interpretation  Describes how a node is understood.
                Changing it changes explanation, not the node.
                Examples: summary, rationale, statement, hypothesis

Presentation    Describes how a node is surfaced.
                May NOT live inside domain registries.
                Examples: featured, priority, highlighted, audience
```

This model explains why `rationale` survived on Tradeoff while `severity` was rejected from Constraint. Both are authored prose. One changes understanding (interpretation). One changes nothing honest (presentation-adjacent, rejected).

---

## Section 4 — Architectural Decisions

### Discovered Operating Principles

These are not preferences or conventions. They are laws discovered under pressure. Each was resisted before it was accepted.

---

### 4.1 Architectural Laws

**Architectural Law 01:**

> If information can be represented more honestly as a relationship, the relationship wins.

The key word is _honestly_. Not compactly. Not efficiently. Honestly.

Evidence: Event compressed to Observation.type. EvidenceLink compressed to evidentiary edge. researchObjective compressed to summary + graph. Project meaning compressed to edges. Half the original schema is a compression record.

**Architectural Law 02:**

> If authority can be represented more honestly as ownership, ownership wins.

The governance equivalent of Law 01. Topology over procedure. Every time process was attempted (voting, committees, approval chains), the solution collapsed. Every time ownership and consequence maps were used, the solution stabilized.

---

### 4.2 Schema Laws

**Schema Law 01: Typed Depth**

> A field declares its category first. Category determines what additional structure is legal.

A discriminator permits conditional subfields. It does not require them. TECHNICAL on Constraint has no subfields — the category name is constitutive.

**Schema Law 02: Truth vs Presentation**

> Content fields describe truth. Presentation fields describe prioritization. Presentation metadata may not live inside domain registries.

Test: Could this field change without changing the truth of the node? If yes → presentation.

**Schema Law 03: Category vs Capability**

> Categories influence expectations. Categories do not grant capabilities.

EXPERIMENTAL_PLATFORM does not get special registry access. Any Project type may produce Observations. The graph owns capabilities. Categories own expectations.

**Schema Law 04: Truth / Interpretation / Presentation**

> Three distinct field categories. Never collapse them.

Truth → Interpretation → Presentation is a one-way hierarchy. Mixing categories produces drift and eventually disagreement between fields that were supposed to describe the same node.

**Schema Law 05: Category vs State**

> Category describes enduring nature. State describes current condition.

```
Changing type:      May change what the node IS (ontological)
Changing status:    Changes what condition the node is IN (lifecycle)
```

**Schema Law 06:** (promoted to Architectural Law 01)

**Schema Law 07: Self-Originated vs Externally-Originated Truth**

> Self-originated truth is subject to internal evidence. Externally-originated truth is subject only to the authority that issued it.

The Observatory may record, display, verify, and expire external truth claims. It may not derive, invalidate, certify, or re-certify them.

**Schema Law 08: Transient vs Terminal State**

> States may be transient or terminal.

```
Transient   Reversible: ACTIVE, DORMANT, PAUSED
Terminal    Irreversible: SUPPORTED, CONTRADICTED, EXPIRED, REVOKED
```

Not a new field category. A property of State. Experiment has two state machines: Execution (transient) and Conclusion (terminal).

**Schema Law 09: Explicit Relationship Modeling**

> When a concept is inherently relational, model both sides of the relationship explicitly.

A Tradeoff is not a value — it is a relationship between values. `exchange.gained` and `exchange.sacrificed` must both exist. "Performance Tradeoff" compared to what? One-sided declarations are incomplete relationships in disguise.

---

### 4.3 Registry Laws

**Registry Law 01: Dependency Is Not Authority**

> Dependency density and authority are orthogonal.

The registry most referenced is not the registry with highest authority. The registry most written is not the registry whose failure hurts most. Four distinct criticality dimensions: Dependency Density, Mutation Frequency, Authority Sensitivity, Blast Radius, Semantic Density.

**Registry Law 02: Failure Modes Matter More Than Components**

> A registry does not have a single blast radius. It has blast radii per failure mode.

```
ObservationRegistry write failure:      Medium blast radius
ObservationRegistry read failure:       Very High blast radius
ObservationRegistry corruption:         Catastrophic blast radius
```

Absence of evidence is recoverable. Incorrect evidence is not. The Observatory spent fifty sessions distinguishing these. Infrastructure must do the same.

---

### 4.4 Governance Laws

**Governance Law 01:**

> Every architectural change proposal declares its affected authority domains before it may be evaluated. Only those domains participate.

No senate. No committee. Only authorities whose consequences change.

**Governance Law 02:**

> No non-registry authority may author truth.

Derivation may compute. Activation may materialize. Neither may create or reclassify nodes. This law prevents authority creep — every large system eventually develops one helpful subsystem that starts making decisions on behalf of everyone else.

**Governance Law 03:**

> Schema evolution is additive by default. New versions extend what is legal. They do not invalidate what was true.

Applies to additive changes only: new enum values, new optional fields, new relationship types.

**Governance Law 04:**

> Architectural changes that alter legality are constitutional changes, not schema changes.

Test: does this change affect what is _legal_, or only what is _possible_? Possible expands → schema change. Legal redraws → constitutional change requiring explicit migration strategy.

**Governance Law 05:**

> Historical validity and current compliance are separate concepts.

```
Pattern P-17 created under Schema v1:
    Historical Validity:    ✓ Valid — fact, immutable
    Current Compliance:     ⚠ v3 Non-Compliant — evaluation, revisable
```

The Observatory does not rewrite history. It reevaluates it.

---

### 4.5 The Invariant Catalog

| ID     | Invariant                                                         | Type                    | Engine     | Crosses                                 |
| ------ | ----------------------------------------------------------------- | ----------------------- | ---------- | --------------------------------------- |
| INV-01 | Discovery requires ≥1 SUPPORTED_BY Observation                    | Existence               | Validation | DiscoveryRegistry ↔ ObservationRegistry |
| INV-02 | Pattern(source=DERIVED) requires ≥1 DERIVED_FROM Observation      | Existence (conditional) | Validation | PatternRegistry ↔ ObservationRegistry   |
| INV-03 | REVEALS active only when Discovery.status = mature                | Activation              | Activation | DiscoveryRegistry ↔ Graph Layer         |
| INV-04 | Experiment.status = COMPLETED → outcome must exist                | Existence               | Validation | ExperimentRegistry internal             |
| INV-05 | Experiment.outcome = SUPPORTED → status must = COMPLETED          | Existence               | Validation | ExperimentRegistry internal             |
| INV-06 | Tradeoff.exchange.gained ≠ exchange.sacrificed                    | Existence               | Validation | TradeoffRegistry internal               |
| INV-07 | Sector.accessibility = SEALED → New Observations may not OCCUR_IN | Existence               | Validation | SectorRegistry ↔ ObservationRegistry    |

**Critical note on INV-07:** Historical OCCURRED_IN edges remain valid and immutable. The Validation Engine blocks _creation_, never _history_. Facts do not disappear because a door was locked afterward.

---

### 4.6 The Cascade Law

> Cascades execute in descending authority order. Never reversed. Never parallelized across layers.

```
Validation → Activation → Consistency → Derivation
```

**Why this order:** The graph must never temporarily violate a higher-trust layer while updating a lower-trust layer. At every stage of a cascade, higher trust layers remain valid. Derived data may be stale temporarily. That is acceptable. Authored truth may never be inconsistent. That is required.

**Example — Discovery retraction cascade:**

```
Phase 1: Validation    Is retraction legal? If no, stop.
Phase 2: Activation    REVEALS immediately inactive. Graph stops making claims.
Phase 3: Consistency   Audit consequences. Emit findings. No mutations.
Phase 4: Derivation    Recompute Pattern strength, discovery counts, affinities.
```

---

## Appendix A — The Graveyard

_Every concept that was seriously considered and deliberately rejected. Each entry records what was learned from the rejection. Future Monster: read this before removing anything from the surviving schema._

---

### A.1 Event Node

**Admission reason:** Natural language uses "events" — Entity Appeared, Pattern Detected, Signal Witnessed. These seemed like a distinct category requiring a dedicated node.

**Pressure test applied:** Node Necessity Test (bidirectional)

**Rejection reason:** Event has no meaning independent of what is being observed. "Entity Appeared Event" is just Observation with type: entity_appeared. Removing Event from the ontology does not weaken any mode. Observation.type absorbs all semantic territory.

**Replacement:** `Observation.type` enum

**Lesson:** Natural language categories are not ontological categories.

---

### A.2 EvidenceLink Node

**Admission reason:** SUPPORTED_BY and DERIVED_FROM edges seemed to carry enough payload and identity to deserve node status. They looked like objects.

**Pressure test applied:** Node Test, Citation Test

**Rejection reason:** Nobody navigates to "Evidence Link #12." Nobody discovers it. Nobody discusses it independently. The thing being cited is always the Observation or the Discovery — not the link between them. A relationship becomes a node only if it can be independently discovered, navigated, or discussed. SUPPORTED_BY fails.

**Replacement:** Evidentiary Edge class with payload

**Lesson:** Edges that carry data are not automatically nodes. Identity requires navigability.

---

### A.3 REFERENCES Edge

**Admission reason:** Not every connection is causal, structural, observational, or discovery-based. Some things are simply "relevant." A weak semantic link seemed useful as a catch-all.

**Rejection reason:** When pressed to produce a query that requires REFERENCES and cannot be represented honestly through existing edges, none could be found. REFERENCES became a miscellaneous drawer — the place where architectures hide uncertainty.

**Replacement:** None needed. Existing nine edges cover all semantic territory.

**Lesson:** A catch-all edge is a sign of an incomplete edge taxonomy, not a feature.

---

### A.4 Deployment as Registry Node

**Admission reason:** Deployment information seemed important enough and complex enough to deserve its own node — platform, environment, URL, history.

**Rejection reason:** Nobody navigates to "Render" as an Observatory object. Deployment never appears independently. The entire concept exists only in relationship to a Project.

**Replacement:** Embedded domain object inside `Project { deployment: {...} }`

**Lesson:** Information that never appears independently is not a node.

---

### A.5 severity on Constraint

**Admission reason:** Some constraints are more severe than others. This seemed like important information.

**Rejection reason:** Severity is interpretation, not truth (Schema Law 04). The Metric Test: changing severity from HIGH to LOW changes no edges, no invariants, no traversals. Nothing structural changes. Additionally, the same SMTP constraint may be severe for one project and trivial for another — meaning it belongs on the relationship, not the constraint node.

**Replacement:** Would belong on the AFFECTS edge as payload, but even that failed scrutiny. The relationship carries the structural fact; severity lives in Tradeoff or Observation downstream.

**Lesson:** Importance scores are almost always interpretation disguised as truth.

---

### A.6 impact on Constraint / RESPONSE_TO

**Admission reason:** The impact of a constraint on a project seemed like crucial information.

**Rejection reason:** Impact depends entirely on what is affected. The same constraint may devastate one project and be irrelevant to another. Impact belongs to the thing affected (Tradeoff, Project) — not to the Constraint or the edge itself.

**Replacement:** Impact surfaces through Observation (what actually happened) and Tradeoff (what decision was made in response).

**Lesson:** Relational properties that vary by context belong to the relationship context, not to either endpoint.

---

### A.7 audience on Links

**Admission reason:** A case study link might be intended for Recruiter Mode; a technical architecture link for Engineer Mode. Encoding this intent in the link seemed useful.

**Rejection reason:** Schema Law 02. The Observatory Existence Principle applied to content: content does not vary by mode — presentation varies by mode. An `audience` field would make the same case study appear or disappear based on mode, turning modes into alternate realities rather than interpretations of the same truth. Ownership: ProjectRegistry owns truth. Mode selection owns presentation preference. Those are different authorities.

**Replacement:** Mode-specific weighting belongs to a ViewModel / Presentation Layer outside domain registries.

**Lesson:** Mode-awareness keeps attempting to enter content schema. Every time it tries, Schema Law 02 is the rejection mechanism.

---

### A.8 EXPERIMENTAL_PLATFORM Special Registry Participation

**Admission reason:** An experimental platform exists primarily to generate Observations. This seemed to warrant special registry participation or capabilities.

**Rejection reason:** Schema Law 03 (Category vs Capability). Every Project type may generate Observations — APPLICATION, SYSTEM, LIBRARY, EXPERIMENTAL_PLATFORM all equally. Observation production is not unique to any type. Giving EXPERIMENTAL_PLATFORM special registry access would effectively make it a hidden node subtype, eventually creating "class migration" problems when projects shift between types.

**Replacement:** `type: EXPERIMENTAL_PLATFORM` with `investigationScope` field. The expectation of Observation-heavy graphs is a presentation concern for Engineer Mode, not a schema capability.

**Lesson:** Giving a category special capabilities creates hidden inheritance trees. Categories influence expectations only.

---

### A.9 researchObjective on Experiment

**Admission reason:** An experiment should record what it was trying to achieve.

**Rejection reason:** Compression test. `researchObjective: "Explore cold-start mitigation"` and `summary: "An experimental platform exploring cold-start mitigation"` are the same sentence in different fields. One of them already has a home. Adding both creates duplication and eventual disagreement.

**Replacement:** `summary` (retrospective interpretation) and `hypothesis?` (prospective interpretation) already cover the semantic territory.

**Lesson:** Fields that mostly duplicate other fields are duplication disguised as richness.

---

### A.10 affectedLayer on TECHNICAL Constraint

**Admission reason:** Technical constraints affecting Runtime vs Network vs Database seemed meaningfully different.

**Rejection reason:** These contextualize the constraint rather than describing its nature. "Runtime" sounds like interpretation of where the constraint bites, not the constraint itself. The Payload Test: does this describe the relationship or one of the nodes? It describes neither — it describes an effect.

**Replacement:** None. TECHNICAL category stands alone without subfields. The category name is constitutive.

**Lesson:** Not every discriminator owes us subfields. Sometimes the category name is the entire truth claim.

---

### A.11 confidence on Tradeoff

**Admission reason:** Some tradeoffs feel more certain than others. "We reluctantly accepted this" vs "This was the obvious right call" seemed like important signal.

**Rejection reason:** The Metric Test. Changing `confidence` from 0.9 to 0.2 changes no edges, no invariants, no traversals, no legality. Nothing structural changes. That means it is interpretation (Schema Law 04), not truth. Furthermore, `rationale?` already captures certainty, hesitation, doubt, and enthusiasm through prose — with context preserved.

**Replacement:** `rationale?` field absorbs this in richer form.

**Lesson:** Numeric representations of human feelings are almost always interpretation. Prose preserves context that numbers discard.

---

### A.12 recurrence.subject and recurrence.context on Pattern

**Admission reason:** A Pattern claims something recurs — across what? In what form? Both sides seemed like they should be explicit (Schema Law 09).

**Rejection reason:** Field Costume Test. For DERIVED Patterns: traverse DERIVED_FROM → Observation → OBSERVED → Node. The context is already there. For AUTHORED Patterns: `recurrence.subject` would be identical to `name`. The field attempts to restate identity as structure. Architectural Law 01 wins.

**Replacement:** Graph traversal for DERIVED. `name` already covers AUTHORED subject.

**Lesson:** Sometimes Schema Law 09 (model both sides) and Architectural Law 01 (relationship wins) point in opposite directions. The relational structure of recurrence belongs in the graph, not in parallel schema fields.

---

### A.13 EvidenceLink as Node (second appearance)

**Second admission attempt:** After establishing evidentiary edges carry payload, the question reopened: if SUPPORTED_BY has `{ contribution, source }`, isn't it effectively an object?

**Second rejection:** The Citation Test, applied more carefully. Engineer Mode shows "Discovery: Fairy Origin Located. Evidence: Observation #18, #22, #27." The Observations are cited. The _edge_ is never cited independently. The payload enriches the relationship. It does not give the relationship independent identity. An object-sized edge is still an edge.

**Replacement:** Evidentiary edge class with rich payload. `SUPPORTED_BY { contribution: 0.0–1.0, source: MANUAL | DERIVED }`

**Lesson:** Payload does not imply identity. Rich edges are not nodes.

---

## Appendix B — Historical Discoveries

_Chronological record of the moments the architecture revealed something true about itself. Not decisions — discoveries. The distinction matters._

---

**D-01:** Event is Observation.type.
Realized during Session A when pressure-testing Event as an independent node. The Node Necessity Test failed in both directions for Event as a standalone concept.

**D-02:** Observation is not a content node — it is an evidence node.
Content nodes optimize for presentation. Observation optimizes for traceability, auditability, and provenance. Different optimization targets produce different schemas.

**D-03:** EvidenceLink is an edge, not a node.
The thing being cited in Engineer Mode is always the Observation, not the link between Observation and Discovery. Identity requires navigability.

**D-04:** The graph consistently steals responsibilities from fields.
As each schema was designed, fields that seemed necessary kept getting absorbed by graph relationships. By the end of Session F, every schema was smaller than expected. This was not compression — it was honesty.

**D-05:** Observation is the most important node in the Observatory.
Not Project. Not Discovery. Observation. Every truth claim traces back to one. The entire evidence architecture — Discovery confidence, Pattern strength, Consistency audits, Entity witnessing, self-observation — sits on top of whatever Observation is.

**D-06:** Movement belongs to Observation, not to Entity.
Entity is not furniture. Entity.location would make it furniture. Movement recorded as Observations creates evidence; movement stored as state creates a location database. These are different things.

**D-07:** The existence/awareness separation.
REVEALS does not create nodes. It makes existing nodes known. A Pattern exists before any Discovery points at it. Hidden content is unwitnessed, not absent. This governs content strategy, Explorer design, and Engineer Mode truth guarantees simultaneously.

**D-08:** The fact/finding separation.
Observations are facts. Discoveries are findings. This is not wordplay — it determines what can be retracted. Findings can be challenged. Facts cannot. The Discovery lifecycle exists because of this distinction.

**D-09:** Tradeoff.rationale survives the Reconstruction Test because some reasoning is genuinely unobservable.
The rejected alternatives in a decision never enter the graph. Only the chosen path survives. If rationale is not captured at decision time, it is lost. The Reconstruction Test revealed this; Architectural Law 01 would normally have removed the field.

**D-10:** The graph remains self-consistent under recursion.
When the Observatory's own epistemology (Observation → Discovery → Pattern) was applied to the Observatory architecture (architecture sessions → architectural discoveries → architectural patterns), the principles held without exception. Invented principles crack when applied to themselves. Discovered principles hold.

**D-11:** Dependency density and authority are orthogonal.
ObservationRegistry is throughput-critical. DiscoveryRegistry is authority-critical. ProjectRegistry is connectivity-critical. TradeoffRegistry is knowledge-density-critical. These are four different properties requiring four different infrastructure responses. A single "criticality" score would lie.

**D-12:** Governance emerges from ownership — it is not imposed on ownership.
The authority lattice runs Meaning → Ownership → Authority → Consequences → Governance. Inverting this direction produces committees. The correct direction produces topology.

**D-13:** Historical validity and current compliance are separate concepts.
The Observatory cannot retroactively deny the existence of a node created under a prior schema version. It can evaluate current compliance differently. This follows directly from the Observatory Existence Principle applied to its own schema evolution.

**D-14:** Session E accidentally protected ObservationRegistry write throughput before the throughput problem was identified.
The synchronous/reactive split (Validation synchronous; everything else reactive) was decided on authority grounds in Session E. Session G.1 discovered that this decision prevents ObservationRegistry's Very High mutation frequency from creating synchronous cascade bottlenecks. The principles protected the infrastructure before the infrastructure was considered.

---

_Doc 1 complete._
_Carve carefully. Future Monster is watching._

---

**Document Metadata**

- Architecture Sessions: A through G.1
- Core Nodes: 10
- Core Relationships: 9
- Schema Laws: 01–09
- Architectural Laws: 01–02
- Governance Laws: 01–05
- Registry Laws: 01–02
- Named Invariants: INV-01 through INV-07
- Graveyard Entries: 13
- Historical Discoveries: 14
