import React, { useState, useEffect, useRef } from 'react';
import { Database, Network, AlertCircle, RefreshCw, X, Info, ChevronRight } from 'lucide-react';
import ForceGraph2D from 'react-force-graph-2d';
import { api } from '../api';

const NODE_TYPES: Record<string, { label: string; color: string; description: string }> = {
  'AI_Category':         { label: 'AI Categories',        color: '#06b6d4', description: 'Types of AI systems (Healthcare, Education, Finance, etc.)' },
  'RiskLevel':           { label: 'Risk Levels',           color: '#ef4444', description: 'EU AI Act risk classifications for the AI system' },
  'Regulation':          { label: 'Regulations',           color: '#eab308', description: 'Legal frameworks: EU AI Act, GDPR, KVKK, ISO 42001' },
  'EthicalPrinciple':    { label: 'Ethical Principles',    color: '#8b5cf6', description: 'Core ethics values: Fairness, Transparency, Accountability' },
  'EthicalTension':      { label: 'Ethical Tensions',      color: '#f97316', description: 'Conflicts and trade-offs between ethical principles' },
  'EthicalViolation':    { label: 'Ethical Violations',    color: '#ec4899', description: 'Identified breaches of ethical principles in the AI system' },
  'ProtectionMechanism': { label: 'Protection Mechanisms', color: '#22c55e', description: 'Safeguards and mitigation strategies to reduce risk' },
  'Evidence':            { label: 'Evidence',              color: '#3b82f6', description: 'Supporting data, facts, and documentation' },
  'Keyword':             { label: 'Keywords',              color: '#475569', description: 'Domain keywords extracted from the AI system context' },
  'Harm':                { label: 'Harms',                 color: '#f43f5e', description: 'Potential negative impacts identified during inspection' },
  'Stakeholder':         { label: 'Stakeholders',          color: '#fb923c', description: 'Affected parties: End Users, Regulators, Developers' },
  'Recommendation':      { label: 'Recommendations',       color: '#0d9488', description: 'Action items to improve ethical compliance' },
  'Assessment':          { label: 'Assessments',           color: '#0284c7', description: 'Evaluation checkpoints in the Z-Inspection process' },
  'Fact':                { label: 'Facts',                 color: '#64748b', description: 'Observed and documented facts about the AI system' },
  'Safeguard':           { label: 'Safeguards',            color: '#16a34a', description: 'Protective measures currently in place' },
  'RiskMetric':          { label: 'Risk Metrics',          color: '#dc2626', description: 'Measurable indicators used to quantify risk' },
  'RiskThreshold':       { label: 'Risk Thresholds',       color: '#b91c1c', description: 'Acceptable risk limit values defined by regulation' },
};

