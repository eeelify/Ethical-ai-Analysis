import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Database,
  FileText,
  GitBranch,
  Loader2,
  Network,
  RefreshCw,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { api } from "../api";
import { User } from "../types";

interface OntologyAssessmentProps {
  currentUser: User;
  onBack: () => void;
}

interface EthicalImpact {
  principle: string;
  reason: string;
  impact: string;
  severity: string;
  harm_type?: string;
}

interface EthicalTension {
  name: string;
  conflicting_principles?: string[];
  severity?: string;
  description?: string;
  recommendation?: string;
}

interface KeywordMatch {
  keyword: string;
  mapped_category: string;
  risks?: string[];
  regulations?: string[];
  ethical_analysis?: EthicalImpact[];
  ethical_tensions?: EthicalTension[];
}

interface AnalyzeTextResponse {
  matched_keywords?: KeywordMatch[];
  inferred_categories?: string[];
  inferred_risks?: string[];
  inferred_regulations?: string[];
  ethical_analysis?: EthicalImpact[];
  ethical_tensions?: EthicalTension[];
  detected_risk_triggers?: string[];
  detected_safeguards?: string[];
  missing_safeguards?: string[];
  initial_risk_level?: string;
  final_risk_level?: string;
  composite_score?: number;
  score_components?: Record<string, number>;
  reasoning_trace?: string[];
  message?: string;
}

interface TraceStep {
  step: string;
  value: string;
}

interface GraphTraceResponse {
  trace?: TraceStep[];
  explanations?: string[];
}

interface TraceGraphNode {
  id: string;
  step: string;
  value: string;
  label: string;
  level: number;
  x: number;
  y: number;
  color: string;
  bg: string;
}

interface TraceGraphEdge {
  id: string;
  source: string;
  target: string;
  color: string;
}

type ActiveTab = "analyze" | "trace" | "report";
type LoadingAction = ActiveTab | "health" | null;

const sampleDescription =
  "The company uses facial recognition and biometric authentication to monitor employees in public spaces. The system stores biometric templates, flags suspicious movement, and sends alerts to managers.";

const TRACE_STEP_META: Record<string, { label: string; level: number; color: string; bg: string }> = {
  keyword_match: { label: "Keyword", level: 0, color: "#0891b2", bg: "#ecfeff" },
  mapped_category: { label: "AI Category", level: 1, color: "#7c3aed", bg: "#f5f3ff" },
  risk_inference: { label: "Risk", level: 2, color: "#dc2626", bg: "#fef2f2" },
  regulation_inference: { label: "Regulation", level: 3, color: "#2563eb", bg: "#eff6ff" },
  ethical_principle: { label: "Principle", level: 4, color: "#059669", bg: "#ecfdf5" },
  harm_type: { label: "Harm", level: 5, color: "#ea580c", bg: "#fff7ed" },
};

const GRAPH_NODE_WIDTH = 178;
const GRAPH_NODE_HEIGHT = 62;
const GRAPH_COLUMN_WIDTH = 230;
const GRAPH_ROW_HEIGHT = 94;

const getTraceStepMeta = (step: string) =>
  TRACE_STEP_META[step] || { label: normalizeLabel(step), level: 0, color: "#4b5563", bg: "#f9fafb" };

const unique = (items: Array<string | undefined | null>) =>
  Array.from(new Set(items.map((item) => String(item || "").trim()).filter(Boolean)));

const normalizeLabel = (value: string) =>
  value
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();

const severityClass = (severity = "") => {
  const value = severity.toLowerCase();
  if (value.includes("critical")) return "bg-red-50 text-red-700 border-red-200";
  if (value.includes("high")) return "bg-orange-50 text-orange-700 border-orange-200";
  if (value.includes("medium")) return "bg-yellow-50 text-yellow-800 border-yellow-200";
  if (value.includes("low")) return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-gray-50 text-gray-700 border-gray-200";
};

