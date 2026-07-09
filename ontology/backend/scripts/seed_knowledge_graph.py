import sys
import os

# Allow imports from the project root
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from dotenv import load_dotenv
load_dotenv(override=True)

from db.connection import get_session

# --- DATA DEFINITIONS ---

RISK_LEVELS = [
    {"name": "MinimalRisk", "score": 1},
    {"name": "LimitedRisk", "score": 2},
    {"name": "MediumRisk", "score": 3},
    {"name": "HighRisk", "score": 4},
    {"name": "ProhibitedRisk", "score": 5},
]

PRINCIPLES = [
    {"name": "Privacy"}, {"name": "Transparency"}, {"name": "Fairness"}, 
    {"name": "Justice"}, {"name": "Non-discrimination"}, {"name": "Human Autonomy"}, 
    {"name": "Human Oversight"}, {"name": "Accountability"}, {"name": "Explainability"}, 
    {"name": "Safety"}, {"name": "Security"}, {"name": "Robustness"}, 
    {"name": "Beneficence"}, {"name": "Non-maleficence"}, {"name": "Environmental Wellbeing"}
]

TENSIONS = [
    {
        "name": "Privacy vs Transparency", 
        "description": "Requires explainability while processing sensitive personal information.", 
        "severity": "High", 
        "recommendation": "Use privacy-preserving explainability techniques.",
        "principles": ["Privacy", "Transparency"]
    },
    {
        "name": "Fairness vs Accuracy", 
        "description": "Optimizing purely for accuracy may lead to biased outcomes.", 
        "severity": "Medium", 
        "recommendation": "Apply bias mitigation algorithms even if they slightly reduce accuracy.",
        "principles": ["Fairness"]
    },
    {
        "name": "Human Oversight vs Automation", 
        "description": "Mandatory human-in-the-loop reduces automation scale benefits.", 
        "severity": "High", 
        "recommendation": "Establish clear thresholds for automated vs manual decisions.",
        "principles": ["Human Oversight"]
    },
    {
        "name": "Safety vs Efficiency", 
        "description": "Thorough safety checks delay rapid deployment and scaling.", 
        "severity": "Medium", 
        "recommendation": "Implement automated staging and progressive rollout checks.",
        "principles": ["Safety"]
    },
    {
        "name": "Security vs Explainability", 
        "description": "High explainability might reveal proprietary code or vulnerabilities.", 
        "severity": "High", 
        "recommendation": "Provide explanations at an abstracted level.",
        "principles": ["Security", "Explainability"]
    },
    {
        "name": "Privacy vs Personalization", 
        "description": "Highly personalized experiences require excessive personal data collection.", 
        "severity": "High", 
        "recommendation": "Implement federated learning and data minimization.",
        "principles": ["Privacy"]
    },
    {
        "name": "Innovation vs Regulation", 
        "description": "Strict adherence to regulation may stifle novel AI capabilities.", 
        "severity": "Medium", 
        "recommendation": "Engage in regulatory sandboxes for novel tech testing.",
        "principles": []
    },
    {
        "name": "Efficiency vs Accountability", 
        "description": "End-to-end black box models are fast but difficult to audit.", 
        "severity": "High", 
        "recommendation": "Maintain comprehensive audit logs for all automated actions.",
        "principles": ["Accountability"]
    }
]

VIOLATIONS = [
    {"name": "Bias", "description": "Systematic prejudice in outcomes", "severity": "High", "recommended_action": "Conduct disparate impact analysis"},
    {"name": "Discrimination", "description": "Unfair treatment based on protected attributes", "severity": "Critical", "recommended_action": "Retrain with balanced datasets"},
    {"name": "Lack of Transparency", "description": "Inability to understand how decisions are made", "severity": "High", "recommended_action": "Publish model cards and decision logic"},
    {"name": "Privacy Violation", "description": "Unauthorized use of personal data", "severity": "Critical", "recommended_action": "Implement strict access controls and encryption"},
    {"name": "Mass Surveillance", "description": "Indiscriminate monitoring of individuals", "severity": "Critical", "recommended_action": "Prohibit use or implement strict geo-fencing"},
    {"name": "Biometric Misuse", "description": "Processing biometrics without explicit consent", "severity": "Critical", "recommended_action": "Mandate clear opt-in mechanisms"},
    {"name": "Sensitive Data Processing", "description": "Handling health or financial data insecurely", "severity": "High", "recommended_action": "Apply differential privacy and encryption"},
    {"name": "Manipulation", "description": "Exploiting user vulnerabilities", "severity": "High", "recommended_action": "Restrict manipulative behavioral nudging"},
    {"name": "Lack of Human Oversight", "description": "Fully autonomous high-risk decisions", "severity": "High", "recommended_action": "Require human-in-the-loop for critical actions"},
    {"name": "Unsafe Automation", "description": "Automation leading to physical or psychological harm", "severity": "Critical", "recommended_action": "Implement fail-safes and manual overrides"}
]

