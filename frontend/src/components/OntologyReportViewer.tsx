import React from 'react';
import { ArrowLeft, Shield, AlertTriangle, Scale, Target, BrainCircuit, ExternalLink } from 'lucide-react';

interface OntologyReportViewerProps {
  report: any; // The JSON response from ontology backend
  onBack: () => void;
}

export function OntologyReportViewer({ report, onBack }: OntologyReportViewerProps) {
  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">No report data found.</p>
          <button onClick={onBack} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            <ArrowLeft className="inline h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Handle potential nested structures
  const reportData = report.report || report.data || report;
  
  // Extract fields (use fallbacks if exact keys differ)
  const riskLevel = reportData.RiskLevel || reportData.risk_level || 'Unknown';
  const initialRisk = reportData.InitialRisk || reportData.initial_risk || 'N/A';
  const finalRisk = reportData.FinalRisk || reportData.final_risk || 'N/A';
  
  const violations = reportData.EthicalViolations || reportData.ethical_violations || [];
  const tensions = reportData.EthicalTensions || reportData.ethical_tensions || [];
  const regulations = reportData.LegalRegulations || reportData.legal_regulations || [];
  const reasoning = reportData.ReasoningTrace || reportData.reasoning_trace || '';
  const evidence = reportData.OntologyEvidence || reportData.ontology_evidence || '';
  const generatedReport = reportData.GeneratedReport || reportData.generated_report || reportData.summary || '';

  const getRiskColor = (level: string) => {
    const l = level.toLowerCase();
    if (l.includes('high') || l.includes('critical')) return 'bg-red-100 text-red-800 border-red-200';
    if (l.includes('medium')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (l.includes('low')) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <BrainCircuit className="h-6 w-6 mr-2 text-indigo-600" />
              Ontology-Based Ethical Report
            </h1>
          </div>
          <div className={`px-4 py-2 rounded-lg font-bold border ${getRiskColor(riskLevel)}`}>
            Risk Level: {riskLevel}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        
        {/* Risk Scores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <Target className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Initial Risk</p>
              <p className="text-2xl font-bold text-gray-900">{initialRisk}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Final Risk (After Safeguards)</p>
              <p className="text-2xl font-bold text-gray-900">{finalRisk}</p>
            </div>
          </div>
        </div>

        {/* Violations & Tensions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Ethical Violations
            </h3>
            {violations.length > 0 ? (
              <ul className="space-y-3">
                {violations.map((v: string, i: number) => (
                  <li key={i} className="flex items-start p-3 bg-red-50 rounded-lg text-red-900 text-sm">
                    <span className="mr-2">•</span> {v}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No ethical violations detected.</p>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Scale className="h-5 w-5 mr-2 text-orange-500" />
              Ethical Tensions
            </h3>
            {tensions.length > 0 ? (
              <ul className="space-y-3">
                {tensions.map((t: string, i: number) => (
                  <li key={i} className="flex items-start p-3 bg-orange-50 rounded-lg text-orange-900 text-sm">
                    <span className="mr-2">•</span> {t}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No ethical tensions detected.</p>
            )}
          </div>
        </div>

        {/* Regulations */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ExternalLink className="h-5 w-5 mr-2 text-blue-500" />
            Legal & Policy Regulations
          </h3>
          {regulations.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2">
              {regulations.map((r: string, i: number) => (
                <li key={i} className="text-gray-700">{r}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No specific regulations flagged.</p>
          )}
        </div>

        {/* Generated Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ontology-Generated Report</h3>
          <div className="prose max-w-none text-gray-800 bg-gray-50 p-6 rounded-lg whitespace-pre-wrap font-sans">
            {generatedReport || "Report summary is empty."}
          </div>
        </div>

        {/* Reasoning Trace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800 text-gray-300">
            <h3 className="text-lg font-semibold text-white mb-4">Reasoning Trace (SWRL)</h3>
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap bg-gray-950 p-4 rounded-lg font-mono">
              {reasoning || "No reasoning trace available."}
            </pre>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-800 text-gray-300">
            <h3 className="text-lg font-semibold text-white mb-4">Ontology Evidence</h3>
            <pre className="text-sm overflow-x-auto whitespace-pre-wrap bg-gray-950 p-4 rounded-lg font-mono">
              {evidence || "No ontology evidence available."}
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
}
