# Observatory Architecture
## Doc 5 — Governance Spec

**Status:** Locked  
**Sessions:** G  
**Depends on:** Doc 1, Doc 2, Doc 3, Doc 4  
**Purpose:** Define how the Observatory is allowed to change, who decides, and how the past is protected while the future is built.

---

> Governance is not about who gets a vote.
> Governance is about whose consequences change.
> Those are radically different questions with radically different answers.
>
> The Observatory chose the second question.
> That choice prevented committees.
> Committees are humanity's preferred mechanism for converting
> a two-hour decision into a three-month archaeological site.

---

## Section 0 — Constitutional Principles

### 0.1 Architectural Law 02

> If authority can be represented more honestly as ownership, ownership wins.

This law governs governance itself. Every time process was attempted — voting, committees, approval chains — the solution collapsed. Every time topology was used — ownership, consequence maps, authority domains — the solution stabilized.

The architecture prefers topology over procedure at every layer. Governance is no exception.

### 0.2 The Authority Lattice

Governance emerges from ownership upward. It is not imposed on ownership downward.

```
Meaning
    ↓
Ownership
    ↓
Authority
    ↓
Consequences
    ↓
Governance
```

This direction matters. Governance with independent authority above ownership produces committees. Governance that emerges from ownership produces topology.

### 0.3 Session G Law 01

> Every architectural change proposal declares its affected authority domains
> before it may be evaluated. Only those domains participate.

```
Proposal: Add Pattern.source = EMERGENT
Affected domains: PatternRegistry, Validation Engine, Derivation Engine

Participants: those three domains
NOT participants: ConstraintRegistry, EntityRegistry, CertificationRegistry, etc.
```

No senate. No review board. Only the authorities whose consequences change.

### 0.4 Session G Law 02

> No non-registry authority may author truth.

```
Allowed:
    Derivation Engine updates Pattern.strength
    Activation Engine materializes REVEALS
    Consistency Engine emits violation Observations

Forbidden:
    Derivation Engine creates Pattern
    Consistency Engine archives Project
    Activation Engine changes Discovery.status
    Any engine reclassifies any node
```

This law prevents authority creep. Every large system eventually develops one helpful subsystem that starts making decisions on behalf of everyone else. The Observatory shoots that idea on sight.

---

## Section 1 — Change Classification

### 1.1 The Two Change Types

Every proposed change to the Observatory architecture falls into exactly one category.

**Schema Change:**
> Extends what is possible without restricting what is legal.

Governance Law 03 applies. Automatic coexistence. No migration strategy required.

**Constitutional Change:**
> Redraws legality for existing nodes or relationships.

Governance Law 04 applies. Explicit migration strategy required before activation.

### 1.2 The Classification Test

> Does this change affect what is *legal*, or only what is *possible*?

```
Possible expands → Schema change
Legal redraws   → Constitutional change
```

Examples:

| Proposed Change | Classification | Reasoning |
|---|---|---|
| Add `Pattern.source = EMERGENT` | Schema | New value extends possibilities; existing values unchanged |
| Add optional `Observation.sessionId` | Schema | New optional field; nothing becomes illegal |
| Add `Entity.type = ARCHIVIST` | Schema | New entity type; no existing entity becomes invalid |
| Change INV-02 threshold ≥1 → ≥2 | Constitutional | Existing DERIVED Patterns with 1 Observation become non-compliant |
| Make `Sector.summary` required | Constitutional | Sectors without summary become non-compliant |
| Remove `Tradeoff.rationale` | Constitutional | Removes mechanism — see Doc 4 Section 6.3 |
| Transfer AFFECTS ownership to ProjectRegistry | Constitutional | Changes authority model |
| Change `DERIVED_FROM` from Evidentiary to Semantic | Constitutional | Changes relationship class, cascade behavior, ownership |

### 1.3 Governance Laws

**Governance Law 03:**
> Schema evolution is additive by default.
> New versions extend what is legal. They do not invalidate what was true.

**Governance Law 04:**
> Architectural changes that alter legality are constitutional changes, not schema changes.

**Governance Law 05:**
> Historical validity and current compliance are separate concepts.

```
Node created under Schema v1:
    Historical Validity:    ✓ Valid — fact, immutable
    Current Compliance:     ⚠ Non-Compliant — evaluation, revisable
```

The Observatory does not rewrite history. It reevaluates it.

---

## Section 2 — Schema Change Process

### 2.1 Process for Additive Changes

