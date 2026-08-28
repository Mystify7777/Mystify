# Observatory Architecture
## Doc 2 — Registry Architecture Spec

**Status:** Locked  
**Sessions:** D · G · G.1  
**Depends on:** Doc 1  
**Purpose:** Define who owns what, under what authority, with what consequences.

---

> Ownership is not about storage location.
> Ownership is about semantic authority.
> The registry that owns a node is the registry allowed to define
> whether that thing exists and what it means.
> Everything else — display, traversal, derivation — is downstream.

---

## Section 0 — Constitutional Principles

### 0.1 The Registry Ownership Rule

> A registry owns truth about a node type.
> Not who displays it. Not who uses it. Not who references it.
> Only: who is allowed to define whether this thing exists and what it means.

This distinction is everything. Without it, registries begin mutating each other's nodes and the Observatory becomes a distributed argument.

### 0.2 The Registry Ownership Test

> If two registries disagree about a node, which registry's interpretation wins?

That registry owns it.

```
ProjectRegistry says:       HaloTask Pro is ACTIVE
DiscoveryRegistry says:     HaloTask Pro appears abandoned

Winner: ProjectRegistry
Reason: Discovery can observe. It cannot redefine.
```

```
ObservationRegistry says:   Observation O-41 exists
DiscoveryRegistry says:     Observation O-41 is weak evidence

Winner: ObservationRegistry
Reason: Discovery can interpret weight. It cannot deny existence.
```

Ownership = final semantic authority. Not storage. Not access. Not visibility.

### 0.3 Session G Law 01

> Ownership grants authority over meaning. Not authority over consequences.

**Corollary:**
> Consequences are owned by the layer responsible for enforcing them,
> regardless of which registry owns the node that triggered them.

This law explains every ownership decision in this document. Verify any edge case against it first.

### 0.4 Session G Law 02

> No non-registry authority may author truth.

Derivation may compute. Activation may materialize. Consistency may observe. None may create or reclassify nodes. This prevents authority creep — the slow process by which helpful subsystems start making decisions on behalf of everyone else.

---

## Section 1 — Registry Family Map

The ten domain registries fall into four families. Family membership reflects what kind of truth the registry is responsible for.

```
Content Registries          Decision Registries
──────────────────          ───────────────────
ProjectRegistry             ConstraintRegistry
ExperimentRegistry          TradeoffRegistry
CertificationRegistry       PatternRegistry

"What exists as work?"      "Why was it built this way?"


Observatory Registries      Truth Registries
──────────────────────      ────────────────
EntityRegistry              ObservationRegistry
SectorRegistry              DiscoveryRegistry

"What exists inside?"       "What is known?"
```

The 3-3-2-2 balance is diagnostic. The symmetry reflects discovered ontology, not designed structure.

---

## Section 2 — Node Ownership Map

One-to-one. No conflicts. No shared ownership.

| Node | Owner Registry | Family |
|---|---|---|
| Project | ProjectRegistry | Content |
| Experiment | ExperimentRegistry | Content |
| Certification | CertificationRegistry | Content |
| Constraint | ConstraintRegistry | Decision |
| Tradeoff | TradeoffRegistry | Decision |
| Pattern | PatternRegistry | Decision |
| Entity | EntityRegistry | Observatory |
| Sector | SectorRegistry | Observatory |
| Observation | ObservationRegistry | Truth |
| Discovery | DiscoveryRegistry | Truth |

**What ownership means per node:**
- Authority to create the node
- Authority to update the node's owned fields
- Authority to change the node's state
- Final say on whether the node exists

**What ownership does not mean:**
- Authority over edges that reference the node
- Authority over downstream computations triggered by the node
- Authority over how other registries interpret the node

---

## Section 3 — Relationship Ownership Map

Two principles govern all relationship ownership:

**Principle A (Semantic edges):**
> Semantic edges are owned by the registry of the source node.