const riskClass = (risk = "") => {
  const value = risk.toLowerCase();
  if (value.includes("prohibited") || value.includes("critical")) return "bg-red-100 text-red-800 border-red-200";
  if (value.includes("high")) return "bg-orange-100 text-orange-800 border-orange-200";
  if (value.includes("limited") || value.includes("medium")) return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (value.includes("minimal") || value.includes("low")) return "bg-blue-100 text-blue-800 border-blue-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
};

const buildTraceGraph = (steps: TraceStep[] = []) => {
  const nodesByKey = new Map<string, TraceGraphNode>();
  const countsByLevel: Record<number, number> = {};
  const edgesByKey = new Map<string, TraceGraphEdge>();
  const occurrences: TraceGraphNode[] = [];

  steps.forEach((step) => {
    const value = String(step.value || "").trim();
    if (!value) return;

    const meta = getTraceStepMeta(step.step);
    const key = `${step.step}:${value}`;
    let node = nodesByKey.get(key);

    if (!node) {
      const row = countsByLevel[meta.level] || 0;
      countsByLevel[meta.level] = row + 1;
      node = {
        id: `node-${nodesByKey.size}`,
        step: step.step,
        value,
        label: meta.label,
        level: meta.level,
        x: 28 + meta.level * GRAPH_COLUMN_WIDTH,
        y: 66 + row * GRAPH_ROW_HEIGHT,
        color: meta.color,
        bg: meta.bg,
      };
      nodesByKey.set(key, node);
    }

    const source =
      [...occurrences]
        .reverse()
        .find((previous) => previous.id !== node?.id && previous.level < meta.level) ||
      occurrences[occurrences.length - 1];

    if (source && source.id !== node.id) {
      const edgeKey = `${source.id}->${node.id}`;
      if (!edgesByKey.has(edgeKey)) {
        edgesByKey.set(edgeKey, {
          id: edgeKey,
          source: source.id,
          target: node.id,
          color: node.color,
        });
      }
    }

    occurrences.push(node);
  });

  const nodes = Array.from(nodesByKey.values());
  const edges = Array.from(edgesByKey.values());
  const maxLevel = nodes.reduce((max, node) => Math.max(max, node.level), 0);
  const maxRows = Math.max(1, ...Object.values(countsByLevel));

  return {
    nodes,
    edges,
    width: 56 + (maxLevel + 1) * GRAPH_COLUMN_WIDTH,
    height: 116 + maxRows * GRAPH_ROW_HEIGHT,
  };
};

async function postOntology<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(api(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.success === false) {
    throw new Error(payload.error || payload.message || `Request failed with ${response.status}`);
  }

  return (payload.data ?? payload.report ?? payload) as T;
}

