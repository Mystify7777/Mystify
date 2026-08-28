# Observatory Architecture

## Doc 3 — Invariant Spec

**Status:** Locked  
**Sessions:** E  
**Depends on:** Doc 1, Doc 2  
**Purpose:** Define what the Observatory refuses to allow, who enforces it, and what happens when it fires.

---

> An invariant is not a validation rule.
> A validation rule asks: is this data well-formed?
> An invariant asks: would allowing this make the system lie?
> The Observatory enforces invariants. Not validation rules.
> The difference matters at 2AM when something breaks.

---

## Section 0 — Constitutional Principles

### 0.1 The Observatory Law

> Only the Validation Engine may prevent a graph mutation.

Everything else may interpret, report, compute, or materialize. Only the Validation Engine can say no.

This law prevents a specific failure mode: the Consistency Engine, having found a warning, begins rejecting writes. Or the Derivation Engine, having computed something, begins blocking mutations it disagrees with. These are exactly the architectural accidents that create mysterious behavior six months later.

**Enforcement:** Architectural invariant. Not configurable.

### 0.2 The Invariant Taxonomy

Not all invariants are the same species. Treating them as one produces enforcement engines that are either too strict or too permissive depending on which kind of invariant they are currently processing.

| Class           | Question                           | Timing      | Response            | Severity               |
| --------------- | ---------------------------------- | ----------- | ------------------- | ---------------------- |
| **Existence**   | Can this thing legally exist?      | Synchronous | Reject              | Critical               |
| **Activation**  | Can this thing currently function? | Runtime     | Activate/Deactivate | None — not a violation |
| **Consistency** | Is the graph internally coherent?  | Deferred    | Violation Event     | Warning or Error       |
| **Derivation**  | Is derived data still valid?       | Recompute   | Repair              | Informational          |

### 0.3 Existence vs Activation

The most important distinction in the taxonomy:

```
Existence violation:    The node is lying about what it is.
                        → Reject. No warning. No compromise. No degraded state.

Activation non-violation: The node is in a state.
                        → Not an error. Not a failure. Physics.
```

Calling INV-03 a "violation" would be a category error. REVEALS being inactive when Discovery.status = evolving is not wrong. It is correct behavior. The engine that handles it does not fire violations — it fires switches.

### 0.4 The Cascade Law

> Cascades execute in descending authority order.
> Never reversed. Never parallelized across layers.

```
Validation → Activation → Consistency → Derivation
```

The graph must never temporarily violate a higher-trust layer while updating a lower-trust layer. At every stage of a cascade, higher trust layers remain valid. Derived data may be stale temporarily. That is acceptable. Authored truth may never be inconsistent. That is required.

---

## Section 1 — The Four Engines

### 1.1 Validation Engine

**Role:** Authoritative  
**Authority:** Veto — may block any graph mutation  
**Trigger:** BEFORE mutation (synchronous, blocking)  
**Scope:** Node + immediate required relationships  
**Write access:** None — blocks only, does not modify

**What it enforces:**

- Existence invariants (INV-01, INV-02, INV-04, INV-05, INV-06, INV-07)
- Conditional invariants (source-dependent rules)
- Schema law enforcement (Typed Depth legality, field ownership)

**What it does not do:**

- Compute derived values
- Emit advisory observations
- Make architectural decisions
- Change visibility state

**Authority relationship with registries:**
Registries ask the Validation Engine for permission before committing a write. The engine either approves or rejects. There is no partial approval.

---

### 1.2 Activation Engine

**Role:** Interpretive  
**Authority:** None — may not block mutations  
**Trigger:** AFTER state change (event-driven, non-blocking)  
**Scope:** Node state + directly materialized edges  
**Write access:** Materialized visibility state only

**What it handles:**

- Activation invariants (INV-03)
- REVEALS edge materialization based on Discovery.status
- Any future state-dependent visibility rules

**What it does not do:**

- Block writes
- Emit violation observations
- Create nodes
- Change authored truth

**Critical distinction:**
The Activation Engine changes what is _visible_. It does not change what _exists_. A REVEALS edge that becomes inactive does not remove the target node — it removes the traversal path to it. The node persists. The Observatory Existence Principle is never violated.