**Principle B (Evidentiary edges):**
> Evidentiary edges are owned by the registry of the knowledge node they justify.
> Not the registry of the evidence node they cite.

**Principle C (Referential edges):**
> Referential edges belong to the Graph Layer.
> They are structural graph facts, not business logic.

---

### 3.1 Relationship Ownership Table

| Edge | Class | Owner | Ownership Principle |
|---|---|---|---|
| `OBSERVED` | Referential | Graph Layer | Structural graph fact |
| `OCCURRED_IN` | Referential | Graph Layer | Structural graph fact |
| `AFFECTS` | Semantic | ConstraintRegistry | Source node owns |
| `RESPONSE_TO` | Semantic | TradeoffRegistry | Source node owns |
| `EMBODIED_BY` | Semantic | TradeoffRegistry | Source node owns |
| `ASSOCIATED_WITH` | Semantic | EntityRegistry | Affinity is an Entity concept |
| `REVEALS` | Semantic | DiscoveryRegistry (rule) + Graph Layer (materialization) | Rule ≠ Storage |
| `SUPPORTED_BY` | Evidentiary | DiscoveryRegistry | Justifies Discovery |
| `DERIVED_FROM` | Evidentiary | PatternRegistry | Justifies Pattern |

---

### 3.2 The REVEALS Special Case

`REVEALS` is the only relationship where rule ownership and relationship storage are separated:

```
DiscoveryRegistry owns:     When REVEALS becomes active
                            (when Discovery.status = mature)
                            The rule governing visibility

Graph Layer owns:           The traversal path itself
                            The materialization of visibility
                            The edge when active
```

This is not an exception to the ownership model. It is the ownership model correctly applied. DiscoveryRegistry owns the *meaning* of REVEALS (when it activates). Graph Layer owns the *connectivity* (the traversal). These are different responsibilities.

**Implication:** If Discovery.status is queried by a renderer, the renderer asks DiscoveryRegistry. If a node connected via REVEALS is traversed, the traversal goes through Graph Layer.

---

## Section 4 — Layer Authority Model

Three architectural layers beyond the domain registries.

### 4.1 Graph Layer

**Owns:**
- All referential edges (OBSERVED, OCCURRED_IN)
- Traversal indexes
- Cross-registry connectivity
- REVEALS materialization (per DiscoveryRegistry rule)
- Relationship storage for all edge classes

**Does not own:**
- Node truth (domain registries)
- Rule enforcement (Invariant Layer)
- Computed values (Derivation Engine)

**Authority type:** Connectivity authority

---

### 4.2 Invariant Layer

Four engines with distinct authority types.

```
Validation Engine     Authoritative
                      Fires: BEFORE mutation
                      Authority: May block writes. Only engine that can.
                      Scope: Node + immediate required relationships

Activation Engine     Interpretive
                      Fires: AFTER state change
                      Authority: May change visibility state only
                      Scope: Node state + directly materialized edges

Consistency Engine    Advisory
                      Fires: AFTER commit / scheduled
                      Authority: May emit Observations only
                      Scope: Subgraph / registry boundary crossing

Derivation Engine     Computational
                      Fires: ON dependency change
                      Authority: May update computed fields only
                      Scope: Dependency chain (not topology graph)
```

**The Observatory Law:**
> Only the Validation Engine may prevent a graph mutation.

Everything else may interpret, report, compute, or materialize. Only Validation can say no.

**Session G Law 02 applied:**
No engine may author truth. Derivation updates `Pattern.strength` (computed field). It cannot create a Pattern node. Consistency emits violation Observations. It cannot archive a Project.

---

### 4.3 Read/Write Authority Table

| Layer | Read Authority | Write Authority |
|---|---|---|
| Domain Registry | Own node type | Own node type + owned edges |
| Graph Layer | All nodes + edges | Relationships only |
| Validation Engine | All (pre-commit) | None — blocks only |
| Activation Engine | Relevant state nodes | Materialized visibility only |
| Consistency Engine | All | Observation emission only |
| Derivation Engine | Dependency graph | Computed fields only |