export function OntologyViewerTab() {
  const [graphData, setGraphData]         = useState<{ nodes: any[]; links: any[] } | null>(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const [showKeywords, setShowKeywords]   = useState(false);
  const [highlightNodes, setHighlightNodes] = useState(new Set<any>());
  const [highlightLinks, setHighlightLinks] = useState(new Set<any>());
  const [selectedNode, setSelectedNode]   = useState<any>(null);
  const [dimensions, setDimensions]       = useState({ width: 800, height: 500 });
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef        = useRef<any>(null);
  const rawData      = useRef<{ nodes: any[]; links: any[] } | null>(null);

  // Auto-resize using ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height || 500
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Physics
  useEffect(() => {
    if (fgRef.current && graphData) {
      fgRef.current.d3Force('charge').strength(-160);
      fgRef.current.d3Force('link').distance(50);
    }
  }, [graphData]);

  const buildFilteredGraph = (nodes: any[], links: any[], withKeywords: boolean) => {
    const visible = withKeywords ? nodes : nodes.filter(n => n.group !== 'Keyword');
    const ids     = new Set(visible.map(n => n.id));
    const visibleLinks = links.filter(l => ids.has(l.source) && ids.has(l.target));

    // Compute degree for sizing
    const degree: Record<string, number> = {};
    visible.forEach(n => { degree[n.id] = 0; });
    visibleLinks.forEach(l => {
      const s = typeof l.source === 'object' ? l.source.id : l.source;
      const t = typeof l.target === 'object' ? l.target.id : l.target;
      if (degree[s] !== undefined) degree[s]++;
      if (degree[t] !== undefined) degree[t]++;
    });

    const maxDegree = Math.max(1, ...Object.values(degree));

    return {
      nodes: visible.map(n => ({ ...n, degree: degree[n.id] || 0, maxDegree })),
      links: visibleLinks
    };
  };

  const fetchGraphData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(api('/api/ontology/graph'));
      if (!res.ok) throw new Error('Failed to fetch ontology graph');
      const json = await res.json();
      if (json.success && json.data) {
        const nodes = json.data.nodes.map((n: any) => ({ id: n.id, name: n.name, group: n.label_type }));
        const links = json.data.edges.map((e: any) => ({ source: e.source, target: e.target, name: e.label }));
        rawData.current = { nodes, links };
        setGraphData(buildFilteredGraph(nodes, links, false));
      } else {
        throw new Error(json.error || 'Invalid graph data format');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleKeywords = () => {
    if (!rawData.current) return;
    const next = !showKeywords;
    setShowKeywords(next);
    setSelectedNode(null);
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
    setGraphData(buildFilteredGraph(rawData.current.nodes, rawData.current.links, next));
  };

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
    const nSet = new Set<any>([node]);
    const lSet = new Set<any>();
    graphData?.links.forEach(link => {
      const sId = typeof link.source === 'object' ? link.source.id : link.source;
      const tId = typeof link.target === 'object' ? link.target.id : link.target;
      if (sId === node.id || tId === node.id) {
        lSet.add(link);
        const other = graphData.nodes.find(n => n.id === (sId === node.id ? tId : sId));
        if (other) nSet.add(other);
      }
    });
    setHighlightNodes(nSet);
    setHighlightLinks(lSet);
  };

  const handleBgClick = () => {
    setSelectedNode(null);
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
  };

  const getNodeColor = (group: string) => NODE_TYPES[group]?.color || '#cbd5e1';

  const keywordCount = rawData.current ? rawData.current.nodes.filter(n => n.group === 'Keyword').length : 0;

  return (
    <div className="flex-1 w-full h-full max-w-full max-h-full flex flex-col bg-[#050b14] overflow-hidden min-w-0 min-h-0">

      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 shrink-0 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-white">Ontology Explorer</h2>
          <p className="text-slate-400 text-xs mt-1 truncate">
            OWL/SWRL graph mapped to EU AI Act &amp; ISO 42001 ·
            <span className="text-cyan-400 ml-1">Click any node to explore connections</span>
          </p>
        </div>
        {graphData && (
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 bg-[#0b1221]/5 border border-white/10 px-2 py-1 rounded">
                <strong className="text-white">{graphData.nodes.length}</strong> nodes
              </span>
              <span className="text-xs text-slate-400 bg-[#0b1221]/5 border border-white/10 px-2 py-1 rounded">
                <strong className="text-white">{graphData.links.length}</strong> connections
              </span>
              <span className="text-xs text-slate-400 bg-[#0b1221]/5 border border-white/10 px-2 py-1 rounded">
                <strong className="text-white">36</strong> SWRL rules
              </span>
            </div>
            <button onClick={toggleKeywords} className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showKeywords
                ? 'bg-slate-500/20 border-slate-500/40 text-slate-300 hover:bg-slate-500/30'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
            }`}>
              {showKeywords ? `Hide ${keywordCount} Keywords` : `Show ${keywordCount} Keywords`}
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 flex w-full max-w-full overflow-hidden min-w-0 min-h-0 relative">

        {/* ─── Graph Area ─── */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div ref={containerRef} className="flex-1 relative bg-[#050b14] min-w-0 min-h-0">

            {!graphData ? (
              /* Landing */
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="relative z-10 flex flex-col items-center text-center max-w-md">
                  <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/30 mb-6 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                    {loading ? <RefreshCw className="w-12 h-12 text-cyan-400 animate-spin" />
                              : error ? <AlertCircle className="w-12 h-12 text-red-400" />
                              : <Network className="w-12 h-12 text-cyan-400" />}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {error ? 'Connection Failed' : 'Ontology Graph Viewer'}
                  </h3>
                  <p className={`mb-8 text-sm ${error ? 'text-red-400' : 'text-slate-400'}`}>
                    {error || 'Connect to load the full RDF/OWL ontology graph of the Z-Inspection process.'}
                  </p>
                  <button onClick={fetchGraphData} disabled={loading}
                    className="px-6 py-2.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 transition-all font-medium flex items-center shadow-[0_0_15px_rgba(34,211,238,0.2)] disabled:opacity-50">
                    <Database className="w-4 h-4 mr-2" />
                    {loading ? 'Connecting...' : error ? 'Retry Connection' : 'Connect to Ontology Engine'}
                  </button>
                </div>
              </div>
            ) : (
              <>

                {/* Hint overlay */}
                {!selectedNode && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-black/70 backdrop-blur-sm border border-white/10 rounded-full text-xs text-slate-400 pointer-events-none whitespace-nowrap">
                    Click any node to focus · Scroll to zoom · Drag to pan
                  </div>
                )}

                <ForceGraph2D
                  ref={fgRef}
                  width={dimensions.width}
                  height={dimensions.height}
                  graphData={graphData}
                  nodeLabel={() => ''}
                  onNodeClick={handleNodeClick}
                  onBackgroundClick={handleBgClick}
                  nodeCanvasObject={(node: any, ctx, globalScale) => {
                    const isHL   = highlightNodes.size === 0 || highlightNodes.has(node);
                    const isSel  = node === selectedNode;
                    const color  = getNodeColor(node.group);

                    // Size based on degree (importance)
                    const maxDeg = node.maxDegree || 1;
                    const deg    = node.degree || 0;
                    const baseSize = node.group === 'Keyword' ? 2.5 : 4;
                    const size   = baseSize + (deg / maxDeg) * 8;
                    const drawSize = isSel ? size * 1.4 : size;

                    // Glow for selected
                    if (isSel) {
                      ctx.beginPath();
                      ctx.arc(node.x, node.y, drawSize + 6, 0, 2 * Math.PI);
                      ctx.fillStyle = color + '30';
                      ctx.fill();
                    }

                    // Main circle
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, drawSize, 0, 2 * Math.PI, false);
                    ctx.fillStyle = isHL ? color : 'rgba(255,255,255,0.05)';
                    ctx.fill();

                    // White ring for selected
                    if (isSel) {
                      ctx.beginPath();
                      ctx.arc(node.x, node.y, drawSize + 2.5, 0, 2 * Math.PI);
                      ctx.strokeStyle = '#ffffff';
                      ctx.lineWidth = 1.5 / globalScale;
                      ctx.stroke();
                    }

                    // Always show label for important nodes (top 30% by degree), or in focus/zoom mode
                    const importanceThreshold = node.maxDegree * 0.3;
                    const isImportant = (node.degree || 0) >= importanceThreshold && node.group !== 'Keyword';
                    const showLabel = isHL && (highlightNodes.size > 0 || globalScale >= 1.5 || isImportant);
                    if (showLabel) {
                      const label = node.name;
                      const fs = Math.max(10, (isSel ? 15 : 12)) / globalScale;
                      ctx.font = `${isSel ? 'bold ' : ''}${fs}px sans-serif`;
                      const tw  = ctx.measureText(label).width;
                      const pad = fs * 0.35;
                      const rx  = node.x - tw / 2 - pad;
                      const ry  = node.y + drawSize + 3;
                      const rw  = tw + pad * 2;
                      const rh  = fs + pad * 1.4;

                      // Label bg
                      ctx.fillStyle = isSel ? color + 'f0' : 'rgba(5,11,20,0.88)';
                      ctx.beginPath();
                      ctx.roundRect(rx, ry, rw, rh, 3 / globalScale);
                      ctx.fill();

                      if (!isSel && highlightNodes.size > 0) {
                        ctx.strokeStyle = color + '70';
                        ctx.lineWidth   = 0.8 / globalScale;
                        ctx.stroke();
                      }

                      ctx.textAlign    = 'center';
                      ctx.textBaseline = 'middle';
                      ctx.fillStyle    = isSel ? '#000' : '#e2e8f0';
                      ctx.fillText(label, node.x, ry + rh / 2);
                    }
                  }}
                  linkColor={(link: any) =>
                    highlightLinks.size === 0
                      ? 'rgba(255,255,255,0.18)'
                      : highlightLinks.has(link)
                      ? 'rgba(6,182,212,0.9)'
                      : 'rgba(255,255,255,0.03)'}
                  linkWidth={(link: any) => (highlightLinks.size > 0 && highlightLinks.has(link)) ? 2 : 0.8}
                  linkDirectionalArrowLength={(link: any) => highlightLinks.has(link) ? 5 : 3}
                  linkDirectionalArrowRelPos={1}
                  linkCanvasObjectMode={() => 'after'}
                  linkCanvasObject={(link: any, ctx, globalScale) => {
                    if (!highlightLinks.has(link)) return;
                    const s = link.source, t = link.target;
                    if (typeof s !== 'object' || typeof t !== 'object') return;
                    const mx  = (s.x + t.x) / 2;
                    const my  = (s.y + t.y) / 2;
                    const lbl = (link.name || '').replace(/_/g, ' ');
                    if (!lbl) return;
                    const fs  = 10 / globalScale;
                    ctx.font  = `${fs}px sans-serif`;
                    const tw  = ctx.measureText(lbl).width;
                    const pad = fs * 0.4;
                    ctx.fillStyle = 'rgba(6,182,212,0.92)';
                    ctx.beginPath();
                    ctx.roundRect(mx - tw / 2 - pad, my - fs / 2 - pad, tw + pad * 2, fs + pad * 2, 3 / globalScale);
                    ctx.fill();
                    ctx.textAlign    = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle    = '#000';
                    ctx.fillText(lbl, mx, my);
                  }}
                />
              </>
            )}
          </div>


        </div>

        {/* ─── Side Panel (Absolute Overlay) ─── */}
        {selectedNode && (
          <div className="absolute right-0 top-0 bottom-0 w-72 border-l border-white/10 bg-[#080f1f] flex flex-col shadow-2xl z-50">

            {/* Node header */}
            <div className="p-5 border-b border-white/10">
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: getNodeColor(selectedNode.group) + '25', color: getNodeColor(selectedNode.group) }}>
                  {NODE_TYPES[selectedNode.group]?.label || selectedNode.group}
                </span>
                <button onClick={handleBgClick} className="text-slate-500 hover:text-white shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-white font-bold text-base leading-snug mb-1">{selectedNode.name}</h3>
              <p className="text-slate-500 text-xs">{selectedNode.degree} direct connection{selectedNode.degree !== 1 ? 's' : ''}</p>
            </div>

            {/* Description */}
            {NODE_TYPES[selectedNode.group]?.description && (
              <div className="px-5 pt-4">
                <div className="p-3 bg-[#0b1221]/5 rounded-lg border border-white/10 flex gap-2">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300 leading-relaxed">{NODE_TYPES[selectedNode.group].description}</p>
                </div>
              </div>
            )}

            {/* Connected nodes list */}
            <div className="flex-1 overflow-y-auto p-5">
              <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider font-semibold">
                Connected Nodes ({highlightNodes.size - 1})
              </p>
              <div className="flex flex-col gap-1.5">
                {Array.from(highlightNodes)
                  .filter(n => n !== selectedNode)
                  .sort((a: any, b: any) => (b.degree || 0) - (a.degree || 0))
                  .map((n: any, i) => (
                    <button key={i} onClick={() => handleNodeClick(n)}
                      className="flex items-center gap-2.5 px-3 py-2 bg-[#0b1221]/5 hover:bg-[#0b1221]/10 rounded-lg text-left transition-all group">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: getNodeColor(n.group) }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white truncate font-medium">{n.name}</p>
                        <p className="text-xs text-slate-500 truncate">{NODE_TYPES[n.group]?.label || n.group}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400 shrink-0" />
                    </button>
                  ))}
                {highlightNodes.size <= 1 && (
                  <p className="text-xs text-slate-600 italic">No connections visible in current view</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Legend ─── */}
      {graphData && (
        <div className="border-t border-white/10 bg-[#080f1f] shrink-0 px-6 py-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider shrink-0">Legend:</span>
            {Object.entries(NODE_TYPES).map(([type, meta]) => {
              const hasNodes = graphData.nodes.some(n => n.group === type);
              if (!hasNodes) return null;
              return (
                <div key={type} className="flex items-center gap-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
                  <span className="text-xs text-slate-400">{meta.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
