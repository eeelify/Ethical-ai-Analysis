"""
create_constraints.py
─────────────────────
Migration script to establish unique constraints for all domain node labels
to maintain database integrity.

Run:
  python scripts/create_constraints.py
"""

import sys
import os

# Allow imports from project root
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from dotenv import load_dotenv
load_dotenv(override=True)

from db.connection import get_session

def create_constraints():
    # Constraints list
    constraints = [
        # Core Entities
        "CREATE CONSTRAINT ai_category_name IF NOT EXISTS FOR (n:AI_Category) REQUIRE n.name IS UNIQUE",
        "CREATE CONSTRAINT regulation_name IF NOT EXISTS FOR (n:Regulation) REQUIRE n.name IS UNIQUE",
        "CREATE CONSTRAINT keyword_term IF NOT EXISTS FOR (n:Keyword) REQUIRE n.term IS UNIQUE",
        "CREATE CONSTRAINT keyword_word IF NOT EXISTS FOR (n:Keyword) REQUIRE n.word IS UNIQUE",
        "CREATE CONSTRAINT ethical_principle_name IF NOT EXISTS FOR (n:EthicalPrinciple) REQUIRE n.name IS UNIQUE",
        
        # Additional Domain Node Types
        "CREATE CONSTRAINT risk_level_name IF NOT EXISTS FOR (n:RiskLevel) REQUIRE n.name IS UNIQUE",
        "CREATE CONSTRAINT ethical_tension_name IF NOT EXISTS FOR (n:EthicalTension) REQUIRE n.name IS UNIQUE",
        "CREATE CONSTRAINT ethical_violation_name IF NOT EXISTS FOR (n:EthicalViolation) REQUIRE n.name IS UNIQUE",
        "CREATE CONSTRAINT protection_mechanism_name IF NOT EXISTS FOR (n:ProtectionMechanism) REQUIRE n.name IS UNIQUE",
        "CREATE CONSTRAINT evidence_name IF NOT EXISTS FOR (n:Evidence) REQUIRE n.name IS UNIQUE",
        "CREATE CONSTRAINT harm_name IF NOT EXISTS FOR (n:Harm) REQUIRE n.name IS UNIQUE",
        "CREATE CONSTRAINT stakeholder_name IF NOT EXISTS FOR (n:Stakeholder) REQUIRE n.name IS UNIQUE",
        "CREATE CONSTRAINT recommendation_name IF NOT EXISTS FOR (n:Recommendation) REQUIRE n.name IS UNIQUE",
        "CREATE CONSTRAINT assessment_name IF NOT EXISTS FOR (n:Assessment) REQUIRE n.name IS UNIQUE"
    ]
    
    print("Connecting to Neo4j to establish database constraints...")
    with get_session() as session:
        for cypher in constraints:
            try:
                session.run(cypher)
                print(f"  [OK]  {cypher.split('FOR')[0].strip()}")
            except Exception as e:
                # Fallback if IF NOT EXISTS or general syntax is not supported by older Neo4j versions
                print(f"  [ERR] Failed: {cypher} -> {e}")
                
    print("\nConstraints creation completed.")

if __name__ == "__main__":
    create_constraints()