**Critical constraint:** Nobody except domain registries writes authored truth. This was implicit throughout the architecture. It is explicit here.

---

## Section 5 — Cross-Registry Reference Rules

### 5.1 The Non-Ownership Rule

> No registry may directly own another registry's node.

ProjectRegistry stores Project truth. It references Constraint nodes, Tradeoff nodes, Observation nodes. It does not store them. Ownership does not transfer by reference.

```
Allowed:        ProjectRegistry stores reference to Constraint.id
Not allowed:    ProjectRegistry stores Constraint object inline
```

If a registry stored another registry's node, ownership would become recursive. Recursive ownership produces feudal architectures where nobody is sure who has final authority. The Observatory resolves this by making ownership strict and references explicit.

### 5.2 Cross-Registry Disagreement Protocol

When two registries hold apparently conflicting information:

1. Identify which registry owns the node in question
2. That registry's version is authoritative
3. The non-owning registry's interpretation is a reading of the truth, not a competing truth
4. Consistency Engine may emit an Observation noting the discrepancy
5. No automatic resolution occurs — human authorship resolves owned truth

```
Scenario:   DiscoveryRegistry confidence suggests Project is inactive
            ProjectRegistry status = ACTIVE

Resolution: ProjectRegistry wins on status.
            DiscoveryRegistry's confidence is an interpretation of evidence,
            not a competing status claim.
            Inspector may use Discovery evidence to update Project.status manually.
```

---

## Section 6 — Registry Topology Analysis

### 6.1 The Five-Score Model

Each registry is assessed across five dimensions. **These dimensions are orthogonal.** A single criticality score would lie by averaging them.

```
Dependency Density      How many other registries reference me?
Mutation Frequency      How often am I written?
Authority Sensitivity   How dangerous is incorrect data here?
Blast Radius            How much degrades if I fail?
                        (assessed per failure mode — see Section 6.3)
Semantic Density        How much meaning is lost when a single node disappears?
```

### 6.2 Registry Topology Table

| Registry | Dependency Density | Mutation Frequency | Authority Sensitivity | Semantic Density |
|---|---|---|---|---|
| ProjectRegistry | Very High | Low | Medium | Medium |
| ExperimentRegistry | Medium | Low | Medium | Medium |
| CertificationRegistry | Very Low | Very Low | Low | Low |
| ConstraintRegistry | Medium | Low | Medium | Medium |
| TradeoffRegistry | Low | Very Low | High | **Very High** |
| PatternRegistry | High | Medium | High | High |
| EntityRegistry | Medium | Low | Low | Low |
| SectorRegistry | Medium | Low | Medium | Medium |
| ObservationRegistry | **Very High** | **Very High** | High | Low |
| DiscoveryRegistry | High | Low | **Very High** | High |

### 6.3 Blast Radius — Per Failure Mode

Blast radius must be assessed per failure mode, not per registry. Registry Law 02.

**ObservationRegistry:**
```
Write failure       New observations stop arriving
                    Existing graph remains intact
                    Discovery, Pattern, Explorer continue on existing data
                    Blast Radius: MEDIUM

Read failure        Evidence chains become unqueryable
                    Discovery admissibility checks fail
                    Pattern derivation halts
                    Self-audit breaks
                    Blast Radius: VERY HIGH

Corruption          Incorrect evidence enters truth formation
                    Discovery confidence becomes unreliable
                    Pattern strength calculations become invalid
                    Engineer Mode data truth guarantee breaks
                    Blast Radius: CATASTROPHIC
```

**DiscoveryRegistry:**
```
Write failure       New discoveries cannot be formed
                    Existing visibility unchanged
                    Blast Radius: HIGH

Read failure        REVEALS traversal breaks
                    Explorer Mode loses discovery navigation
                    Engineer Mode loses knowledge graph
                    Blast Radius: VERY HIGH

Corruption          Visibility claims become incorrect
                    Hidden content may surface incorrectly
                    Retracted discoveries may appear active
                    Blast Radius: VERY HIGH
```

