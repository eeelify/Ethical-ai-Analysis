import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from dotenv import load_dotenv
load_dotenv(override=True)

from db.connection import get_session

def verify():
    queries = [
        "MATCH (c:AI_Category)-[:MAY_CREATE_TENSION]->(t:EthicalTension) RETURN c.name, t.name LIMIT 2",
        "MATCH (t:EthicalTension)-[:CONFLICTS_WITH]->(p:EthicalPrinciple) RETURN t.name, p.name LIMIT 2",
        "MATCH (c:AI_Category)-[:IMPACTS_PRINCIPLE]->(p:EthicalPrinciple) RETURN c.name, p.name LIMIT 2",
        "MATCH (c:AI_Category)-[:HAS_RISK]->(r:RiskLevel) RETURN c.name, r.name LIMIT 2",
        "MATCH (c:AI_Category)-[:CAUSES]->(v:EthicalViolation)-[:MITIGATED_BY]->(m:ProtectionMechanism) RETURN c.name, v.name, m.name LIMIT 2"
    ]
    
    session = get_session()
    for q in queries:
        print(f"\nRunning: {q}")
        res = session.run(q)
        records = list(res)
        if records:
            for rec in records:
                print(rec.values())
        else:
            print("NO RESULTS")

    session.close()

if __name__ == "__main__":
    verify()