**Authority relationship with registries:**
Registries notify the Activation Engine when state changes. The engine responds by updating materialized visibility. Registries do not block waiting for the response.

---

### 1.3 Consistency Engine

**Role:** Advisory  
**Authority:** None — may not block mutations  
**Trigger:** AFTER commit OR scheduled audit  
**Scope:** Subgraph / registry boundary crossing  
**Write access:** Observation emission only

**What it handles:**

- Cross-registry coherence checks
- Timestamp ordering violations
- Scope compatibility checks
- Self-referential graph audits

**What it does not do:**

- Reject writes
- Archive nodes
- Change node state
- Override registry-owned truth

**The self-observation model:**
Consistency violations become first-class Observations:

```
Observation {
    type: consistency_violation_detected
    observer: { type: ENGINE, id: consistency-engine, operation: [specific audit] }
    primarySubject: [affected node]
    timestamp: [detection time]
    provenance: { collectionMethod: SYSTEM_AUDIT, generatedBy: { type: ENGINE } }
}
```

The Observatory observes itself through the same mechanism it uses to observe everything else. No side channel. No special event bus. One epistemic pipeline.

**Loop prevention:**
Observations where `observer.type = ENGINE` are exempt from triggering further Consistency Engine audits. One exemption rule. The regress is sealed.

**Authority relationship with registries:**
Registries are _observed_ by the Consistency Engine. They are not consulted. The engine watches graph state after mutations complete and independently issues advisory Observations.

---

### 1.4 Derivation Engine

**Role:** Computational  
**Authority:** None — may not block mutations  
**Trigger:** ON dependency change (reactive)  
**Scope:** Dependency chain (not topology graph)  
**Write access:** Computed fields only

**What it handles:**

- Pattern.strength computation from DERIVED_FROM edge weights
- Discovery.supportingCount (derived metric)
- ASSOCIATED_WITH.affinity updates from Observation evidence
- Any future computed field that derives from graph state

**What it does not do:**

- Create nodes
- Change authored truth (rationale, statement, name, type, status)
- Block writes
- Override registry ownership

**Computed vs authored truth:**
The Derivation Engine may update `Pattern.strength` (computed). It may not decide whether a Pattern exists (authored). Computational authority and truth authority are not the same thing. Conflating them is how Derivation Engines become the most dangerous file in the repository.

**Authority relationship with registries:**
Registries are _sources_ for the Derivation Engine. The engine reads from them reactively and writes back computed values. This is the only bidirectional relationship in the authority model.

---

## Section 2 — Invariant Catalog

### INV-01

**Name:** Discovery Evidence Requirement  
**Class:** Existence  
**Engine:** Validation  
**Trigger:** Attempt to create Discovery without SUPPORTED_BY edge, or attempt to remove last SUPPORTED_BY edge from existing Discovery

**Rule:**

> Discovery requires ≥1 SUPPORTED_BY Observation.

**Scope:** DiscoveryRegistry ↔ ObservationRegistry

**Response on violation:** Write rejected. Discovery may not exist without evidence.

**Why this exists:**
Without this invariant, Discovery becomes an ungrounded claim — a conclusion without evidence. The Observatory explicitly rejects magic masquerading as evidence. A Discovery without supporting Observations is exactly that.

**Invariant text:**

```
IF CREATE Discovery
AND COUNT(Discovery.SUPPORTED_BY) = 0
THEN REJECT
```

---

### INV-02

**Name:** Derived Pattern Evidence Requirement  
**Class:** Existence (conditional)  
**Engine:** Validation  
**Trigger:** Attempt to create Pattern(source=DERIVED) without DERIVED_FROM edge

**Rule:**

> Pattern(source=DERIVED) requires ≥1 DERIVED_FROM Observation.
> Pattern(source=AUTHORED) requires 0.

**Scope:** PatternRegistry ↔ ObservationRegistry

**Response on violation:** Write rejected for DERIVED Patterns without evidence. AUTHORED Patterns always pass.

**The conditional invariant:**
This is the first conditional invariant in the graph. The rule applies based on the value of a field (`source`), not universally. This pattern will likely recur.

**Why AUTHORED is exempt:**
An authored Pattern declares a claim intentionally. The author asserts it from experience, without requiring graph evidence. This is valid. Architectural Law 01 does not apply — some knowledge genuinely cannot be derived from graph evidence.