**ProjectRegistry:**
```
Write failure       New projects cannot be created
                    Blast Radius: MEDIUM

Read failure        Most graph traversals break (highest dependency density)
                    Content queries fail across all modes
                    Blast Radius: VERY HIGH

Corruption          Work identity becomes unreliable
                    Constraint and Tradeoff traversals produce wrong context
                    Blast Radius: HIGH
```

**TradeoffRegistry:**
```
Write failure       New tradeoffs cannot be recorded
                    Blast Radius: LOW (low mutation frequency)

Read failure        Decision chains become invisible
                    Engineer Mode loses "why was this built this way?" capability
                    Blast Radius: HIGH

Node loss           Single node loss may erase entire decision chain
                    No other node carries the pre-outcome reasoning
                    Blast Radius per lost node: VERY HIGH
                    (This is the Semantic Density problem — see below)
```

### 6.4 The Four Critical Registry Types

No registry dominates all five dimensions. The topology is healthy. When one component dominates every dimension simultaneously, it is usually called "the monolith."

```
Throughput Critical         ObservationRegistry
                            Highest write volume
                            Architecture must protect write path
                            Infrastructure response: write path isolation,
                            async cascade architecture

Authority Critical          DiscoveryRegistry
                            Controls visibility via REVEALS
                            Corruption propagates furthest into Explorer/Engineer
                            Infrastructure response: corruption detection,
                            audit priority, integrity validation

Knowledge Density Critical  TradeoffRegistry
                            Highest value-per-node ratio
                            Losing one node may lose an entire decision chain
                            No other mechanism recovers pre-outcome reasoning
                            Infrastructure response: backup frequency
                            disproportionate to write volume

Connectivity Critical       ProjectRegistry
                            Most referenced node type
                            Graph center of gravity
                            Infrastructure response: availability SLA,
                            graceful degradation paths
```

### 6.5 Semantic Density — The TradeoffRegistry Warning

Semantic density measures meaning lost per node lost. It is independent of mutation frequency.

```
100 lost Observations     may hurt less than
1 lost Tradeoff

Observations:   distributed meaning — many observations share explanatory load
Tradeoffs:      concentrated meaning — one node holds the entire reasoning chain
```

TradeoffRegistry has low mutation frequency (rarely written) and low volume (few nodes) but very high semantic density. These properties make it invisible to systems that track criticality by write volume. The correct infrastructure response is backup priority disproportionate to node count.

**The Backup Asymmetry:**
A daily backup of ObservationRegistry (thousands of nodes) may be less important than a per-write backup of TradeoffRegistry (tens of nodes). This is counterintuitive. It is correct.

---

## Section 7 — Infrastructure Doctrine

### 7.1 The Architectural Foresight Note

Session E (Invariant Architecture) decided on authority grounds that the Validation Engine fires synchronously and all other engines fire reactively. This decision accidentally protected ObservationRegistry write throughput before the throughput problem was identified.

```
Without this decision:
    Observation write
        → Validation (synchronous)
        → Discovery recalculation (synchronous)
        → Pattern recalculation (synchronous)
        → Consistency audit (synchronous)
        → Activation updates (synchronous)
    
    Single Fairy sighting requires half the Observatory to wake up synchronously.
    ObservationRegistry's Very High mutation frequency becomes catastrophic.

With this decision:
    Observation write
        → Validation (synchronous, blocking)
        → Commit
        → Everything else (reactive, non-blocking)
    
    Write path is protected. Cascade is asynchronous.
```

This is not a coincidence. It is evidence that the authority model and the infrastructure model are aligned. Principles that are correctly discovered tend to protect multiple concerns simultaneously.

### 7.2 Infrastructure Response Per Registry Type

