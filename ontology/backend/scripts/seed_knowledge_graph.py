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
    },
    {
        "name": "BiometricAI", "risk_level": "ProhibitedRisk", "description": "AI identifying individuals via biological traits.",
        "regulations": ["EU AI Act", "GDPR", "KVKK"], "principles": ["Privacy", "Human Autonomy"],
        "tensions": ["Privacy vs Transparency", "Security vs Explainability"],
        "violations": ["Biometric Misuse", "Privacy Violation", "Mass Surveillance"], "keywords": ["biometric", "facial recognition", "fingerprint"]
    },
    {
        "name": "SurveillanceAI", "risk_level": "ProhibitedRisk", "description": "AI monitoring public or private spaces.",
        "regulations": ["EU AI Act", "GDPR"], "principles": ["Privacy", "Human Autonomy"],
        "tensions": ["Privacy vs Transparency", "Safety vs Efficiency"],
        "violations": ["Mass Surveillance", "Privacy Violation"], "keywords": ["surveillance", "camera", "cctv"]
    },
    {
        "name": "EducationalAI", "risk_level": "HighRisk", "description": "AI for student evaluation and proctoring.",
        "regulations": ["EU AI Act", "GDPR"], "principles": ["Fairness", "Privacy"],
        "tensions": ["Fairness vs Accuracy", "Privacy vs Personalization"],
        "violations": ["Bias", "Sensitive Data Processing"], "keywords": ["education", "student", "grading"]
    },
    {
        "name": "LawEnforcementAI", "risk_level": "ProhibitedRisk", "description": "AI predicting criminal behavior or aiding threat detection.",
        "regulations": ["EU AI Act"], "principles": ["Justice", "Non-discrimination", "Accountability"],
        "tensions": ["Fairness vs Accuracy", "Efficiency vs Accountability"],
        "violations": ["Discrimination", "Mass Surveillance", "Lack of Transparency"], "keywords": ["policing", "crime", "predictive"]
    },
    {
        "name": "RecommendationAI", "risk_level": "LimitedRisk", "description": "AI suggesting content or products.",
        "regulations": ["GDPR"], "principles": ["Transparency", "Human Autonomy"],
        "tensions": ["Privacy vs Personalization"],
        "violations": ["Manipulation"], "keywords": ["recommendation", "suggestion", "feed"]
    },
    {
        "name": "GenerativeAI", "risk_level": "LimitedRisk", "description": "AI generating content or synthetic media.",
        "regulations": ["EU AI Act", "GDPR"], "principles": ["Transparency", "Safety"],
        "tensions": ["Human Oversight vs Automation"],
        "violations": ["Lack of Transparency", "Manipulation", "Unsafe Automation"], "keywords": ["generative", "llm", "deepfake"]
    },
    {
        "name": "ProfilingAI", "risk_level": "HighRisk", "description": "AI building digital behavioral profiles.",
        "regulations": ["GDPR", "KVKK"], "principles": ["Privacy", "Security"],
        "tensions": ["Efficiency vs Accountability"],
        "violations": ["Privacy Violation", "Sensitive Data Processing", "Discrimination"], "keywords": ["profiling", "tracking", "microtargeting"]
    },
    {
        "name": "SocialScoringAI", "risk_level": "ProhibitedRisk", "description": "AI ranking citizen trustworthiness or behaviour.",
        "regulations": ["EU AI Act", "GDPR"], "principles": ["Justice", "Non-discrimination", "Accountability"],
        "tensions": ["Fairness vs Accuracy", "Efficiency vs Accountability"],
        "violations": ["Discrimination", "Privacy Violation", "Manipulation", "Lack of Human Oversight"], "keywords": ["social scoring", "social credit", "ranking"]
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

HARMS = [
    {"name": "Financial", "description": "Monetary loss, theft, or economic disadvantage imposed on individuals or organisations."},
    {"name": "Psychological", "description": "Mental distress, anxiety, manipulation, or cognitive harm experienced by individuals."},
    {"name": "Physical", "description": "Bodily injury, health deterioration, or physical endangerment caused by system failures."},
    {"name": "Social", "description": "Societal polarization, systemic bias, discrimination, or erosion of democratic values."},
    {"name": "Environmental", "description": "Ecological degradation, excessive carbon footprint, or depletion of natural resources."},
    {"name": "Reputational", "description": "Damage to character, brand value, social status, or trust in individuals or organizations."}
]

VIOLATION_HARMS = {
    "Bias": ["Social", "Psychological", "Financial"],
    "Discrimination": ["Social", "Financial", "Psychological"],
    "Lack of Transparency": ["Reputational", "Social"],
    "Privacy Violation": ["Reputational", "Psychological", "Financial"],
    "Mass Surveillance": ["Social", "Psychological"],
    "Biometric Misuse": ["Psychological", "Reputational"],
    "Sensitive Data Processing": ["Financial", "Reputational", "Psychological"],
    "Manipulation": ["Psychological", "Social", "Financial"],
    "Lack of Human Oversight": ["Physical", "Social"],
    "Unsafe Automation": ["Physical", "Psychological", "Environmental"]
}

STAKEHOLDERS = [
    {"name": "AI_Provider", "description": "Entity that develops an AI system or has it developed with a view to placing it on the market."},
    {"name": "AI_Developer", "description": "Engineers, scientists, and organizations involved in designing and training AI models."},
    {"name": "AI_Deployer", "description": "User or organization using an AI system under its authority in a professional context."},
    {"name": "End_User", "description": "The natural person who interacts directly with the AI system or is directly affected by its outputs."},
    {"name": "Data_Subject", "description": "The identified or identifiable natural person whose personal data is processed by the AI system."},
    {"name": "Auditor", "description": "Independent third-party evaluating compliance, performance, and ethical alignment of AI systems."},
    {"name": "Regulator", "description": "Supervisory authority enforcing legal compliance, safety guidelines, and standardizations."},
    {"name": "Organization", "description": "Enterprise, institution, or group deploying AI to facilitate business processes or public services."}
]

STAKEHOLDER_REGULATIONS = {
    "Regulator": ["EU AI Act", "GDPR", "KVKK"],
    "AI_Provider": ["EU AI Act", "GDPR", "KVKK"],
    "AI_Developer": ["EU AI Act", "GDPR", "KVKK"],
    "AI_Deployer": ["EU AI Act", "GDPR", "KVKK"],
    "Data_Subject": ["GDPR", "KVKK"]
}

STAKEHOLDER_MECHANISMS = {
    "Data_Subject": ["Consent Management", "Access Control", "Data Minimization", "Encryption", "Differential Privacy"],
    "End_User": ["Human Review", "Consent Management", "Bias Monitoring", "Model Documentation"],
    "AI_Deployer": ["Audit Logging", "Continuous Risk Assessment", "Model Documentation"],
    "Regulator": ["Audit Logging", "Continuous Risk Assessment"]
}

CATEGORY_STAKEHOLDERS = {
    "HiringAI": ["AI_Developer", "End_User", "Organization"],
    "HealthcareAI": ["AI_Developer", "End_User", "Organization"],
    "MedicalDiagnosisAI": ["AI_Developer", "End_User", "Organization"],
    "CreditScoringAI": ["AI_Developer", "End_User", "Organization"],
    "BiometricSystem": ["AI_Developer", "Data_Subject", "Regulator"],
    "EmotionRecognitionAI": ["Data_Subject", "Regulator"],
    "EducationAI": ["End_User", "Organization"],
    "PredictivePolicingAI": ["Regulator", "Organization"],
    "RecommendationSystem": ["End_User"],
    "Chatbot": ["End_User"],
    "SurveillanceSystem": ["Data_Subject", "Regulator"],
    "DataProcessingAI": ["Organization", "Data_Subject"],
    "BiometricAI": ["AI_Developer", "Data_Subject", "Regulator"],
    "SurveillanceAI": ["Data_Subject", "Regulator"],
    "EducationalAI": ["End_User", "Organization"],
    "LawEnforcementAI": ["Regulator", "Organization"],
    "RecommendationAI": ["End_User"],
    "GenerativeAI": ["AI_Developer", "End_User", "Organization"],
    "ProfilingAI": ["Organization", "Data_Subject"],
    "SocialScoringAI": ["Regulator", "Organization", "Data_Subject"]
}

RECOMMENDATIONS = [
    {"name": "TechnicalRecommendation"},
    {"name": "OrganizationalRecommendation"},
    {"name": "LegalRecommendation"}
]

VIOLATION_RECOMMENDATIONS = {
    "Bias": ["TechnicalRecommendation", "OrganizationalRecommendation"],
    "Discrimination": ["TechnicalRecommendation", "OrganizationalRecommendation", "LegalRecommendation"],
    "Lack of Transparency": ["TechnicalRecommendation", "OrganizationalRecommendation"],
    "Privacy Violation": ["TechnicalRecommendation", "LegalRecommendation"],
    "Mass Surveillance": ["LegalRecommendation", "OrganizationalRecommendation"],
    "Biometric Misuse": ["TechnicalRecommendation", "LegalRecommendation"],
    "Sensitive Data Processing": ["TechnicalRecommendation", "LegalRecommendation"],
    "Manipulation": ["OrganizationalRecommendation", "LegalRecommendation"],
    "Lack of Human Oversight": ["OrganizationalRecommendation", "TechnicalRecommendation"],
    "Unsafe Automation": ["TechnicalRecommendation", "OrganizationalRecommendation"]
}

RECOMMENDATION_MECHANISMS = {
    "TechnicalRecommendation": ["Encryption", "Data Minimization", "Differential Privacy", "Access Control", "Bias Monitoring", "Audit Logging"],
    "OrganizationalRecommendation": ["Human Review", "Continuous Risk Assessment", "Model Documentation", "Audit Logging"],
    "LegalRecommendation": ["Consent Management", "Data Minimization"]
}

ASSESSMENTS = [
    {"name": "InitialAssessment"},
    {"name": "RiskAssessment"},
    {"name": "EthicalAssessment"},
    {"name": "FinalAssessment"}
]

CATEGORY_ASSESSMENTS = {
    "HiringAI": ["InitialAssessment", "RiskAssessment", "EthicalAssessment", "FinalAssessment"],
    "HealthcareAI": ["InitialAssessment", "RiskAssessment", "EthicalAssessment", "FinalAssessment"],
    "MedicalDiagnosisAI": ["InitialAssessment", "RiskAssessment", "EthicalAssessment", "FinalAssessment"],
    "CreditScoringAI": ["InitialAssessment", "RiskAssessment", "EthicalAssessment", "FinalAssessment"],
    "BiometricSystem": ["InitialAssessment", "RiskAssessment", "EthicalAssessment", "FinalAssessment"],
    "EmotionRecognitionAI": ["InitialAssessment", "RiskAssessment", "EthicalAssessment", "FinalAssessment"],
    "EducationAI": ["InitialAssessment", "RiskAssessment", "EthicalAssessment", "FinalAssessment"],
    "PredictivePolicingAI": ["InitialAssessment", "RiskAssessment", "EthicalAssessment", "FinalAssessment"],
    "RecommendationSystem": ["InitialAssessment", "RiskAssessment", "EthicalAssessment", "FinalAssessment"],
    "Chatbot": ["InitialAssessment", "RiskAssessment", "EthicalAssessment", "FinalAssessment"],
    "SurveillanceSystem": ["InitialAssessment", "RiskAssessment", "EthicalAssessment", "FinalAssessment"],
    "DataProcessingAI": ["InitialAssessment", "RiskAssessment", "EthicalAssessment", "FinalAssessment"],
    "BiometricAI": ["InitialAssessment", "RiskAssessment", "EthicalAssessment", "FinalAssessment"],
    "SurveillanceAI": ["InitialAssessment", "RiskAssessment", "EthicalAssessment", "FinalAssessment"],
    "EducationalAI": ["InitialAssessment", "RiskAssessment", "EthicalAssessment", "FinalAssessment"],
    "LawEnforcementAI": ["InitialAssessment", "RiskAssessment", "EthicalAssessment", "FinalAssessment"],
    "RecommendationAI": ["InitialAssessment", "RiskAssessment", "EthicalAssessment", "FinalAssessment"],
    "GenerativeAI": ["InitialAssessment", "RiskAssessment", "EthicalAssessment", "FinalAssessment"],
    "ProfilingAI": ["InitialAssessment", "RiskAssessment", "EthicalAssessment", "FinalAssessment"],
    "SocialScoringAI": ["InitialAssessment", "RiskAssessment", "EthicalAssessment", "FinalAssessment"]
}

ASSESSMENT_VIOLATIONS = {
    "RiskAssessment": ["Bias", "Discrimination", "Lack of Human Oversight", "Unsafe Automation"],
    "EthicalAssessment": ["Lack of Transparency", "Privacy Violation", "Mass Surveillance", "Biometric Misuse", "Sensitive Data Processing", "Manipulation"]
}

ASSESSMENT_RISK_LEVELS = {
    "InitialAssessment": ["MinimalRisk", "LimitedRisk", "MediumRisk"],
    "RiskAssessment": ["HighRisk", "ProhibitedRisk"],
    "FinalAssessment": ["MinimalRisk", "LimitedRisk", "MediumRisk", "HighRisk", "ProhibitedRisk"]
}

ASSESSMENT_RECOMMENDATIONS = {
    "EthicalAssessment": ["TechnicalRecommendation", "OrganizationalRecommendation"],
    "FinalAssessment": ["TechnicalRecommendation", "OrganizationalRecommendation", "LegalRecommendation"]
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

        print("Seeding Harms...")
        for h in HARMS:
            session.run("MERGE (harm:Harm {name: $name}) SET harm.description = $desc", name=h["name"], desc=h["description"])

        print("Linking Violations to Harms...")
        for vname, harms in VIOLATION_HARMS.items():
            for hname in harms:
                session.run("""
                    MATCH (ev:EthicalViolation {name: $vname})
                    MATCH (harm:Harm {name: $hname})
                    MERGE (ev)-[:CAUSES]->(harm)
                """, vname=vname, hname=hname)

        print("Seeding Stakeholders...")
        for s in STAKEHOLDERS:
            session.run("MERGE (stk:Stakeholder {name: $name}) SET stk.description = $desc", name=s["name"], desc=s["description"])

        print("Linking Stakeholders to Regulations (GOVERNED_BY)...")
        for sname, regulations in STAKEHOLDER_REGULATIONS.items():
            for rname in regulations:
                session.run("""
                    MATCH (stk:Stakeholder {name: $sname})
                    MATCH (reg:Regulation {name: $rname})
                    MERGE (stk)-[:GOVERNED_BY]->(reg)
                """, sname=sname, rname=rname)

        print("Linking Stakeholders to Protection Mechanisms (PROTECTED_BY)...")
        for sname, mechanisms in STAKEHOLDER_MECHANISMS.items():
            for mname in mechanisms:
                session.run("""
                    MATCH (stk:Stakeholder {name: $sname})
                    MATCH (pm:ProtectionMechanism {name: $mname})
                    MERGE (stk)-[:PROTECTED_BY]->(pm)
                """, sname=sname, mname=mname)

        print("Seeding Recommendations...")
        for rec in RECOMMENDATIONS:
            session.run("MERGE (r:Recommendation {name: $name})", name=rec["name"])

        print("Linking Recommendations to Protection Mechanisms...")
        for rname, mechanisms in RECOMMENDATION_MECHANISMS.items():
            for mname in mechanisms:
                session.run("""
                    MATCH (r:Recommendation {name: $rname})
                    MATCH (pm:ProtectionMechanism {name: $mname})
                    MERGE (r)-[:IMPLEMENTS]->(pm)
                """, rname=rname, mname=mname)

        print("Linking Violations to Recommendations...")
        for vname, recs in VIOLATION_RECOMMENDATIONS.items():
            for rname in recs:
                session.run("""
                    MATCH (ev:EthicalViolation {name: $vname})
                    MATCH (r:Recommendation {name: $rname})
                    MERGE (ev)-[:HAS_RECOMMENDATION]->(r)
                """, vname=vname, rname=rname)

        print("Seeding Assessments...")
        for a in ASSESSMENTS:
            session.run("MERGE (asm:Assessment {name: $name})", name=a["name"])

        print("Linking Assessments to Violations...")
        for asm_name, violations in ASSESSMENT_VIOLATIONS.items():
            for vname in violations:
                session.run("""
                    MATCH (asm:Assessment {name: $aname})
                    MATCH (ev:EthicalViolation {name: $vname})
                    MERGE (asm)-[:IDENTIFIES]->(ev)
                """, aname=asm_name, vname=vname)

        print("Linking Assessments to Risk Levels...")
        for asm_name, risk_levels in ASSESSMENT_RISK_LEVELS.items():
            for rname in risk_levels:
                session.run("""
                    MATCH (asm:Assessment {name: $aname})
                    MATCH (rl:RiskLevel {name: $rname})
                    MERGE (asm)-[:HAS_RISK_LEVEL]->(rl)
                """, aname=asm_name, rname=rname)

        print("Linking Assessments to Recommendations...")
        for asm_name, recommendations in ASSESSMENT_RECOMMENDATIONS.items():
            for rname in recommendations:
                session.run("""
                    MATCH (asm:Assessment {name: $aname})
                    MATCH (rec:Recommendation {name: $rname})
                    MERGE (asm)-[:PRODUCES]->(rec)
                """, aname=asm_name, rname=rname)

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

            # Stakeholders
            if cat["name"] in CATEGORY_STAKEHOLDERS:
                for stk in CATEGORY_STAKEHOLDERS[cat["name"]]:
                    session.run("""
                        MATCH (c:AI_Category {name: $cname})
                        MATCH (stk:Stakeholder {name: $sname})
                        MERGE (c)-[:AFFECTS]->(stk)
                    """, cname=cat["name"], sname=stk)

            # Assessments
            if cat["name"] in CATEGORY_ASSESSMENTS:
                for asm in CATEGORY_ASSESSMENTS[cat["name"]]:
                    session.run("""
                        MATCH (c:AI_Category {name: $cname})
                        MATCH (asm:Assessment {name: $aname})
                        MERGE (c)-[:UNDERGOES]->(asm)
                    """, cname=cat["name"], aname=asm)

        print("✅ Knowledge Graph successfully seeded and fully linked!")

    except Exception as e:
        print(f"❌ Error while seeding: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    seed_ontology()
