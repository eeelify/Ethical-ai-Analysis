import React, { useEffect, useState, useCallback, useRef } from "react";
import { FileText, Cpu, Loader2, Play, Download, ExternalLink, AlertTriangle, CheckCircle2, AlertCircle, XCircle, ChevronRight } from "lucide-react";
import { api } from "../api";

interface UnifiedReportViewerProps {
  projectId: string;
  userId: string;
  onGenerateOntology?: () => void;
  generating?: boolean;
  onViewExpertReport?: (reportId: string) => void;
  onViewOntologyReport?: () => void;
  refreshTrigger?: number;
  currentUserRole?: string;
  onReviewReports?: () => void;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Expert report uses "Cumulative Risk Volume" (sum of raw ERC weights).
 * We normalise to 0-100 for display (cap at 100).
 * Formula: max observed CRV for the platform is ~200 (7 principles × ~29 max).
 * We clamp to that range.
 */
function expertCRVtoRisk(crv: number | undefined): number {
  if (crv === undefined || crv === null) return 50;
  const MAX_CRV = 200;
  const clamped = Math.min(crv, MAX_CRV);
  return Math.round((clamped / MAX_CRV) * 100);
}

/**
 * Ontology uses composite_risk_score 0-100 where higher = higher risk.
 */
function ontologyScore(raw: number | undefined): number {
  if (raw === undefined || raw === null) return 50;
  return Math.round(raw);
}

type RiskBand = { label: string; color: string; bg: string; border: string; icon: React.ElementType };

function getRiskBand(score: number): RiskBand {
  if (score < 25) return { label: "Minimal Risk", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", icon: CheckCircle2 };
  if (score < 50) return { label: "Limited Risk", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", icon: AlertCircle };
  if (score < 75) return { label: "High Risk", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", icon: AlertTriangle };
  return { label: "Unacceptable Risk", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", icon: XCircle };
}

function ScoreMeter({ score, color }: { score: number; color: string }) {
  const clipped = Math.max(0, Math.min(100, score));
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>0 (Safe)</span>
        <span>100 (High Risk)</span>
      </div>
      <div className="h-3 w-full bg-[#1a2744] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${clipped}%` }}
        />
      </div>
    </div>
  );
}

function PrincipleBar({ name, value, max, suffix = "" }: { name: string; value: number; max: number; suffix?: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  // Higher value = higher risk = red
  const colorClass = pct > 70 ? "bg-red-500" : pct > 40 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-300 truncate max-w-[60%]">{name}</span>
        <span className="text-gray-400">{value}{suffix}</span>
      </div>
      <div className="w-full bg-[#1a2744] rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] text-gray-500 mt-1 text-right">Higher = Riskier</p>
    </div>
  );
}

// ─── Expert Card ─────────────────────────────────────────────────────────────

function ExpertReportCard({
  expertReport,
  userId,
  apiBase,
  onViewReport
}: {
  expertReport: any;
  userId: string;
  apiBase: (path: string) => string;
  onViewReport?: (reportId: string) => void;
}) {
  const computedMetrics = expertReport?.computedMetrics;
  const scoring = computedMetrics?.scoring;
  const totals = scoring?.totalsOverall;

  const crv: number = totals?.cumulativeRiskVolume ?? totals?.sum ?? totals?.avg ?? undefined;
  const riskScore = expertCRVtoRisk(crv);
  const band = getRiskBand(riskScore);
  const BandIcon = band.icon;

  const byPrinciple: Record<string, any> = scoring?.byPrincipleOverall ?? {};
  const principleEntries = Object.entries(byPrinciple).filter(([, v]) => v);
  const ercAvg: number | undefined = totals?.erc ?? totals?.avg;
  const reportId = expertReport?._id?.toString() ?? expertReport?.id;

  const handleViewDetailed = () => {
    if (!reportId) return;
    window.open(apiBase(`/api/reports/${reportId}/pdf?userId=${userId}`), '_blank');
  };

  const handleDownloadPDF = () => {
    if (!reportId) return;
    window.open(apiBase(`/api/reports/${reportId}/download-pdf?userId=${userId}`), '_blank');
  };

  return (
    <div className="bg-[#0b1221] border border-gray-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gray-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
          <FileText className="text-blue-400 w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Expert Evaluation Report</h2>
          <p className="text-xs text-gray-500">Multi-expert quantitative & qualitative assessment</p>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6 flex-1">
        <div className={`rounded-xl p-4 border ${band.bg} ${band.border}`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Risk Score</p>
              <p className={`text-4xl font-black ${band.color}`}>{riskScore}<span className="text-lg font-medium text-gray-500">/100</span></p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${band.color} ${band.bg} ${band.border}`}>
              <BandIcon className="w-4 h-4" />
              {band.label}
            </div>
          </div>
          <ScoreMeter score={riskScore} color={riskScore >= 75 ? "bg-red-500" : riskScore >= 50 ? "bg-orange-500" : riskScore >= 25 ? "bg-amber-500" : "bg-emerald-500"} />
          <p className="text-xs text-gray-500 mt-2">
            Cumulative Risk Volume (CRV): <span className="text-gray-300 font-medium">{crv !== undefined ? crv : "N/A"}</span>
            {ercAvg !== undefined && <> · Avg ERC: <span className="text-gray-300 font-medium">{typeof ercAvg === "number" ? ercAvg.toFixed(2) : ercAvg}</span></>}
          </p>
        </div>

        {principleEntries.length > 0 && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Principle Breakdown</p>
            <div className="space-y-2.5">
              {principleEntries.map(([principle, val]: [string, any]) => {
                const pErc = val?.erc ?? val?.avg ?? 0;
                const maxErc = 4;
                return (
                  <PrincipleBar
                    key={principle}
                    name={principle.replace(/_/g, " ")}
                    value={typeof pErc === "number" ? +pErc.toFixed(2) : pErc}
                    max={maxErc}
                    suffix="/4 ERC"
                  />
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-auto flex flex-col gap-2">
          {reportId ? (
            <>
              <button
                onClick={handleViewDetailed}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> View Full Report
              </button>
              <button
                onClick={handleDownloadPDF}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a2744] hover:bg-[#1f3059] border border-gray-700 text-gray-300 text-sm font-medium rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </>
          ) : (
            <div className="text-center text-sm text-gray-500 italic py-3">No expert report generated yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Ontology Card ────────────────────────────────────────────────────────────

function OntologyReportCard({
  ontologyReport,
  onGenerate,
  generating,
  apiBase,
  userId,
  onViewReport,
}: {
  ontologyReport: any;
  onGenerate?: () => void;
  generating?: boolean;
  apiBase: (path: string) => string;
  userId: string;
  onViewReport?: () => void;
}) {
  const baseResult = ontologyReport?.ontologyResult ?? ontologyReport?.report ?? ontologyReport?.data ?? ontologyReport ?? {};
  const result = baseResult.report ?? baseResult.data ?? baseResult;

  const rawScore: number = result?.composite_risk_score ?? result?.scoreBreakdown?.overallRiskScore ?? result?.overallRiskScore;
  const riskScore = ontologyScore(rawScore);
  const band = getRiskBand(riskScore);
  const BandIcon = band.icon;

  const components = result?.score_components ?? result?.scoreBreakdown?.components ?? [];
  const tensions: any[] = result?.ethical_tensions ?? result?.ethicalTensions ?? [];
  const recommendations: string[] = result?.recommendations ?? result?.recommendedActions ?? [];
  const execSummary: string = result?.executive_summary ?? result?.executiveSummary ?? "";

  // The components array might be an array of objects or an object map
  const safetyComponents = Array.isArray(components) 
    ? components.map((c: any) => ({
        name: c.name || c.key,
        value: typeof c.score === "number" ? Math.round(c.score) : 50
      }))
    : Object.entries(components).map(([key, val]: [string, any]) => ({
        name: key.replace(/_/g, " ").replace(/score/g, "").trim(),
        value: typeof val === "number" ? Math.round(val) : 50,
      }));

  const ontologyId = ontologyReport?._id?.toString() ?? ontologyReport?.id;

  const handleViewDetailed = () => {
    if (!ontologyId) return;
    window.open(apiBase(`/api/ontology-reports/${ontologyId}/view-pdf?userId=${userId}`), '_blank');
  };

  return (
    <div className="bg-[#0b1221] border border-gray-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gray-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
          <Cpu className="text-purple-400 w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Ontology AI Report</h2>
          <p className="text-xs text-gray-500">Automated ontology-based ethical analysis</p>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6 flex-1">
        {ontologyReport ? (
          <>
            <div className={`rounded-xl p-4 border ${band.bg} ${band.border}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Risk Score</p>
                  <p className={`text-4xl font-black ${band.color}`}>{riskScore}<span className="text-lg font-medium text-gray-500">/100</span></p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${band.color} ${band.bg} ${band.border}`}>
                  <BandIcon className="w-4 h-4" />
                  {band.label}
                </div>
              </div>
              <ScoreMeter score={riskScore} color={riskScore >= 75 ? "bg-red-500" : riskScore >= 50 ? "bg-orange-500" : riskScore >= 25 ? "bg-amber-500" : "bg-emerald-500"} />
              <p className="text-xs text-gray-500 mt-2">
                Raw Risk Score: <span className="text-gray-300 font-medium">{rawScore !== undefined ? rawScore : "N/A"}</span>
              </p>
            </div>

            {safetyComponents.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Dimension Breakdown</p>
                <div className="space-y-2.5">
                  {safetyComponents.map((c) => (
                    <PrincipleBar key={c.name} name={c.name} value={c.value} max={100} />
                  ))}
                </div>
              </div>
            )}



            <div className="mt-auto flex flex-col gap-2">
              <button
                onClick={handleViewDetailed}
                disabled={!ontologyId}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ExternalLink className="w-4 h-4" /> View Full Report
              </button>
              <button
                onClick={() => {
                  if (!ontologyId) return;
                  window.open(apiBase(`/api/ontology-reports/${ontologyId}/view-pdf?userId=${userId}`), '_blank');
                }}
                disabled={!ontologyId}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a2744] hover:bg-purple-900/30 border border-purple-500/30 text-purple-400 text-sm font-medium rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center">
              <Cpu className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <h3 className="text-gray-300 font-semibold">Not Generated Yet</h3>
              <p className="text-gray-500 text-sm mt-1 max-w-sm">AI ontology analysis hasn't been run for this project.</p>
            </div>
            {onGenerate && (
              <button
                onClick={onGenerate}
                disabled={generating}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {generating ? <><Loader2 className="w-4 h-4 animate-spin" />Generating...</> : <><Play className="w-4 h-4" />Generate Ontology Report</>}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function UnifiedReportViewer({ projectId, userId, onGenerateOntology, generating, refreshTrigger, onViewExpertReport, onViewOntologyReport, currentUserRole, onReviewReports }: UnifiedReportViewerProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const prevGenerating = useRef(generating);

  const fetchReports = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(api(`/api/projects/${projectId}/unified-reports`), {
        headers: { "x-user-id": userId }
      });
      if (res.ok) setData(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [projectId, userId]);

  // Fetch on mount, projectId/userId/refreshTrigger change
  useEffect(() => {
    fetchReports();
  }, [fetchReports, refreshTrigger]);

  // Re-fetch silently when generation finishes (generating: true -> false)
  useEffect(() => {
    if (prevGenerating.current === true && generating === false) {
      // Generation just finished — wait a moment then refresh
      const timer = setTimeout(() => fetchReports(true), 1500);
      return () => clearTimeout(timer);
    }
    prevGenerating.current = generating;
  }, [generating, fetchReports]);

  // Poll every 20 seconds to stay in sync
  useEffect(() => {
    const interval = setInterval(() => fetchReports(true), 20000);
    return () => clearInterval(interval);
  }, [fetchReports]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mr-3" />
        Loading reports...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Reports</h2>
          <p className="text-gray-400 text-sm mt-1">Both reports now use the same <strong className="text-gray-200">Compliance Score (0–100)</strong> scale — higher is safer.</p>
        </div>
        {currentUserRole === 'admin' && onReviewReports && (
          <button
            onClick={onReviewReports}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            Review & Publish
          </button>
        )}
      </div>

      {/* Score key */}
      <div className="flex flex-wrap gap-3 text-xs">
        {[
          { label: "Minimal Risk", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", range: "75–100" },
          { label: "Limited Risk",  color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/30",   range: "50–74" },
          { label: "High Risk",     color: "text-orange-400",  bg: "bg-orange-500/10",  border: "border-orange-500/30",  range: "25–49" },
          { label: "Unacceptable",  color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/30",     range: "0–24" },
        ].map(b => (
          <span key={b.label} className={`px-3 py-1 rounded-full border ${b.bg} ${b.border} ${b.color} font-medium`}>
            {b.label} ({b.range})
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <ExpertReportCard
          expertReport={data?.expertReport}
          userId={userId}
          apiBase={api}
          onViewReport={onViewExpertReport}
        />
        <div className="flex-1 min-w-[320px]">
          <OntologyReportCard
            ontologyReport={data?.ontologyReport}
            onGenerate={onGenerateOntology}
            generating={generating}
            apiBase={api}
            userId={userId}
          />
        </div>
      </div>
    </div>
  );
}
