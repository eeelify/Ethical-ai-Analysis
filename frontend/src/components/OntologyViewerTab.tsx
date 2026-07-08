import React from 'react';
import { Database, Network, Share2, Layers } from 'lucide-react';

export function OntologyViewerTab() {
  return (
    <div className="flex-1 h-full flex flex-col bg-[#050b14] overflow-hidden">
      <div className="px-8 py-6 border-b border-white/10 shrink-0">
        <h2 className="text-2xl font-bold text-white mb-2">Ontology Explorer</h2>
        <p className="text-slate-400 text-sm max-w-3xl">
          Visualizing the OWL/SWRL representation of the Z-Inspection process mapped to EU AI Act compliance.
          Nodes represent principles, roles, and project metadata, while edges define their deterministic relationships.
        </p>
      </div>

      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar flex flex-col">
        {/* Placeholder for Ontology Graph Visualization */}
        <div className="w-full flex-1 min-h-[400px] border border-white/10 rounded-2xl bg-[#0a1122] flex flex-col items-center justify-center relative overflow-hidden group">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/30 mb-6 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <Network className="w-12 h-12 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Ontology Graph Viewer</h3>
            <p className="text-slate-400 text-center max-w-md mb-8">
              The graph visualization engine is currently connecting to the reasoning server. Once connected, the full RDF/OWL graph will be rendered here.
            </p>
            
            <button className="px-6 py-2.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 transition-all font-medium flex items-center shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <Database className="w-4 h-4 mr-2" />
              Connect to Ontology Engine
            </button>
          </div>
        </div>

        {/* Legend / Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 shrink-0">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-white">Ontology Classes</h4>
            </div>
            <div className="text-3xl font-bold text-slate-200">142</div>
            <p className="text-xs text-slate-400 mt-1">Core AI Act & Ethics concepts mapped</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400">
                <Share2 className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-white">Object Properties</h4>
            </div>
            <div className="text-3xl font-bold text-slate-200">284</div>
            <p className="text-xs text-slate-400 mt-1">Relationships and constraints defined</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-white">SWRL Rules</h4>
            </div>
            <div className="text-3xl font-bold text-slate-200">36</div>
            <p className="text-xs text-slate-400 mt-1">Active logical inference rules</p>
          </div>
        </div>
      </div>
    </div>
  );
}