1. **Identify the schema element** being added or extended
2. **Open the Consequence Map** (Doc 2, Section 8) for the affected element
3. **Notify consequence domains** listed in the map
4. **Each domain assesses its own consequences** — no central adjudication
5. **If all consequence domains have no blocking objections:** proceed
6. **Update the Consequence Map** to include the new element
7. **Document in schema** (Doc 4)

**Total decision makers:** Only the consequence domains listed in the map.

**Duration:** Fast. Schema changes with no cross-registry consequences may be decided by a single registry.

### 2.2 Examples

**Adding Pattern.source = EMERGENT:**

```
Consequence Map lookup: Pattern.source
Consequence domains: Validation Engine (INV-02), Derivation Engine (strength)

Assessment per domain:
    PatternRegistry:        New value — will own meaning
    Validation Engine:      INV-02 applies to DERIVED only — EMERGENT is new
                            Does EMERGENT require evidence? Define before proceeding.
                            If EMERGENT requires evidence: INV-02 may need expansion
                            → potential constitutional change depending on answer
    Derivation Engine:      How is strength computed for EMERGENT? Define.

Outcome: Proceed if EMERGENT is defined clearly enough for both engines.
         If EMERGENT requires new invariant: escalate to constitutional.
```

**Adding optional `Observation.sessionId`:**

```
Consequence Map lookup: (new field — not yet in map)
Consequence domains: ObservationRegistry (owner), Validation Engine (schema compliance)

Assessment:
    ObservationRegistry:    Optional field. No existing Observations become invalid.
    Validation Engine:      No new invariant required.

Outcome: Proceed. Update Consequence Map to include sessionId.
```

---

## Section 3 — Constitutional Change Process

### 3.1 The Migration Window Model

Constitutional changes require a four-phase migration window. No stop-world conversion. History is never deleted.

```
Phase 1: ADDITIVE
    New schema version declared
    New values/structures become legal
    Old structures remain valid as-is
    Both versions legally coexist
    Duration: Indefinite until Phase 2 begins

Phase 2: ACTIVE MIGRATION
    Derivation Engine recomputes affected nodes where possible
    Consistency Engine audits for upgrade candidates
    Registries may voluntarily upgrade authored nodes
    No forced conversion
    Inspector may manually upgrade nodes
    Duration: Defined by migration strategy

Phase 3: DEPRECATION
    Old values marked deprecated
    Validation Engine warns on new deprecated value creation
    Existing deprecated nodes remain valid (no deletion)
    Read always valid, regardless of deprecation
    Duration: Defined by migration strategy

Phase 4: SUNSET (optional, deliberate)
    Governance Authority declares sunset date explicitly
    Creation of deprecated values blocked
    Reading deprecated values always valid — permanently
    Duration: Permanent from sunset date
```

### 3.2 Historical Validity Under Constitutional Change

Per Governance Law 05, historical validity and current compliance are permanently separate:

```typescript
NodeVersionRecord {
    nodeId: string
    createdUnderVersion: string       // "schema-v1"
    historicalValidity: "VALID"       // immutable — existence is a fact
    currentCompliance:
        "COMPLIANT" |
        "NON_COMPLIANT" |
        "DEPRECATED" |
        "PENDING_MIGRATION"
    migratedToVersion?: string        // set when manually upgraded
}
```

**Read behavior under non-compliance:**
- Read: Always permitted, regardless of compliance status
- Write modifications: May require compliance upgrade first (strategy-dependent)
- Existence: Cannot be denied — Observatory Existence Principle applies

### 3.3 Constitutional Change Process

1. **Classify as constitutional** (fails the classification test in Section 1.2)
2. **Open Consequence Map** for all affected elements
3. **Identify all consequence domains**
4. **Governance Authority convened** — all consequence domain representatives
5. **Assess existing nodes:** which nodes become non-compliant under new rules?
6. **Design migration strategy:** which Migration Window phases apply?
7. **Set migration timeline:** Phase durations, sunset date (if applicable)
8. **All consequence domains must agree** before Phase 1 begins
9. **Document:** Update Consequence Map, Invariant Spec (Doc 3), Schema Spec (Doc 4)
10. **Activate Phase 1:** New schema version declared

### 3.4 Example: Changing INV-02 Threshold

**Proposed change:** INV-02 threshold from ≥1 Observation to ≥2 Observations

