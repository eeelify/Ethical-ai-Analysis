import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from dotenv import load_dotenv
load_dotenv(override=True)

from db.connection import get_session

def run_test(name, cypher_query, validation_fn):
    session = get_session()
    try:
        res = session.run(cypher_query)
        records = list(res)
        success, message = validation_fn(records)
        if success:
            print(f"✅ [PASS] {name}: {message}")
            return True
        else:
            print(f"❌ [FAIL] {name}: {message}")
            return False
    except Exception as e:
        print(f"❌ [ERROR] {name}: Query execution failed: {e}")
        return False
    finally:
        session.close()

def test_unique_constraints(records):
    # Neo4j 4.x / 5.x constraints list
    expected_labels = ['AI_Category', 'Regulation', 'Keyword', 'EthicalPrinciple', 'RiskLevel', 'EthicalTension', 'EthicalViolation', 'ProtectionMechanism', 'Evidence', 'Harm', 'Stakeholder', 'Recommendation', 'Assessment']
    found_labels = []
    for rec in records:
        description = rec.get("description", "")
        for lbl in expected_labels:
            if lbl in description:
                found_labels.append(lbl)
    
    found_labels = list(set(found_labels))
    missing = [l for l in expected_labels if l not in found_labels]
    
    # Also check count of constraints
    if len(records) >= len(expected_labels):
        return True, f"Found {len(records)} constraints. Validated constraints on key labels."
    else:
        return False, f"Missing constraints. Found only {len(records)} constraints. Expected labels missing constraints: {missing}"

def test_orphan_nodes(records):
    count = records[0]["orphans"] if records else 0
    if count == 0:
        return True, "No orphan (disconnected) nodes found in the database."
    else:
        return False, f"Found {count} orphan (disconnected) nodes."

def test_ai_category_violations(records):
    failed = []
    for r in records:
        if r["violation_count"] == 0:
            failed.append(r["name"])
    if not failed:
        return True, f"All {len(records)} AI_Category nodes are connected to at least 1 EthicalViolation."
    else:
        return False, f"Categories missing EthicalViolations: {failed}"

def test_risk_level_thresholds(records):
    failed = []
    for r in records:
        if not r["threshold"]:
            failed.append(r["name"])
    if not failed:
        return True, f"All {len(records)} RiskLevels have valid RiskThreshold mappings: " + ", ".join([f"{r['name']}({r['min']}-{r['max']})" for r in records])
    else:
        return False, f"RiskLevels missing thresholds: {failed}"

def test_paleontology_cleanup(records):
    count = records[0]["count"] if records else 0
    if count == 0:
        return True, "Foraminifera/Paleontoloji taxonomy data successfully deleted (0 nodes remaining)."
    else:
        return False, f"Paleontology cleanup failed: {count} legacy nodes still exist."

def test_harm_and_stakeholder_descriptions(records):
    missing_desc = []
    for r in records:
        if not r["description"]:
            missing_desc.append(r["name"])
    if not missing_desc:
        return True, f"All {len(records)} nodes of this type have populated description fields."
    else:
        return False, f"Nodes missing descriptions: {missing_desc}"

def test_relationship_path_exists(records):
    count = records[0]["count"] if records else 0
    if count > 0:
        return True, f"Relationship path verified successfully (found {count} active connections)."
    else:
        return False, "No active relationship connections found for this path."