function Chip({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
      <Sparkles className="mx-auto mb-3 h-8 w-8 text-gray-300" />
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}

function KnowledgeTraceGraph({ traceSteps }: { traceSteps: TraceStep[] }) {
  const graph = useMemo(() => buildTraceGraph(traceSteps), [traceSteps]);
  const nodeById = useMemo(() => {
    const map = new Map<string, TraceGraphNode>();
    graph.nodes.forEach((node) => map.set(node.id, node));
    return map;
  }, [graph.nodes]);

  if (graph.nodes.length === 0) return null;

  const legendItems = Object.values(TRACE_STEP_META).sort((a, b) => a.level - b.level);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center text-base font-semibold text-gray-900">
            <Network className="mr-2 h-5 w-5 text-indigo-600" />
            Knowledge-Based Reasoning Graph
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Trace steps are grouped as ontology nodes and linked by the inferred reasoning path.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {legendItems.map((item) => (
            <span key={item.label} className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700">
              <span className="mr-1.5 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-slate-50">
        <svg
          width={graph.width}
          height={graph.height}
          viewBox={`0 0 ${graph.width} ${graph.height}`}
          className="block min-w-full"
          role="img"
          aria-label="Ontology reasoning graph"
        >
          <defs>
            <marker
              id="ontology-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
          </defs>

          {graph.edges.map((edge) => {
            const source = nodeById.get(edge.source);
            const target = nodeById.get(edge.target);
            if (!source || !target) return null;

            const startX = source.x + GRAPH_NODE_WIDTH;
            const startY = source.y + GRAPH_NODE_HEIGHT / 2;
            const endX = target.x;
            const endY = target.y + GRAPH_NODE_HEIGHT / 2;
            const curve = Math.max(56, (endX - startX) / 2);

            return (
              <path
                key={edge.id}
                d={`M ${startX} ${startY} C ${startX + curve} ${startY}, ${endX - curve} ${endY}, ${endX} ${endY}`}
                fill="none"
                stroke={edge.color}
                strokeOpacity="0.55"
                strokeWidth="2"
                markerEnd="url(#ontology-arrow)"
              />
            );
          })}

          {graph.nodes.map((node) => (
            <g key={node.id}>
              <foreignObject x={node.x} y={node.y} width={GRAPH_NODE_WIDTH} height={GRAPH_NODE_HEIGHT}>
                <div
                  className="flex h-full flex-col justify-center rounded-xl border bg-white px-3 shadow-sm"
                  style={{ borderColor: node.color, backgroundColor: node.bg }}
                >
                  <div className="truncate text-[10px] font-bold uppercase tracking-wide" style={{ color: node.color }}>
                    {node.label}
                  </div>
                  <div className="mt-1 line-clamp-2 text-sm font-semibold leading-tight text-gray-900" title={node.value}>
                    {node.value}
                  </div>
                </div>
              </foreignObject>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function ReportValue({ value, depth = 0 }: { value: unknown; depth?: number }) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-gray-400">No data</span>;
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return <div className="whitespace-pre-wrap leading-relaxed text-gray-700">{String(value)}</div>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-gray-400">No items</span>;
    return (
      <ul className="space-y-2">
        {value.map((item, index) => (
          <li key={index} className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
            <ReportValue value={item} depth={depth + 1} />
          </li>
        ))}
      </ul>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return <span className="text-gray-400">No fields</span>;

    return (
      <div className="space-y-3">
        {entries.map(([key, item]) => (
          <section key={key} className={depth === 0 ? "rounded-xl border border-gray-200 bg-white p-4" : ""}>
            <h4 className="mb-2 text-sm font-semibold capitalize text-gray-900">{normalizeLabel(key)}</h4>
            <ReportValue value={item} depth={depth + 1} />
          </section>
        ))}
      </div>
    );
  }

  return <pre className="text-xs text-gray-600">{JSON.stringify(value, null, 2)}</pre>;
}

export function OntologyAssessment({ currentUser, onBack }: OntologyAssessmentProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("analyze");
  const [systemName, setSystemName] = useState("Standalone AI System");
  const [text, setText] = useState(sampleDescription);
  const [loading, setLoading] = useState<LoadingAction>(null);
  const [health, setHealth] = useState<"checking" | "online" | "offline" | "disabled">("checking");
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzeTextResponse | null>(null);
  const [trace, setTrace] = useState<GraphTraceResponse | null>(null);
  const [report, setReport] = useState<any>(null);

  const matchedKeywords = analysis?.matched_keywords || [];
  const inferredRisks = useMemo(() => {
    return unique([
      ...(analysis?.inferred_risks || []),
      ...matchedKeywords.flatMap((match) => match.risks || []),
      analysis?.final_risk_level,
    ]).filter((risk) => risk.toLowerCase() !== "unknown");
  }, [analysis, matchedKeywords]);

  const serviceBadge = {
    checking: "bg-gray-100 text-gray-700 border-gray-200",
    online: "bg-green-100 text-green-800 border-green-200",
    offline: "bg-red-100 text-red-800 border-red-200",
    disabled: "bg-yellow-100 text-yellow-800 border-yellow-200",
  }[health];

  const checkHealth = async () => {
    setLoading("health");
    try {
      const response = await fetch(api("/api/ontology/health"));
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload.success === false) {
        setHealth("offline");
        return;
      }
      setHealth(payload.data?.status === "disabled" ? "disabled" : "online");
    } catch {
      setHealth("offline");
    } finally {
      setLoading(null);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const ensureText = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Please describe an AI system before running ontology assessment.");
      return null;
    }
    setError(null);
    return trimmed;
  };

  const runAnalyze = async () => {
    const trimmed = ensureText();
    if (!trimmed) return;

    setLoading("analyze");
    try {
      const data = await postOntology<AnalyzeTextResponse>("/api/ontology/analyze-text", { text: trimmed });
      setAnalysis(data);
      setActiveTab("analyze");
    } catch (err: any) {
      setError(err.message || "Ontology analysis failed.");
    } finally {
      setLoading(null);
    }
  };

  const runTrace = async () => {
    const trimmed = ensureText();
    if (!trimmed) return;

    setLoading("trace");
    try {
      const data = await postOntology<GraphTraceResponse>("/api/ontology/graph-trace", { text: trimmed });
      setTrace(data);
      setActiveTab("trace");
    } catch (err: any) {
      setError(err.message || "Ontology trace failed.");
    } finally {
      setLoading(null);
    }
  };

  const runReport = async () => {
    const trimmed = ensureText();
    if (!trimmed) return;

    setLoading("report");
    try {
      const data = await postOntology<any>("/api/ontology/text-report", {
        systemName: systemName.trim() || "Standalone AI System",
        text: trimmed,
      });
      setReport(data);
      setActiveTab("report");
    } catch (err: any) {
      setError(err.message || "Ontology report generation failed.");
    } finally {
      setLoading(null);
    }
  };

  const downloadReportJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(systemName || "ontology-report").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const tabButton = (tab: ActiveTab, label: string, Icon: React.ComponentType<{ className?: string }>) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        activeTab === tab ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Ontology Assessment</h1>
              <p className="text-sm text-gray-500">
                Run a standalone ontology-based assessment outside the normal project workflow.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Chip className={serviceBadge}>
              <Database className="mr-1.5 h-3.5 w-3.5" />
              Ontology {health}
            </Chip>
            <button
              onClick={checkHealth}
              disabled={loading === "health"}
              className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              {loading === "health" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Check
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-6">
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Current user</p>
            <p className="mt-2 text-sm font-semibold text-gray-900">{currentUser.name}</p>
            <p className="text-xs capitalize text-gray-500">{currentUser.role.replace(/-/g, " ")}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Final risk</p>
            <p className="mt-2 text-sm font-semibold text-gray-900">{analysis?.final_risk_level || "Not analyzed"}</p>
            <p className="text-xs text-gray-500">Ontology classification</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Composite score</p>
            <p className="mt-2 text-sm font-semibold text-gray-900">
              {typeof analysis?.composite_score === "number" ? analysis.composite_score.toFixed(2) : "Not available"}
            </p>
            <p className="text-xs text-gray-500">Deterministic scoring</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Trace steps</p>
            <p className="mt-2 text-sm font-semibold text-gray-900">{trace?.trace?.length || 0}</p>
            <p className="text-xs text-gray-500">Explainability chain</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[390px,1fr]">
          <aside className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <label className="block text-sm font-medium text-gray-700">System name</label>
              <input
                value={systemName}
                onChange={(event) => setSystemName(event.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Example: Student Risk Predictor"
              />

              <label className="mt-4 block text-sm font-medium text-gray-700">AI system description</label>
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                className="mt-2 h-56 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm leading-6 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Describe inputs, purpose, users, automation level, affected people, and safeguards."
              />

              {error && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-4 grid gap-2">
                <button
                  onClick={runAnalyze}
                  disabled={loading !== null}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading === "analyze" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Activity className="mr-2 h-4 w-4" />}
                  Analyze Ontology
                </button>
                <button
                  onClick={runTrace}
                  disabled={loading !== null}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-60"
                >
                  {loading === "trace" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GitBranch className="mr-2 h-4 w-4" />}
                  Explain Reasoning
                </button>
                <button
                  onClick={runReport}
                  disabled={loading !== null}
                  className="inline-flex items-center justify-center rounded-lg border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-medium text-purple-700 hover:bg-purple-100 disabled:opacity-60"
                >
                  {loading === "report" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                  Generate Report
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
              This section uses the normal backend proxy at <span className="font-mono">/api/ontology</span>, so it stays compatible with the existing frontend/backend architecture.
            </div>
          </aside>

          <section className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {tabButton("analyze", "Analysis", Activity)}
              {tabButton("trace", "Reasoning Trace", GitBranch)}
              {tabButton("report", "Report", FileText)}
            </div>

            {activeTab === "analyze" && (
              <div className="space-y-4">
                {!analysis ? (
                  <EmptyState title="No ontology analysis yet" description="Describe an AI system and run Analyze Ontology." />
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                      <div className="rounded-xl border border-gray-200 bg-white p-5">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                          <ShieldAlert className="h-4 w-4 text-red-500" />
                          Risk Classification
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {inferredRisks.length > 0 ? inferredRisks.map((risk) => (
                            <Chip key={risk} className={riskClass(risk)}>{risk}</Chip>
                          )) : <span className="text-sm text-gray-500">No risk inferred</span>}
                        </div>
                      </div>

                      <div className="rounded-xl border border-gray-200 bg-white p-5">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                          <Activity className="h-4 w-4 text-purple-500" />
                          Categories
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {(analysis.inferred_categories || []).length > 0 ? analysis.inferred_categories?.map((category) => (
                            <Chip key={category} className="bg-purple-50 text-purple-700 border-purple-200">{category}</Chip>
                          )) : <span className="text-sm text-gray-500">No category inferred</span>}
                        </div>
                      </div>

                      <div className="rounded-xl border border-gray-200 bg-white p-5">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                          <BookOpen className="h-4 w-4 text-blue-500" />
                          Regulations
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {(analysis.inferred_regulations || []).length > 0 ? analysis.inferred_regulations?.map((regulation) => (
                            <Chip key={regulation} className="bg-blue-50 text-blue-700 border-blue-200">{regulation}</Chip>
                          )) : <span className="text-sm text-gray-500">No regulation inferred</span>}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-5">
                      <h3 className="mb-4 text-base font-semibold text-gray-900">Matched Keywords</h3>
                      {matchedKeywords.length === 0 ? (
                        <p className="text-sm text-gray-500">No keyword matches returned.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead>
                              <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                                <th className="py-2 pr-4">Keyword</th>
                                <th className="py-2 pr-4">Category</th>
                                <th className="py-2 pr-4">Risks</th>
                                <th className="py-2 pr-4">Regulations</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {matchedKeywords.map((match, index) => (
                                <tr key={`${match.keyword}-${index}`}>
                                  <td className="py-3 pr-4 font-medium text-gray-900">{match.keyword}</td>
                                  <td className="py-3 pr-4 text-gray-700">{match.mapped_category}</td>
                                  <td className="py-3 pr-4 text-gray-600">{(match.risks || []).join(", ") || "-"}</td>
                                  <td className="py-3 pr-4 text-gray-600">{(match.regulations || []).join(", ") || "-"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                      <div className="rounded-xl border border-gray-200 bg-white p-5">
                        <h3 className="mb-4 flex items-center text-base font-semibold text-gray-900">
                          <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
                          Ethical Impacts
                        </h3>
                        {(analysis.ethical_analysis || []).length === 0 ? (
                          <p className="text-sm text-gray-500">No ethical impacts returned.</p>
                        ) : (
                          <div className="space-y-3">
                            {analysis.ethical_analysis?.map((item, index) => (
                              <div key={`${item.principle}-${index}`} className="rounded-lg border border-gray-200 p-4">
                                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                  <h4 className="font-semibold text-gray-900">{item.principle}</h4>
                                  <Chip className={severityClass(item.severity)}>{item.severity || "Unrated"}</Chip>
                                </div>
                                <p className="text-sm text-gray-600">{item.reason}</p>
                                <p className="mt-2 text-sm text-gray-600">{item.impact}</p>
                                {item.harm_type && <p className="mt-2 text-xs font-medium text-orange-700">Harm: {item.harm_type}</p>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="rounded-xl border border-gray-200 bg-white p-5">
                        <h3 className="mb-4 flex items-center text-base font-semibold text-gray-900">
                          <ShieldAlert className="mr-2 h-5 w-5 text-red-500" />
                          Tensions and Safeguards
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Detected safeguards</p>
                            <div className="flex flex-wrap gap-2">
                              {(analysis.detected_safeguards || []).length > 0 ? analysis.detected_safeguards?.map((item) => (
                                <Chip key={item} className="bg-green-50 text-green-700 border-green-200">
                                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                                  {item}
                                </Chip>
                              )) : <span className="text-sm text-gray-500">No safeguards detected</span>}
                            </div>
                          </div>
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Missing safeguards</p>
                            <div className="flex flex-wrap gap-2">
                              {(analysis.missing_safeguards || []).length > 0 ? analysis.missing_safeguards?.map((item) => (
                                <Chip key={item} className="bg-red-50 text-red-700 border-red-200">{item}</Chip>
                              )) : <span className="text-sm text-gray-500">No missing safeguards returned</span>}
                            </div>
                          </div>
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Ethical tensions</p>
                            {(analysis.ethical_tensions || []).length > 0 ? (
                              <div className="space-y-2">
                                {analysis.ethical_tensions?.map((tension, index) => (
                                  <div key={`${tension.name}-${index}`} className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
                                    <div className="font-semibold text-gray-900">{tension.name}</div>
                                    {tension.description && <div className="mt-1 text-gray-600">{tension.description}</div>}
                                    {tension.recommendation && <div className="mt-2 text-xs text-blue-700">{tension.recommendation}</div>}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">No tensions returned</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === "trace" && (
              <div className="space-y-4">
                {!trace?.trace?.length ? (
                  <EmptyState title="No reasoning trace yet" description="Run Explain Reasoning to see deterministic ontology steps." />
                ) : (
                  <>
                    <KnowledgeTraceGraph traceSteps={trace.trace} />
                    <div className="rounded-xl border border-gray-200 bg-white p-5">
                      <h3 className="mb-4 text-base font-semibold text-gray-900">Reasoning Timeline</h3>
                      <div className="space-y-3">
                        {trace.trace.map((step, index) => (
                          <div key={`${step.step}-${step.value}-${index}`} className="flex gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                              {index + 1}
                            </div>
                            <div>
                              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">{normalizeLabel(step.step)}</div>
                              <div className="mt-1 text-sm font-medium text-gray-900">{step.value}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === "report" && (
              <div className="space-y-4">
                {!report ? (
                  <EmptyState title="No ontology report yet" description="Run Generate Report to create a GraphRAG-backed report." />
                ) : (
                  <>
                    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">Generated Ontology Report</h3>
                        <p className="text-sm text-gray-500">System: {report.system || systemName || "Standalone AI System"}</p>
                      </div>
                      <button
                        onClick={downloadReportJson}
                        className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Download JSON
                      </button>
                    </div>
                    <ReportValue value={report.report || report} />
                  </>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