MECHANISMS = [
    {"name": "Human Review"}, {"name": "Encryption"}, {"name": "Consent Management"}, 
    {"name": "Data Minimization"}, {"name": "Differential Privacy"}, {"name": "Audit Logging"}, 
    {"name": "Access Control"}, {"name": "Bias Monitoring"}, {"name": "Continuous Risk Assessment"}, 
    {"name": "Model Documentation"}
]

EVIDENCE = [
    {"name": "Processes biometric data"}, {"name": "Uses sensitive personal information"}, 
    {"name": "Automated decision making"}, {"name": "No human intervention"}, 
    {"name": "No explainability"}, {"name": "Missing consent"}, {"name": "Insufficient transparency"}
]

REGULATIONS = [
    {"name": "EU AI Act"}, {"name": "GDPR"}, {"name": "KVKK"}, 
    {"name": "NIST AI RMF"}, {"name": "OECD AI Principles"}, {"name": "UNESCO Recommendation on AI Ethics"}
]

CATEGORIES = [
    {
        "name": "HiringAI", "risk_level": "HighRisk", "description": "AI used for recruitment and candidate screening.",
        "regulations": ["EU AI Act", "GDPR"], "principles": ["Fairness", "Non-discrimination", "Transparency"],
        "tensions": ["Fairness vs Accuracy", "Efficiency vs Accountability"],
        "violations": ["Bias", "Discrimination", "Lack of Transparency"], "keywords": ["hiring", "recruitment", "resume"]
    },
    {
        "name": "HealthcareAI", "risk_level": "HighRisk", "description": "AI for diagnosis, treatment, and patient management.",
        "regulations": ["GDPR", "KVKK", "EU AI Act"], "principles": ["Privacy", "Safety", "Beneficence"],
        "tensions": ["Safety vs Efficiency", "Privacy vs Transparency"],
        "violations": ["Sensitive Data Processing", "Unsafe Automation"], "keywords": ["healthcare", "medical", "patient"]
    },
    {
        "name": "CreditScoringAI", "risk_level": "HighRisk", "description": "AI determining creditworthiness.",
        "regulations": ["GDPR", "EU AI Act"], "principles": ["Fairness", "Explainability"],
        "tensions": ["Fairness vs Accuracy", "Efficiency vs Accountability"],
        "violations": ["Bias", "Lack of Transparency"], "keywords": ["credit", "loan", "finance"]
    },
    {
        "name": "BiometricSystem", "risk_level": "ProhibitedRisk", "description": "AI identifying individuals via biological traits.",
        "regulations": ["EU AI Act", "GDPR", "KVKK"], "principles": ["Privacy", "Human Autonomy"],
        "tensions": ["Privacy vs Transparency", "Security vs Explainability"],
        "violations": ["Biometric Misuse", "Privacy Violation", "Mass Surveillance"], "keywords": ["biometric", "facial recognition", "fingerprint"]
    },
    {
        "name": "EmotionRecognitionAI", "risk_level": "ProhibitedRisk", "description": "AI inferring emotions from physical signals.",
        "regulations": ["EU AI Act"], "principles": ["Privacy", "Human Autonomy"],
        "tensions": ["Privacy vs Transparency"],
        "violations": ["Manipulation", "Privacy Violation"], "keywords": ["emotion", "sentiment", "feeling"]
    },
    {
        "name": "EducationAI", "risk_level": "HighRisk", "description": "AI for student evaluation and proctoring.",
        "regulations": ["EU AI Act", "GDPR"], "principles": ["Fairness", "Privacy"],
        "tensions": ["Fairness vs Accuracy", "Privacy vs Personalization"],
        "violations": ["Bias", "Sensitive Data Processing"], "keywords": ["education", "student", "grading"]
    },
    {
        "name": "PredictivePolicingAI", "risk_level": "ProhibitedRisk", "description": "AI predicting criminal behavior.",
        "regulations": ["EU AI Act"], "principles": ["Justice", "Non-discrimination", "Accountability"],
        "tensions": ["Fairness vs Accuracy", "Efficiency vs Accountability"],
        "violations": ["Discrimination", "Mass Surveillance", "Lack of Transparency"], "keywords": ["policing", "crime", "predictive"]
    },
    {
        "name": "RecommendationSystem", "risk_level": "LimitedRisk", "description": "AI suggesting content or products.",
        "regulations": ["GDPR"], "principles": ["Transparency", "Human Autonomy"],
        "tensions": ["Privacy vs Personalization"],
        "violations": ["Manipulation"], "keywords": ["recommendation", "suggestion", "feed"]
    },
    {
        "name": "Chatbot", "risk_level": "MinimalRisk", "description": "AI conversational agent.",
        "regulations": ["GDPR"], "principles": ["Transparency", "Safety"],
        "tensions": ["Human Oversight vs Automation"],
        "violations": ["Lack of Transparency"], "keywords": ["chatbot", "assistant", "conversational"]
    },
    {
        "name": "MedicalDiagnosisAI", "risk_level": "HighRisk", "description": "AI providing medical diagnostic outputs.",
        "regulations": ["EU AI Act", "GDPR"], "principles": ["Safety", "Explainability"],
        "tensions": ["Safety vs Efficiency"],
        "violations": ["Unsafe Automation", "Lack of Human Oversight"], "keywords": ["diagnosis", "disease", "scan"]
    },
    {
        "name": "SurveillanceSystem", "risk_level": "ProhibitedRisk", "description": "AI monitoring public or private spaces.",
        "regulations": ["EU AI Act", "GDPR"], "principles": ["Privacy", "Human Autonomy"],
        "tensions": ["Privacy vs Transparency", "Safety vs Efficiency"],
        "violations": ["Mass Surveillance", "Privacy Violation"], "keywords": ["surveillance", "camera", "cctv"]
    },
    {
        "name": "DataProcessingAI", "risk_level": "MediumRisk", "description": "AI processing large volumes of data.",
        "regulations": ["GDPR", "KVKK"], "principles": ["Privacy", "Security"],
        "tensions": ["Efficiency vs Accountability"],
        "violations": ["Sensitive Data Processing"], "keywords": ["data processing", "analytics", "big data"]
    }
]