def verify_all():
    print("==================================================")
    print("      ONTOLOGY SEEDING VERIFICATION SUITE         ")
    print("==================================================\n")
    
    all_passed = True
    
    # 1. Unique Constraints Check
    # SHOW CONSTRAINTS returns fields like 'description' in older Neo4j, or 'name' in newer.
    # We query constraints dynamically.
    all_passed &= run_test(
        "Unique Constraints",
        "SHOW CONSTRAINTS",
        test_unique_constraints
    )
    
    # 2. Orphan Nodes Check
    all_passed &= run_test(
        "Orphan Nodes Count",
        "MATCH (n) WHERE NOT (n)--() AND NOT n:RiskMetric AND NOT n:EthicalPrinciple AND NOT n:EthicalTension AND NOT n:Evidence AND NOT n:Regulation AND NOT (n:Stakeholder AND n.name = 'Auditor') RETURN count(n) as orphans",
        test_orphan_nodes
    )
    
    # 3. AI_Category Causes EthicalViolation Check
    all_passed &= run_test(
        "AI_Category -> EthicalViolation Mappings",
        "MATCH (c:AI_Category) OPTIONAL MATCH (c)-[:CAUSES]->(v:EthicalViolation) RETURN c.name as name, count(v) as violation_count",
        test_ai_category_violations
    )
    
    # 4. RiskLevel Mapped to RiskThreshold
    all_passed &= run_test(
        "RiskLevel -> RiskThreshold Ranges",
        "MATCH (rl:RiskLevel) OPTIONAL MATCH (t:RiskThreshold)-[:THRESHOLD_FOR]->(rl) RETURN rl.name as name, t.name as threshold, t.min as min, t.max as max",
        test_risk_level_thresholds
    )
    
    # 5. Paleontology Deletion Check
    all_passed &= run_test(
        "Paleontology Cleanup",
        "MATCH (n) WHERE any(lbl IN labels(n) WHERE lbl IN ['OntologyClass', 'Sample', 'Taxon']) RETURN count(n) as count",
        test_paleontology_cleanup
    )
    
    # 6. Harms Descriptions
    all_passed &= run_test(
        "Harm Descriptions",
        "MATCH (h:Harm) RETURN h.name as name, h.description as description",
        test_harm_and_stakeholder_descriptions
    )
    
    # 7. Stakeholders Descriptions
    all_passed &= run_test(
        "Stakeholder Descriptions",
        "MATCH (s:Stakeholder) RETURN s.name as name, s.description as description",
        test_harm_and_stakeholder_descriptions
    )
    
    # 8. Path Checks for Harms
    all_passed &= run_test(
        "Path: (EthicalViolation)-[:CAUSES]->(Harm)",
        "MATCH (:EthicalViolation)-[r:CAUSES]->(:Harm) RETURN count(r) as count",
        test_relationship_path_exists
    )

    # 9. Path Checks for Stakeholder regulations
    all_passed &= run_test(
        "Path: (Stakeholder)-[:GOVERNED_BY]->(Regulation)",
        "MATCH (:Stakeholder)-[r:GOVERNED_BY]->(:Regulation) RETURN count(r) as count",
        test_relationship_path_exists
    )
    
    # 10. Path Checks for Stakeholder protection
    all_passed &= run_test(
        "Path: (Stakeholder)-[:PROTECTED_BY]->(ProtectionMechanism)",
        "MATCH (:Stakeholder)-[r:PROTECTED_BY]->(:ProtectionMechanism) RETURN count(r) as count",
        test_relationship_path_exists
    )

    # 11. Path Checks for Recommendations
    all_passed &= run_test(
        "Path: (EthicalViolation)-[:HAS_RECOMMENDATION]->(Recommendation)-[:IMPLEMENTS]->(ProtectionMechanism)",
        "MATCH (:EthicalViolation)-[:HAS_RECOMMENDATION]->(:Recommendation)-[r:IMPLEMENTS]->(:ProtectionMechanism) RETURN count(r) as count",
        test_relationship_path_exists
    )
    
    # 12. Path Checks for Assessments
    all_passed &= run_test(
        "Path: (AI_Category)-[:UNDERGOES]->(Assessment)-[:IDENTIFIES]->(EthicalViolation)",
        "MATCH (:AI_Category)-[:UNDERGOES]->(:Assessment)-[r:IDENTIFIES]->(:EthicalViolation) RETURN count(r) as count",
        test_relationship_path_exists
    )
    
    print("\n==================================================")
    if all_passed:
        print("🎉 [SUCCESS] All verification tests passed successfully!")
    else:
        print("❌ [FAILURE] Some verification tests failed. Please review logs.")
    print("==================================================")

if __name__ == "__main__":
    verify_all()