```
Classification: Constitutional
Reason: Existing DERIVED Patterns with exactly 1 Observation become non-compliant

Consequence Map:
    Pattern.source → PatternRegistry, Validation Engine, Derivation Engine
    INV-02 (invariant) → Validation Engine, PatternRegistry, ObservationRegistry

Consequence domains: PatternRegistry, Validation Engine, Derivation Engine, ObservationRegistry

Assessment of existing nodes:
    Query: COUNT(DERIVED Patterns with exactly 1 DERIVED_FROM Observation)
    Result: [n] nodes become non-compliant

Migration strategy:
    Phase 1: New threshold declared. Old threshold still active.
             DERIVED Patterns with 1 Observation: historically valid / pending migration
    Phase 2: Consistency Engine audits for patterns needing second observation
             Advisory Observations emitted for each affected Pattern
             Authors may add second Observation manually
    Phase 3: DERIVED Patterns with 1 Observation marked deprecated for new creation
    Phase 4: (Optional) Sunset creation of DERIVED Patterns without ≥2 Observations

Historical validity:
    All DERIVED Patterns with 1 Observation created before Phase 3:
        Historical Validity: ✓ VALID
        Current Compliance: ⚠ DEPRECATED
        Read: Always permitted
        Node existence: Cannot be denied
```

---

## Section 4 — Governance Authority

### 4.1 What Governance Authority Is

Governance Authority is a **specification authority**, not a runtime system.

```
What it IS:                         What it IS NOT:
────────────────────────            ────────────────────────
Approves constitutional changes     Runtime bottleneck
Declares migration timelines        Writer of nodes
Authorizes sunset dates             Authority over single registries
Maintains Consequence Map           Committee that meets regularly
Resolves architectural disputes
```

Governance Authority has zero runtime power. It cannot block writes, compute values, or materialize edges. It operates at design time. Runtime authorities operate at execution time. They never share a critical path.

### 4.2 What Governance Authority Does

- **Reviews constitutional change proposals** — assesses cross-layer implications
- **Approves migration strategies** — ensures historical validity is protected
- **Declares deprecation schedules** — sets Phase 3 timelines
- **Authorizes sunset dates** — explicit, never automatic
- **Maintains the Consequence Map** — keeps Doc 2 Section 8 current
- **Resolves cross-domain disputes** — when two registries disagree about architectural intent (not about node truth — that is resolved by ownership)

### 4.3 What Governance Authority Does Not Do

- Does not manage routine schema changes (single registry authority handles those)
- Does not approve new node instances (registry authority)
- Does not manage Observation creation, Discovery formation, Pattern derivation
- Does not override registry ownership

### 4.4 Composition Per Change Type

```
Schema change (additive):
    Participants: Affected consequence domains only
    Governance Authority: Not required
    Decision: Consensus among consequence domains

Constitutional change:
    Participants: All consequence domains + Governance Authority
    Governance Authority: Required — provides cross-layer perspective
    Decision: All consequence domains must agree before Phase 1 begins

Foundational invariant change (INV-01, INV-02, INV-03):
    Participants: All domains + Governance Authority
    Requirement: Explicit architectural justification required
    These three invariants define what the Observatory IS — changing them
    requires demonstrating the Observatory will remain epistemologically sound
```

---

## Section 5 — The Consequence Map

The Consequence Map is the artifact that makes governance mechanical. Every proposed change begins here. Without it, governance requires archaeology. With it, governance requires topology lookup.

See Doc 2, Section 8 for the complete Consequence Map.

### 5.1 How To Maintain The Consequence Map

When a schema change is approved:
1. Add new schema elements to the map
2. Link consequence domains accurately
3. Schema changes with no cross-registry consequences: entry still required (documents scope)

When a constitutional change completes:
1. Update existing entries if element semantics changed
2. Add migration status field to affected entries during Migration Window
3. Remove migration status when all nodes reach compliance

### 5.2 Reading The Consequence Map For Governance

```
Proposed change: [X]

1. Find [X] in Consequence Map
2. Read Consequence Domains column
3. If only one domain listed: schema change likely
4. If multiple domains listed: may be constitutional — apply classification test
5. If invariant domains listed: almost certainly constitutional
6. Notify listed domains
7. Each domain self-assesses
8. Proceed or escalate per Section 2 or 3
```

---

## Section 6 — What Cannot Change

### 6.1 The Observatory's Constitutional Invariants

Some things define what the Observatory *is*. Changing them requires demonstrating the Observatory remains epistemologically sound afterward. In practice, most of these cannot be meaningfully changed without rebuilding from scratch.