| Registry Type | Primary Risk | Infrastructure Response |
|---|---|---|
| Throughput Critical | Write bottleneck | Write path isolation, async cascade |
| Authority Critical | Corruption propagation | Integrity validation, audit logging |
| Knowledge Density Critical | Silent node loss | Per-write backup, restore testing |
| Connectivity Critical | Cascading unavailability | High availability SLA, graceful degradation |

### 7.3 The Corruption vs Absence Distinction

The Observatory has spent its entire architecture distinguishing absence of evidence from incorrect evidence.

```
Absence:        "We don't know."        → degraded but honest
Corruption:     "We know X." (wrong)    → confident and lying
```

Infrastructure must treat these differently:

- ObservationRegistry write failure → degraded input. System continues on existing data. Alert.
- ObservationRegistry corruption → truth formation is compromised. Emergency. Halt trust claims.

The architecture built this distinction into the epistemology. Infrastructure must honor it.

---

## Section 8 — Consequence Map

The Consequence Map is the artifact that makes governance mechanical. Before any proposed change, open this map. The affected domains listed are the only participants required in the review.

This replaces committees with topology. Governance Law 01 in operational form.

### 8.1 Schema Element Consequence Map

| Schema Element | Owner | Consequence Domains |
|---|---|---|
| `Pattern.source` | PatternRegistry | Validation Engine (INV-02), Derivation Engine (strength) |
| `Pattern.strength` | PatternRegistry (authored) / Derivation Engine (computed) | PatternRegistry reads |
| `Discovery.status` | DiscoveryRegistry | Activation Engine (REVEALS), Graph Layer (materialization) |
| `Discovery.confidence` | DiscoveryRegistry | PatternRegistry (DERIVED_FROM weight interpretation) |
| `Observation.provenance` | ObservationRegistry | Validation Engine (admissibility), DiscoveryRegistry (SUPPORTED_BY weight) |
| `Sector.accessibility` | SectorRegistry | Validation Engine (INV-07), Graph Layer (OCCURRED_IN legality) |
| `Experiment.status` | ExperimentRegistry | Validation Engine (INV-04, INV-05) |
| `Experiment.outcome` | ExperimentRegistry | Validation Engine (INV-05) |
| `Tradeoff.exchange` | TradeoffRegistry | Validation Engine (INV-06) |
| `SUPPORTED_BY.contribution` | DiscoveryRegistry | Derivation Engine (confidence recalculation) |
| `DERIVED_FROM.weight` | PatternRegistry | Derivation Engine (strength recalculation) |
| `ASSOCIATED_WITH.affinity` | EntityRegistry | Derivation Engine (sector weighting) |
| `REVEALS` (activation) | DiscoveryRegistry (rule) | Graph Layer (materialization), Explorer Mode (visibility) |

### 8.2 How To Use This Map

**When proposing a change:**

1. Identify the schema element being changed
2. Find it in the Consequence Map
3. The Consequence Domains column lists every authority that must be consulted
4. If the change alters *legality* rather than *possibility* → constitutional change (Governance Law 04)
5. If the change is additive → schema change (Governance Law 03)

**Example — Proposal: Add `Pattern.source = EMERGENT`**

```
Schema element: Pattern.source
Owner: PatternRegistry
Consequence Domains: Validation Engine, Derivation Engine

Change type: additive (new enum value)
→ Schema change, not constitutional change
→ Governance Law 03 applies — automatic coexistence

Review participants: PatternRegistry, Validation Engine, Derivation Engine
NOT required: ConstraintRegistry, EntityRegistry, ProjectRegistry, etc.
```

**Example — Proposal: Change INV-02 from ≥1 to ≥2 Observations**