**Invariant text:**

```
IF CREATE Pattern
AND Pattern.source = DERIVED
AND COUNT(Pattern.DERIVED_FROM) = 0
THEN REJECT
```

---

### INV-03

**Name:** Discovery Visibility Gate  
**Class:** Activation  
**Engine:** Activation  
**Trigger:** Discovery.status changes

**Rule:**

> REVEALS edges are active only when Discovery.status = mature.

**Scope:** DiscoveryRegistry ↔ Graph Layer

**Response on trigger:**

```
Discovery.status → mature:      REVEALS edges materialize (visible)
Discovery.status → any other:   REVEALS edges dematerialize (invisible)
```

**NOT a violation:**
Status transitions are not errors. A Discovery moving from `evolving` to `mature` to `challenged` is behaving correctly. The Activation Engine switches visibility. It does not record failures.

**Why this is Activation, not Existence:**
The Discovery still exists in every state. Nothing is invalid. The engine interprets current state and controls visibility. That is categorically different from blocking an illegal write.

---

### INV-04

**Name:** Completed Experiment Outcome Requirement  
**Class:** Existence  
**Engine:** Validation  
**Trigger:** Attempt to set Experiment.status = COMPLETED while outcome is null

**Rule:**

> If Experiment.status = COMPLETED then Experiment.outcome must exist.

**Scope:** ExperimentRegistry (internal — does not cross registry boundaries)

**Response on violation:** Write rejected. A completed experiment must record what was learned.

**Why this exists:**
An experiment that ran to completion without recording an outcome has lost its primary value. The purpose of an Experiment is learning. Completion without outcome is ontologically incomplete — the node claims to be done but has not fulfilled its constitutional purpose.

**Invariant text:**

```
IF SET Experiment.status = COMPLETED
AND Experiment.outcome IS NULL
THEN REJECT
```

---

### INV-05

**Name:** Supported Experiment Completion Requirement  
**Class:** Existence  
**Engine:** Validation  
**Trigger:** Attempt to set Experiment.outcome = SUPPORTED while status ≠ COMPLETED

**Rule:**

> If Experiment.outcome = SUPPORTED then Experiment.status must = COMPLETED.

**Scope:** ExperimentRegistry (internal)

**Response on violation:** Write rejected. A supported hypothesis requires the experiment to have run to completion.

**Why not "ABANDONED requires null outcome":**
The original candidate was stricter. Pressure test revealed: an experiment abandoned because it clearly disproved the hypothesis may legitimately have outcome = CONTRADICTED. An experiment abandoned with insufficient signal may have outcome = INCONCLUSIVE. ABANDONED does not require null outcome.

What IS required: outcome = SUPPORTED is the strongest possible claim. That claim requires the experiment to have completed. Partial runs cannot produce SUPPORTED conclusions.

**Invariant text:**

```
IF SET Experiment.outcome = SUPPORTED
AND Experiment.status ≠ COMPLETED
THEN REJECT
```

---

### INV-06

**Name:** Tradeoff Exchange Validity  
**Class:** Existence  
**Engine:** Validation  
**Trigger:** Attempt to create or update Tradeoff with equal exchange values

**Rule:**

> Tradeoff.exchange.gained ≠ Tradeoff.exchange.sacrificed.

**Scope:** TradeoffRegistry (internal)

**Response on violation:** Write rejected. An exchange of X for X is not a tradeoff.

**Why this exists:**
A Tradeoff is a relationship between values. If the gained and sacrificed values are identical, no exchange occurred. The node would misrepresent what happened — claiming a conscious exchange that was actually a null operation.

**First intra-field invariant:**
INV-06 applies constraints within a single field structure, not between nodes or relationships. This is the most local invariant in the catalog.

**Invariant text:**

```
IF CREATE OR UPDATE Tradeoff
AND Tradeoff.exchange.gained = Tradeoff.exchange.sacrificed
THEN REJECT
```

---

### INV-07

**Name:** Sealed Sector Observation Block  
**Class:** Existence  
**Engine:** Validation  
**Trigger:** Attempt to create Observation with OCCURRED_IN targeting a SEALED Sector

**Rule:**

> New Observations may not OCCUR_IN a SEALED Sector.
> Historical OCCURRED_IN relationships remain valid and immutable.