**Cannot be changed without architectural justification:**

```
The Observatory Existence Principle
    Things exist before they are discovered.
    Removing this would require removing REVEALS as a concept
    and fundamentally changing the Explorer Mode philosophy.

Fact/Finding Separation
    Observations are facts. Discoveries are findings.
    Removing this collapses the evidence chain.
    Discovery would become an Observation. The chain disappears.

Evidence vs Authority Pipelines
    These must remain separate.
    If internal derivation can produce Certifications,
    the external authority concept collapses.

The Cascade Law
    Validation → Activation → Consistency → Derivation
    Reversing this allows derived data to block authored truth.
    The Observatory stops being trustworthy.

Observation Constitution Article 1
    Observations without provenance may not participate in truth formation.
    Removing this makes the Observatory's truth architecture unenforced.
```

**Cannot be removed (Doc 4, Section 6.3):**
- `Observation.provenance`
- `Observation.observer`
- `Discovery.status`
- `Discovery.confidence`
- `Pattern.source`
- `Tradeoff.exchange`
- `Tradeoff.rationale`
- `Experiment.outcome`
- `Certification.issuer`

**Foundational invariants (never remove — may modify through constitutional process):**
- INV-01: Discovery evidence requirement
- INV-02: Derived Pattern evidence requirement
- INV-03: Discovery visibility gate

### 6.2 The Self-Consistency Test

The Observatory's governance model was tested against the Observatory's own epistemology:

```
Observatory Existence Principle applied to schema:
    Nodes created under v1 exist before v2 was discovered.
    The Observatory cannot deny existence of things it previously admitted as true.
    → Coexistence is not optional. It is constitutionally required.

Fact/Finding Separation applied to compliance:
    Historical validity = fact (immutable)
    Current compliance = finding (revisable)
    → Governance Law 05 follows directly.
```

The architecture is self-consistent under recursion. Governance principles that were applied to the Observatory's own evolution held without exception. This is the strongest validation available: the system governing itself using its own rules without contradiction.

---

## Appendix — Governance Quick Reference

### Schema Change Checklist

```
□ Identify schema element being changed
□ Is this additive? (extends possible, does not restrict legal)
□ Open Consequence Map
□ Identify consequence domains
□ Notify consequence domains
□ Each domain: self-assess impact
□ No blocking objections: proceed
□ Update Consequence Map
□ Update Schema Spec (Doc 4)
□ Done
```

### Constitutional Change Checklist

```
□ Classify as constitutional (redraws legality)
□ Open Consequence Map for all affected elements
□ Identify ALL consequence domains
□ Convene Governance Authority
□ Query: which existing nodes become non-compliant?
□ Design migration strategy (4-phase window)
□ Set phase durations
□ Decide: sunset date? (optional, explicit, never automatic)
□ All consequence domains agree
□ Activate Phase 1
□ Monitor migration progress
□ Declare Phase 3 (deprecation) per timeline
□ Declare Phase 4 (sunset) if applicable — explicit only
□ Update Consequence Map
□ Update Invariant Spec (Doc 3) if invariants changed
□ Update Schema Spec (Doc 4)
□ Done
```

### Change Type Reference

| Proposed Change | Type | Process |
|---|---|---|
| New enum value | Schema | Section 2 |
| New optional field | Schema | Section 2 |
| New node type | Schema | Section 2 |
| New relationship type | Schema | Section 2 |
| New Entity or Sector type | Schema | Section 2 |
| Making field required | Constitutional | Section 3 |
| Removing field | Constitutional | Section 3 |
| Changing invariant | Constitutional | Section 3 |
| Changing field semantics | Constitutional | Section 3 |
| Ownership transfer | Constitutional | Section 3 |
| Relationship class change | Constitutional | Section 3 |
| Foundational invariant change | Constitutional + justification | Section 3 + 6.1 |

---

*Doc 5 complete.*
*The Observatory now knows how to change without forgetting.*
*History is preserved. Compliance is evaluated. The past is never erased.*
*Future Monster inherits terrain, not mythology.*
*The runes are carved.*

---

**Document Metadata**
- Architecture Sessions: G
- Governance Laws: 5 (Laws 01–05)
- Change types: 2 (Schema, Constitutional)
- Migration phases: 4
- Processes documented: 2 (schema, constitutional)
- Constitutional invariants: 5
- Fields that may never be removed: 9 (referenced from Doc 4)
- Self-consistency test: passed