```
Schema element: INV-02 (invariant, not schema field)
Owner: Validation Engine (enforces) / PatternRegistry (affected)
Consequence Domains: PatternRegistry, ObservationRegistry, Derivation Engine

Change type: alters legality (existing DERIVED Patterns with 1 Observation become non-compliant)
→ Constitutional change, not schema change
→ Governance Law 04 applies — explicit migration strategy required
→ Historical validity preserved (Governance Law 05)
→ DERIVED Patterns with 1 Observation marked: historically valid / currently non-compliant

Review participants: All listed consequence domains + Governance Authority
```

---

## Section 9 — Migration Architecture

### 9.1 Schema Change vs Constitutional Change

| Change Type | Test | Protocol |
|---|---|---|
| Schema change | Does this extend what's possible without restricting what's legal? | Governance Law 03 — automatic coexistence |
| Constitutional change | Does this redraw legality for existing nodes? | Governance Law 04 — explicit migration strategy |

### 9.2 The Migration Window Model

For constitutional changes only. Four phases, no stop-world conversion.

```
Phase 1: ADDITIVE
    New schema declared
    New values/structures become legal
    Old structures remain valid as-is
    Both versions legally coexist

Phase 2: ACTIVE MIGRATION
    Derivation Engine recomputes affected nodes where possible
    Consistency Engine audits for upgrade candidates
    Registries may voluntarily upgrade authored nodes
    No forced conversion

Phase 3: DEPRECATION
    Old values marked deprecated
    Validation Engine warns on new deprecated value creation
    Existing deprecated nodes remain valid
    Read always valid

Phase 4: SUNSET (optional, deliberate)
    Governance Authority declares sunset date
    Deprecated value creation blocked
    Historical reads remain valid indefinitely
    History is never deleted
```

### 9.3 Historical Validity vs Current Compliance

Per Governance Law 05, these are permanently separate concerns.

```
Node created under Schema v1:
    Historical Validity:    ✓ Valid — existence is a fact, immutable
    Current Compliance:     ⚠ Non-Compliant — evaluation, revisable

Node behavior:
    Read:   Always valid regardless of compliance status
    Write:  May require compliance upgrade before modification
    Exist:  Cannot be denied — Observatory Existence Principle applies to schema
```

The Observatory does not rewrite history. It reevaluates it. The same principle that prevents Observations from being retroactively invalidated prevents nodes from being retroactively denied existence.

### 9.4 Governance Authority

Governance Authority is not a runtime system. It is a specification authority. It has no runtime power — it cannot block writes, compute values, or materialize edges.

**Governance Authority responsibilities:**
- Approve or reject constitutional change proposals
- Declare deprecation schedules
- Authorize sunset dates
- Maintain the Consequence Map
- Resolve cross-domain disputes about architectural intent

**Governance Authority composition:**
- Affected domain registry owners (per Consequence Map)
- No external participants required for schema changes
- Full authority lattice participants required for constitutional changes

**Why no committee for schema changes:**
Governance Law 01. Authority follows ownership. Schema changes that don't alter legality only require the affected domain owners. Adding `Pattern.source = EMERGENT` requires PatternRegistry, Validation Engine, and Derivation Engine. Not all registries. Not a senate.

---

## Appendix — Registry Quick Reference

### ProjectRegistry

**Owns:** Project nodes, AFFECTS edges, EMBODIED_BY edges (incoming), RESPONSE_TO edges (incoming via Tradeoff)  
**Critical type:** Connectivity  
**Primary risk:** Cascading unavailability  
**Backup priority:** High (high dependency density)  
**Notes:** Graph center of gravity. Most other registries reference Project nodes. Does not own Constraint or Tradeoff objects — references only.

---

### ExperimentRegistry

**Owns:** Experiment nodes  
**Critical type:** Standard  
**Primary risk:** Node loss before outcome is recorded  
**Backup priority:** Medium  
**Notes:** INV-04 and INV-05 are internal invariants (ExperimentRegistry only). First registry with domain invariants that do not cross registry boundaries.

---

### CertificationRegistry