# --- RELATIONSHIP MAPPINGS FOR VIOLATIONS ---
# Mapping typical mitigations and evidence to violations
VIOLATION_RELATIONS = {
    "Bias": {"mitigations": ["Bias Monitoring", "Human Review"], "evidence": ["Automated decision making"]},
    "Discrimination": {"mitigations": ["Bias Monitoring", "Continuous Risk Assessment"], "evidence": ["Uses sensitive personal information"]},
    "Lack of Transparency": {"mitigations": ["Model Documentation", "Audit Logging"], "evidence": ["No explainability"]},
    "Privacy Violation": {"mitigations": ["Encryption", "Consent Management", "Data Minimization"], "evidence": ["Missing consent", "Uses sensitive personal information"]},
    "Mass Surveillance": {"mitigations": ["Access Control", "Human Review"], "evidence": ["Processes biometric data"]},
    "Biometric Misuse": {"mitigations": ["Consent Management", "Differential Privacy"], "evidence": ["Processes biometric data", "Missing consent"]},
    "Sensitive Data Processing": {"mitigations": ["Encryption", "Access Control", "Data Minimization"], "evidence": ["Uses sensitive personal information"]},
    "Manipulation": {"mitigations": ["Human Review", "Model Documentation"], "evidence": ["Automated decision making"]},
    "Lack of Human Oversight": {"mitigations": ["Human Review", "Audit Logging"], "evidence": ["No human intervention"]},
    "Unsafe Automation": {"mitigations": ["Continuous Risk Assessment", "Human Review"], "evidence": ["Automated decision making", "No human intervention"]}
}


