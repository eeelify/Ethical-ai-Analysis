# UseCaseOwner ontology-chat source of truth

This document describes the ontology source used by the project-scoped UseCaseOwner ontology chat assessment.

## Current source status

- Neo4j remains supported as the project knowledge graph and fact store.
- The current Neo4j data used by the older analyzer is mainly a keyword/category/risk/regulation mapping graph.
- Keyword lookup is not ontology inference and must be reported only as `KEYWORD_FALLBACK`.
- The checked-in OWL files are not loaded by the UseCaseOwner ontology-chat result path:
  - `ontology/EthicalAiAnalysis.owx`
  - `ontology/data/EthicalAI_inferred.owl`
- Because those OWL files are not loaded in this path, the UseCaseOwner ontology chat must not claim OWL 2 DL reasoning.
- SWRL may appear only in the technical reasoning trace if a real SWRL reasoner is executed. It must not appear as an ethical principle.

## Neo4j graph observed in the repository

The repository contains scripts and services that use the following labels as ontology-like graph nodes:

- `Keyword`
- `AI_Category`
- `RiskLevel`
- `Regulation`
- `EthicalPrinciple`
- `EthicalTension`
- `EthicalViolation`
- `ProtectionMechanism`
- `Evidence`
- `Harm`
- `Stakeholder`
- `Recommendation`
- `Assessment`
- `Fact`
- `AISystem`

Relationships used by existing scripts or services include:

- `MAPS_TO`
- `HAS_RISK`
- `HAS_REGULATION`
- `RELATED_TO_REGULATION`
- `IMPACTS_PRINCIPLE`
- `MAY_VIOLATE`
- `MAY_CREATE_TENSION`
- `CONFLICTS_WITH`
- `CAUSES`
- `MITIGATED_BY`
- `SUPPORTED_BY`
- `AFFECTS`
- `UNDERGOES`
- `IDENTIFIES`
- `PRODUCES`
- `HAS_RECOMMENDATION`
- `IMPLEMENTS`
- `HAS_FACT`
- `HAS_SAFEGUARD`
- `DOES_NOT_PERFORM`

The UseCaseOwner chat correction writes confirmed facts with explicit fact nodes when the ontology API is reachable:

```cypher
(s:AISystem {projectId})-[:HAS_FACT]->(f:Fact {projectId, userId, key})
(s)-[:HAS_SAFEGUARD]->(:Safeguard)
(s)-[:DOES_NOT_PERFORM]->(:OntologyConcept {name: "MedicalDiagnosisAI"})
(s)-[:PRODUCES]->(:OntologyConcept {name: "IndividualRiskScore"})
```

This persistence is best-effort. The assessment result is still produced from the project/user-scoped conversation state and never from a stale cached report.

## Hierarchy and constraints

The current Neo4j seed scripts model taxonomy mostly through labels and direct relationships, not a complete class hierarchy. Constraints are created for unique names in `scripts/create_constraints.py`, but the chat pipeline does not currently rely on Neo4j uniqueness constraints for final reasoning.

If Neo4j is intended to be the canonical ontology store, the graph should explicitly store:

- canonical class IDs and display labels,
- class hierarchy relationships,
- object-property equivalents,
- rule nodes or rule relationships,
- applicability conditions for risks and legal provisions,
- project instance facts scoped by `projectId` and `userId`,
- provenance and source evidence for every asserted fact.

## Provenance types

The chat report distinguishes these provenance types:

- `USER_CONFIRMED`: user message explicitly confirms or excludes a fact.
- `PROJECT_METADATA`: selected project title, short description, or full description.
- `LLM_EXTRACTED`: LLM-produced extraction, if used by another path.
- `NEO4J_GRAPH_LOOKUP`: graph lookup of existing nodes/relationships.
- `NEO4J_RULE_INFERENCE`: Cypher/rule result produced from facts, not keyword hits.
- `OWL_ASSERTED`: asserted OWL class/property/fact loaded from an OWL file.
- `OWL_INFERRED`: inferred OWL class/property/fact from a reasoner.
- `SWRL_INFERRED`: inferred result from an executed SWRL rule.
- `KEYWORD_FALLBACK`: low-confidence keyword candidate only.

## UseCaseOwner chat pipeline

The corrected chat pipeline is:

1. Selected project metadata.
2. Project/user-scoped conversation messages.
3. Structured fact extraction with negation handling.
4. Fact merge with prior confirmed facts and contradiction detection.
5. Optional explicit fact persistence to Neo4j.
6. Fact-applicability rules for classifications, risks, safeguards, legal considerations, and score.
7. Concise report rendering with evidence, provenance, and rule IDs.

Keyword fallback may generate candidates in the reasoning trace, but it cannot create a high-confidence classification, primary risk, legal conclusion, or high-risk regulatory classification by itself.

## OWL and SWRL status

The older `services/reasoning_service.py` creates an in-memory OWLReady2 ontology at `http://ethic-ai.org/ontology.owl` and runs HermiT over trigger strings. That is not the same as loading the checked-in OWL files.

For a future OWL-backed chat path, the implementation must:

1. explicitly load the real OWL file,
2. map confirmed facts to individuals and object/data properties,
3. run the reasoner,
4. return the exact classes/properties/rules used,
5. separate `OWL_ASSERTED`, `OWL_INFERRED`, and `SWRL_INFERRED` provenance.