**Owns:** Certification nodes  
**Critical type:** Standard  
**Primary risk:** Issuer verification link rot  
**Backup priority:** Low (very low mutation, very low volume)  
**Notes:** Only registry operating under the authority-originated epistemological pipeline. No internal evidence machinery applies. External authority is final.

---

### ConstraintRegistry

**Owns:** Constraint nodes, AFFECTS edges  
**Critical type:** Standard  
**Primary risk:** Silent loss of pressure context  
**Backup priority:** Medium  
**Notes:** Sparsest schema in the Decision Cluster. Most constraint meaning lives in relationships. Owns AFFECTS — the edge originates at Constraint.

---

### TradeoffRegistry

**Owns:** Tradeoff nodes, RESPONSE_TO edges, EMBODIED_BY edges  
**Critical type:** Knowledge Density  
**Primary risk:** Semantic node loss (pre-outcome reasoning lost forever)  
**Backup priority:** **Very High** (disproportionate to volume)  
**Notes:** Lowest mutation frequency in the Decision Cluster. Highest semantic density. One lost Tradeoff may erase an entire decision chain. Backup frequency should not be derived from write volume.

---

### PatternRegistry

**Owns:** Pattern nodes, DERIVED_FROM edges  
**Critical type:** Standard / Authority  
**Primary risk:** Incorrect derived strength values  
**Backup priority:** High  
**Notes:** First registry with conditional invariant (INV-02). AUTHORED Patterns require 0 evidence; DERIVED Patterns require ≥1. Owns DERIVED_FROM — evidentiary edge owned by the justified knowledge node's registry.

---

### EntityRegistry

**Owns:** Entity nodes, ASSOCIATED_WITH edges  
**Critical type:** Standard  
**Primary risk:** Affinity drift (ASSOCIATED_WITH values become stale)  
**Backup priority:** Low  
**Notes:** Smallest schema in the ontology. Densest graph presence. Everything interesting about entities lives in Observations, Discoveries, and edges — not in Entity schema fields.

---

### SectorRegistry

**Owns:** Sector nodes  
**Critical type:** Standard  
**Primary risk:** Accessibility state inconsistency  
**Backup priority:** Low  
**Notes:** First registry with Observed State + Controlled State coexisting. Accessibility is controlled (Observatory decides). History is observed (immutable). INV-07 prevents new Observations inside SEALED Sectors without retroactively invalidating historical ones.

---

### ObservationRegistry

**Owns:** Observation nodes, OBSERVED edges, OCCURRED_IN edges  
**Critical type:** Throughput  
**Primary risk:** Corruption (absence is recoverable; incorrect evidence is not)  
**Backup priority:** **Critical** for corruption detection; medium for write failure  
**Notes:** Highest mutation frequency. Foundation of entire evidence architecture. Write failure is degraded but recoverable. Corruption is catastrophic. Infrastructure must treat these as distinct failure modes. The Architectural Foresight decision (Session E synchronous/reactive split) protects this registry's write path.

---

### DiscoveryRegistry

**Owns:** Discovery nodes, SUPPORTED_BY edges, REVEALS edges (rule)  
**Critical type:** Authority  
**Primary risk:** REVEALS corruption (incorrect visibility claims)  
**Backup priority:** High  
**Notes:** Highest authority sensitivity. Controls what is visible in Explorer Mode via REVEALS. Corruption propagates furthest into user-facing surfaces. Owns SUPPORTED_BY — evidentiary edge owned by the justified knowledge node's registry, not the evidence source's registry.

---

*Doc 2 complete.*
*The map has boundaries. The boundaries have owners. The owners have authority. The authority has limits. Everything beyond those limits belongs to a different registry, a different layer, or the Graph.*

---

**Document Metadata**
- Architecture Sessions: D · G · G.1
- Domain Registries: 10
- Architectural Layers: 3 (Graph, Invariant, Governance)
- Ownership Principles: 3
- Registry Laws: 2
- Governance Laws: 5
- Infrastructure Doctrine entries: 3
- Consequence Map entries: 13
- Migration phases: 4