def seed_ontology():
    session = get_session()
    if not session:
        print("❌ Could not connect to Neo4j database.")
        return

    try:
        print("Seeding Risk Levels...")
        for rl in RISK_LEVELS:
            session.run("MERGE (r:RiskLevel {name: $name}) SET r.score = $score", name=rl["name"], score=rl["score"])
        
        print("Seeding Ethical Principles...")
        for p in PRINCIPLES:
            session.run("MERGE (p:EthicalPrinciple {name: $name})", name=p["name"])
        
        print("Seeding Ethical Tensions...")
        for t in TENSIONS:
            session.run("""
                MERGE (et:EthicalTension {name: $name})
                SET et.description = $desc, et.severity = $sev, et.recommendation = $rec
            """, name=t["name"], desc=t["description"], sev=t["severity"], rec=t["recommendation"])
            
            for p in t["principles"]:
                session.run("""
                    MATCH (et:EthicalTension {name: $tname})
                    MATCH (ep:EthicalPrinciple {name: $pname})
                    MERGE (et)-[:CONFLICTS_WITH]->(ep)
                """, tname=t["name"], pname=p)

        print("Seeding Ethical Violations...")
        for v in VIOLATIONS:
            session.run("""
                MERGE (ev:EthicalViolation {name: $name})
                SET ev.description = $desc, ev.severity = $sev, ev.recommended_action = $rec
            """, name=v["name"], desc=v["description"], sev=v["severity"], rec=v["recommended_action"])

        print("Seeding Protection Mechanisms...")
        for m in MECHANISMS:
            session.run("MERGE (pm:ProtectionMechanism {name: $name})", name=m["name"])

        print("Seeding Evidence...")
        for e in EVIDENCE:
            session.run("MERGE (evd:Evidence {name: $name})", name=e["name"])

        print("Linking Violations to Mechanisms & Evidence...")
        for vname, rels in VIOLATION_RELATIONS.items():
            for m in rels["mitigations"]:
                session.run("""
                    MATCH (ev:EthicalViolation {name: $vname})
                    MATCH (pm:ProtectionMechanism {name: $mname})
                    MERGE (ev)-[:MITIGATED_BY]->(pm)
                """, vname=vname, mname=m)
            for e in rels["evidence"]:
                session.run("""
                    MATCH (ev:EthicalViolation {name: $vname})
                    MATCH (evd:Evidence {name: $ename})
                    MERGE (ev)-[:SUPPORTED_BY]->(evd)
                """, vname=vname, ename=e)

        print("Seeding Regulations...")
        for r in REGULATIONS:
            session.run("MERGE (reg:Regulation {name: $name})", name=r["name"])

        print("Seeding AI Categories, Keywords and linking everything...")
        for cat in CATEGORIES:
            # Create Category
            session.run("""
                MERGE (c:AI_Category {name: $name})
                SET c.risk_level = $risk, c.description = $desc
            """, name=cat["name"], risk=cat["risk_level"], desc=cat["description"])
            
            # Link Risk
            session.run("""
                MATCH (c:AI_Category {name: $cname})
                MATCH (r:RiskLevel {name: $rname})
                MERGE (c)-[:HAS_RISK]->(r)
            """, cname=cat["name"], rname=cat["risk_level"])
            
            # Keywords
            for kw in cat["keywords"]:
                session.run("""
                    MERGE (k:Keyword {word: $word})
                    WITH k
                    MATCH (c:AI_Category {name: $cname})
                    MERGE (k)-[:MAPS_TO]->(c)
                """, word=kw, cname=cat["name"])

            # Regulations
            for reg in cat["regulations"]:
                session.run("""
                    MATCH (c:AI_Category {name: $cname})
                    MATCH (r:Regulation {name: $rname})
                    MERGE (c)-[:HAS_REGULATION]->(r)
                """, cname=cat["name"], rname=reg)

            # Principles
            for prin in cat["principles"]:
                session.run("""
                    MATCH (c:AI_Category {name: $cname})
                    MATCH (p:EthicalPrinciple {name: $pname})
                    MERGE (c)-[:IMPACTS_PRINCIPLE]->(p)
                """, cname=cat["name"], pname=prin)

            # Tensions
            for ten in cat["tensions"]:
                session.run("""
                    MATCH (c:AI_Category {name: $cname})
                    MATCH (t:EthicalTension {name: $tname})
                    MERGE (c)-[:MAY_CREATE_TENSION]->(t)
                """, cname=cat["name"], tname=ten)

            # Violations
            for vio in cat["violations"]:
                session.run("""
                    MATCH (c:AI_Category {name: $cname})
                    MATCH (v:EthicalViolation {name: $vname})
                    MERGE (c)-[:CAUSES]->(v)
                """, cname=cat["name"], vname=vio)

        print("✅ Knowledge Graph successfully seeded and fully linked!")

    except Exception as e:
        print(f"❌ Error while seeding: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    seed_ontology()