**Scope:** SectorRegistry ↔ ObservationRegistry

**Response on violation:** Write of new Observation rejected if target Sector is SEALED.

**Critical temporal constraint:**
This invariant is strictly prospective. It blocks creation of new Observations. It does not retroactively invalidate Observations that occurred before the Sector was sealed.

```
2026-04-01  Signal Archive is OPEN
            Observation A → OCCURRED_IN → Signal Archive  (valid, permanent)
            Observation B → OCCURRED_IN → Signal Archive  (valid, permanent)

2026-05-01  Signal Archive becomes SEALED

2026-05-02  Observation C → OCCURRED_IN → Signal Archive  (REJECTED by INV-07)
```

**Why historical observations are immutable:**
Observations are facts. Facts do not disappear because a door was locked afterward. The Observatory never rewrites history. The Validation Engine blocks creation. It does not block history.

**Invariant text:**

```
IF CREATE Observation
AND Observation.OCCURRED_IN → Sector
AND Sector.accessibility = SEALED
THEN REJECT
```

---

## Section 3 — Cascade Scenarios

### 3.1 Discovery Retraction

The most complex cascade in the Observatory. Touches all four engines.

**Initial state:**

```
Observation A, B, C
    SUPPORTED_BY ↓
Discovery D (status: mature)
    REVEALS ↓
Pattern P, Sector X, Entity Y
```

**Trigger:** Discovery D status changed to `retracted`

**Cascade execution (must follow this order):**

```
Phase 1 — Validation Engine
    Is retraction a legal operation?
    Check: Does anything block Discovery.status = retracted?
    Result: No blocking invariants. Proceed.
    Duration: Synchronous

Phase 2 — Activation Engine
    Discovery.status changed → retracted
    INV-03 triggers: REVEALS edges dematerialize
    Pattern P, Sector X, Entity Y: no longer reachable via this Discovery
    Graph stops making visibility claims based on retracted Discovery
    Duration: Event-driven, fast

Phase 3 — Consistency Engine
    Audit consequences:
    - Pattern P: still supported by other Discoveries? Emit observation.
    - Are any downstream nodes now orphaned (no active Discovery reveals them)?
    - Are there Observations still pointing at Discovery D? Note for Inspector.
    No mutations. Advisory only.
    Duration: Deferred

Phase 4 — Derivation Engine
    Recompute:
    - Pattern.strength (evidence profile changed)
    - Discovery.supportingCount for related Discoveries
    - ASSOCIATED_WITH.affinity if entity evidence changed
    Duration: Reactive, dependency-chain only
```

**What the Inspector sees:**

- Discovery D: status = retracted
- REVEALS edges: inactive
- Pattern P, Sector X, Entity Y: still exist, may be reached via other Discoveries
- Consistency observations: advisory notes about downstream effects
- Pattern strength: recomputed

**What was NOT changed:**

- Observations A, B, C: remain valid facts
- Pattern P: still exists, not invalidated
- Sector X, Entity Y: still exist, not removed

---

### 3.2 Sector Sealing

**Trigger:** Sector.accessibility changed to SEALED

```
Phase 1 — Validation
    Is sealing legal? No blocking invariants. Proceed.

Phase 2 — Activation
    State change recorded. No REVEALS implications (Sector has no REVEALS edges).
    INV-07 now active for this Sector.

Phase 3 — Consistency
    Audit: Any active Entity ASSOCIATED_WITH this Sector at high affinity?
    Emit advisory observation if entities may be affected.

Phase 4 — Derivation
    No immediate derived value changes.
    Future ASSOCIATED_WITH affinity updates for this Sector are blocked
    (new Observations cannot OCCUR_IN a SEALED Sector, so no new evidence
    for affinity derivation).
```

---

### 3.3 New Observation (Routine)

**Trigger:** Observation created with full provenance

```
Phase 1 — Validation
    Check admissibility: primarySubject, observer, timestamp, scope present?
    Check evidentiary: provenance present?
    Check INV-07: target Sector SEALED?
    If all pass: commit.

Phase 2 — Activation
    No state changes triggered by Observation creation alone.
    (Activation fires on status changes, not creation events)

Phase 3 — Consistency
    Not triggered for routine Observation creation.
    Scheduled audits may eventually include this Observation.

Phase 4 — Derivation
    If Observation is SUPPORTED_BY a Discovery:
        Discovery.supportingCount increments
    If Observation is DERIVED_FROM a Pattern:
        Pattern.strength recomputes
    If Observation is OBSERVED → Entity:
        ASSOCIATED_WITH.affinity may update for that Entity
```

**Why this cascade is lightweight:**
Session E's decision to make only Validation synchronous means creating an Observation is a fast operation. The Fairy appearing in a sector does not synchronously trigger Pattern recalculation across the entire Observatory.

---

## Section 4 — Invariant Governance

### 4.1 Adding New Invariants

Adding a new existence invariant is a **constitutional change** (Governance Law 04). It redraws legality.

**Required process:**

1. Identify which nodes/edges the invariant spans
2. Open Consequence Map for affected schema elements
3. Notify all consequence domains
4. Assess: do existing nodes comply?
5. If not: create migration strategy before activating invariant
6. Document new invariant in this spec

**Adding a new activation invariant:**
Simpler. Does not alter legality — changes behavior. Schema change process applies (Governance Law 03).

### 4.2 Modifying Existing Invariants

Modifying an existence invariant (e.g., changing INV-02 threshold from ≥1 to ≥2) is always a constitutional change.

**Consequence mapping required:**

```
Proposed change: INV-02 ≥1 → ≥2
Affected domains: PatternRegistry, ObservationRegistry, Derivation Engine
Existing nodes: All DERIVED Patterns with exactly 1 Observation become non-compliant
Migration: Migration window required before activating new threshold
Historical validity: Patterns with 1 Observation remain historically valid
Current compliance: Marked non-compliant under new version
```

### 4.3 Invariants That Cannot Be Removed

Certain invariants are constitutionally foundational. Removing them would change what the Observatory _is_, not merely how it _works_.

**Never remove:**

- INV-01: Without it, Discovery becomes an ungrounded claim. The evidence-originated knowledge pipeline collapses.
- INV-02: Without it, derived Patterns can claim recurrence without evidence. Observatory epistemology breaks.
- INV-03: Without it, retracted Discoveries continue making visibility claims. The graph lies.

These invariants may be modified through constitutional change processes. They may not be deleted.

---

## Appendix — Invariant Quick Reference

| ID     | Name                            | Class                   | Engine     | Registries              | Description                             |
| ------ | ------------------------------- | ----------------------- | ---------- | ----------------------- | --------------------------------------- |
| INV-01 | Discovery Evidence              | Existence               | Validation | Discovery ↔ Observation | Discovery requires ≥1 Observation       |
| INV-02 | Derived Pattern Evidence        | Existence (conditional) | Validation | Pattern ↔ Observation   | DERIVED Pattern requires ≥1 Observation |
| INV-03 | Discovery Visibility Gate       | Activation              | Activation | Discovery ↔ Graph       | REVEALS active only when mature         |
| INV-04 | Completed Experiment Outcome    | Existence               | Validation | Experiment (internal)   | COMPLETED requires outcome              |
| INV-05 | Supported Experiment Completion | Existence               | Validation | Experiment (internal)   | SUPPORTED requires COMPLETED            |
| INV-06 | Tradeoff Exchange Validity      | Existence               | Validation | Tradeoff (internal)     | gained ≠ sacrificed                     |
| INV-07 | Sealed Sector Observation Block | Existence               | Validation | Sector ↔ Observation    | No new OCCURRED_IN for SEALED           |

**Cross-registry invariants:** INV-01, INV-02, INV-07  
**Domain-internal invariants:** INV-04, INV-05, INV-06  
**Activation invariants:** INV-03  
**Foundational (never remove):** INV-01, INV-02, INV-03

---

_Doc 3 complete._
_The Observatory refuses seven things. Each refusal was earned under pressure._
_Future Monster: these are not arbitrary restrictions._
_They are the boundary conditions that make the knowledge system honest._

---

**Document Metadata**

- Architecture Sessions: E
- Engine types: 4
- Named invariants: 7 (INV-01 through INV-07)
- Cross-registry invariants: 3
- Domain-internal invariants: 3
- Activation invariants: 1
- Cascade scenarios documented: 3
- Foundational invariants (never remove): 3
