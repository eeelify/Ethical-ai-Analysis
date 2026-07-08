import React, { useState, useEffect } from 'react';
import { Shield, Brain, Network, FileText, Download, Scale, ArrowRight, Zap, CheckCircle2, Menu, X, BookOpen, Gavel, GitMerge, Layers, Users, FlaskConical, AlertTriangle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function HomePage({ navigateTo }: { navigateTo?: (path: string) => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (path: string) => {
    if (navigateTo) {
      navigateTo(path);
    } else {
      window.location.href = path;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#050b14] font-sans text-slate-300 overflow-x-hidden selection:bg-indigo-500/30"
    >
      
      {/* Background ambient glow */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-900/20 blur-[120px]"></div>
      </div>

      {/* Navigation Bar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#050b14]/80 backdrop-blur-lg border-b border-white/5 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigate('/')}>
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">EthicAI Platform</span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-colors">About</a>
              <a href="#architecture" className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-colors">Architecture</a>
              <a href="#features" className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-colors">Features</a>
              <a href="#scoring" className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-colors">Scoring</a>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => handleNavigate('/login')}
                className="text-slate-300 hover:text-white font-medium px-4 py-2 text-sm transition-colors"
              >
                Log In
              </button>
              <button 
                onClick={() => handleNavigate('/register')}
                className="bg-white/5 border border-white/10 text-white px-5 py-2 text-sm rounded-lg font-medium hover:bg-white/10 hover:border-cyan-500/50 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-300 hover:text-white">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#050b14]/95 backdrop-blur-xl border-b border-white/5 py-4 px-4 flex flex-col gap-4 shadow-2xl">
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-cyan-400 font-medium p-2 rounded-md hover:bg-white/5">About</a>
            <a href="#architecture" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-cyan-400 font-medium p-2 rounded-md hover:bg-white/5">Architecture</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-cyan-400 font-medium p-2 rounded-md hover:bg-white/5">Features</a>
            <a href="#scoring" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-cyan-400 font-medium p-2 rounded-md hover:bg-white/5">Scoring</a>
            <div className="h-px bg-white/10 my-2"></div>
            <button onClick={() => handleNavigate('/login')} className="text-left text-slate-300 hover:text-white font-medium p-2">Log In</button>
            <button onClick={() => handleNavigate('/register')} className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white p-3 rounded-lg font-medium text-center shadow-lg">Sign Up</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-48 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight max-w-4xl">
          Ontology-Driven <br className="hidden sm:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-300 drop-shadow-sm">
            Ethical AI Assessment
          </span>
        </h1>
        
        <p className="mt-4 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Evaluate AI systems with ontology-based reasoning, knowledge graphs, ethical tension detection, and GraphRAG-supported reporting.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
          <button 
            onClick={() => handleNavigate('/register')}
            className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl font-semibold text-white overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative flex items-center justify-center gap-2">
              Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          <button 
            onClick={() => handleNavigate('/login')}
            className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm"
          >
            Log In
          </button>
        </div>
      </section>

      {/* About Section - Part 1: Header */}
      <section id="about" className="pt-24 pb-0 relative z-10 border-t border-white/5 bg-[#0a1122]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold tracking-wider uppercase mb-6">
              <BookOpen className="w-4 h-4" /> About the Platform
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Where Two Frameworks<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-300">Become One Rigorous Standard</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              This platform is the confluence of two internationally recognised methodologies — the <strong className="text-slate-200">EU AI Act</strong> and the <strong className="text-slate-200">Z-Inspection® process</strong> — unified through an <strong className="text-slate-200">OWL/SWRL ontology reasoning engine</strong> that replaces guesswork with deterministic logic.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Section - Part 2: EU AI Act & Z-Inspection side by side */}
      <section className="py-0 pb-16 relative z-10 bg-[#0a1122]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">

            {/* EU AI Act Card */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="relative rounded-3xl overflow-hidden border border-rose-500/20 bg-gradient-to-br from-rose-950/30 to-[#0a1122] p-8 shadow-xl">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-rose-500/5 blur-3xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                  <Gavel className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <div className="text-xs text-rose-400 font-semibold uppercase tracking-wider">Regulatory Backbone</div>
                  <h3 className="text-xl font-bold text-white">EU AI Act</h3>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                The <strong className="text-slate-300">EU Artificial Intelligence Act</strong> (Regulation 2024/1689) is the world's first comprehensive legal framework governing AI systems. It categorises AI applications by risk — <em className="text-rose-300">Unacceptable, High, Limited</em> and <em className="text-rose-300">Minimal</em> — and mandates transparency, human oversight, and accountability measures proportional to that risk level.
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Risk Classification', desc: 'Unacceptable → High → Limited → Minimal risk tiers', color: 'text-rose-400' },
                  { label: 'Transparency Obligations', desc: 'Documentation, logging & explainability requirements', color: 'text-amber-400' },
                  { label: 'Human Oversight', desc: 'Mandatory human control for high-risk AI systems', color: 'text-emerald-400' },
                  { label: 'Conformity Assessment', desc: 'Third-party audits & CE marking for high-risk AI', color: 'text-cyan-400' },
                  { label: 'Fundamental Rights', desc: 'Non-discrimination, privacy & dignity safeguards', color: 'text-indigo-400' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:border-rose-500/20 transition-colors">
                    <ChevronRight className={`w-4 h-4 mt-0.5 shrink-0 ${item.color}`} />
                    <div>
                      <span className="text-slate-200 text-sm font-medium">{item.label}</span>
                      <span className="text-slate-500 text-xs block mt-0.5">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl bg-rose-500/5 border border-rose-500/15">
                <p className="text-xs text-rose-300/80 leading-relaxed">
                  <strong className="text-rose-300">Our role:</strong> We map every questionnaire answer and detected ethical tension directly to the corresponding AI Act article and risk category — providing audit-ready compliance evidence out of the box.
                </p>
              </div>
            </motion.div>

            {/* Z-Inspection Card */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="relative rounded-3xl overflow-hidden border border-indigo-500/20 bg-gradient-to-br from-indigo-950/30 to-[#0a1122] p-8 shadow-xl">
              <div className="absolute top-0 left-0 w-48 h-48 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <FlaskConical className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Evaluation Methodology</div>
                  <h3 className="text-xl font-bold text-white">Z-Inspection®</h3>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                <strong className="text-slate-300">Z-Inspection®</strong> is an internationally adopted process for assessing the trustworthiness of AI systems, co-created by researchers across EU institutions. Grounded in the EU High-Level Expert Group's <em className="text-indigo-300">7 Requirements for Trustworthy AI</em>, it uses structured expert deliberation and scenario analysis to surface ethical issues that checklists alone cannot capture.
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Human Agency & Oversight', color: 'text-indigo-400' },
                  { label: 'Technical Robustness & Safety', color: 'text-cyan-400' },
                  { label: 'Privacy & Data Governance', color: 'text-teal-400' },
                  { label: 'Transparency & Explainability', color: 'text-amber-400' },
                  { label: 'Diversity, Non-discrimination & Fairness', color: 'text-rose-400' },
                  { label: 'Societal & Environmental Wellbeing', color: 'text-emerald-400' },
                  { label: 'Accountability', color: 'text-purple-400' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/3 border border-white/5 hover:border-indigo-500/20 transition-colors">
                    <div className={`w-2 h-2 rounded-full bg-current shrink-0 ${item.color}`} />
                    <span className="text-slate-300 text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
                <p className="text-xs text-indigo-300/80 leading-relaxed">
                  <strong className="text-indigo-300">Our role:</strong> We digitise the full Z-Inspection process — from use-case onboarding and multi-role expert questionnaires to scenario tension mapping and structured deliberation — inside a collaborative, role-gated web platform.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section - Part 3: The Bridge — Ontology */}
      <section className="py-16 relative z-10 bg-[#0a1122]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden border border-cyan-500/15 bg-gradient-to-br from-cyan-950/20 via-[#0a1122] to-indigo-950/20 p-8 md:p-12 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(34,211,238,0.06),_transparent_60%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(99,102,241,0.06),_transparent_60%)] pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <GitMerge className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <div className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">The Unifying Layer</div>
                  <h3 className="text-2xl font-bold text-white">How We Fuse Both Frameworks with Ontology</h3>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed mb-10 max-w-4xl">
                EU AI Act provides the <em className="text-slate-300">legal requirements</em>. Z-Inspection provides the <em className="text-slate-300">structured evaluation process</em>. But a process still needs a machine-interpretable knowledge representation to become truly rigorous. That is where our <strong className="text-cyan-300">OWL/SWRL Ontology</strong> comes in — it is the formal bridge that transforms human expert answers into computable, auditable logical conclusions.
              </p>

              {/* Three-column pipeline */}
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                {[
                  {
                    step: 'A',
                    title: 'Z-Inspection Questionnaires',
                    color: 'from-indigo-500/20 to-indigo-500/5',
                    border: 'border-indigo-500/20',
                    accent: 'text-indigo-400',
                    icon: Users,
                    points: [
                      'Role-gated multi-disciplinary expert teams',
                      '7 trustworthy AI principles as evaluation axes',
                      'Structured use-case & scenario inputs',
                      'Collaborative deliberation & tension flagging',
                    ]
                  },
                  {
                    step: 'B',
                    title: 'OWL/SWRL Ontology Engine',
                    color: 'from-cyan-500/20 to-cyan-500/5',
                    border: 'border-cyan-500/20',
                    accent: 'text-cyan-400',
                    icon: Brain,
                    points: [
                      'Formalises Z-Inspection concepts as OWL classes',
                      'SWRL rules encode EU AI Act compliance logic',
                      'Automatic ethical tension inference',
                      'Risk score computation — no human bias',
                    ]
                  },
                  {
                    step: 'C',
                    title: 'EU AI Act Compliance Report',
                    color: 'from-rose-500/20 to-rose-500/5',
                    border: 'border-rose-500/20',
                    accent: 'text-rose-400',
                    icon: Gavel,
                    points: [
                      'Risk tier classification per AI Act articles',
                      'Neo4j Knowledge Graph for semantic traceability',
                      'GraphRAG narrative grounded in logical facts',
                      'Exportable PDF for regulatory submissions',
                    ]
                  },
                ].map((col, i) => (
                  <div key={i} className={`relative rounded-2xl border ${col.border} bg-gradient-to-b ${col.color} p-6`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-8 h-8 rounded-lg bg-white/5 border ${col.border} flex items-center justify-center`}>
                        <col.icon className={`w-4 h-4 ${col.accent}`} />
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-widest ${col.accent}`}>Step {col.step}</span>
                    </div>
                    <h4 className="text-white font-bold mb-4 text-sm">{col.title}</h4>
                    <ul className="space-y-2">
                      {col.points.map((pt, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
                          <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${col.accent}`} />
                          {pt}
                        </li>
                      ))}
                    </ul>
                    {i < 2 && (
                      <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0a1122] border border-white/10 items-center justify-center z-20 shadow-lg">
                        <ArrowRight className="w-4 h-4 text-cyan-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Key distinction callout */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-5 rounded-2xl border border-amber-500/15 bg-amber-500/5">
                  <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-amber-300 font-bold mb-2 text-sm">Why Ontology — Not Just a Questionnaire?</h5>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Traditional assessment tools produce numeric scores from subjective Likert-scale answers. Our ontology <em className="text-slate-300">reasons</em> over those answers using formal logic — identifying hidden contradictions, inferring compliance gaps, and producing conclusions that are <strong className="text-slate-200">reproducible, explainable and legally defensible</strong>.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 rounded-2xl border border-purple-500/15 bg-purple-500/5">
                  <Layers className="w-6 h-6 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-purple-300 font-bold mb-2 text-sm">LLMs as a Presentation Layer Only</h5>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Gemini / other LLMs are constrained to act as a <strong className="text-slate-200">GraphRAG narrative generator</strong>: they receive only the logical conclusions of the ontology and the knowledge graph triples — they cannot introduce facts, hallucinate risks, or alter compliance findings. All epistemic authority stays with the formal reasoner.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Architecture Diagram Section */}
      <section id="architecture" className="py-24 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold tracking-wider uppercase mb-6">
              <Network className="w-4 h-4" /> System Architecture
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How the System Components Communicate</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">A unified pipeline bridging structured expert evaluation, formal ontology reasoning, and AI-powered report generation.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="relative rounded-3xl border border-white/10 bg-[#070e1a] overflow-hidden p-8 md:p-12 shadow-2xl">

            {/* Background grid */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* Animated background glow blobs */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Legend */}
            <div className="relative z-10 flex flex-wrap gap-4 mb-10 justify-center">
              {[
                { color: 'bg-sky-400', label: 'Frontend' },
                { color: 'bg-indigo-400', label: 'Backend API' },
                { color: 'bg-violet-400', label: 'AI / Ontology Engine' },
                { color: 'bg-emerald-400', label: 'Data Layer' },
                { color: 'bg-amber-400', label: 'Output' },
              ].map((l, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                  <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                  {l.label}
                </div>
              ))}
            </div>

            {/* === DIAGRAM === */}
            <div className="relative z-10">

              {/* ROW 1: User + Frontend */}
              <div className="flex justify-center mb-4">
                <ArchNode color="sky" icon="👤" title="Expert User" sub="Multi-role team" />
              </div>
              <FlowArrow label="HTTPS / REST" />

              {/* ROW 2: React Frontend */}
              <div className="flex justify-center mb-4">
                <ArchNode color="sky" icon="⚛️" title="React + Vite" sub="Frontend Application" badge="TypeScript" />
              </div>
              <FlowArrow label="REST API calls" />

              {/* ROW 3: Node.js — center hub with branches */}
              <div className="flex items-start justify-center gap-6 mb-4 flex-wrap md:flex-nowrap">
                {/* Left branch: MongoDB */}
                <div className="flex flex-col items-center gap-0 w-40">
                  <div className="h-8 w-[2px] bg-gradient-to-b from-indigo-500/50 to-emerald-500/50" />
                  <ArchNode color="emerald" icon="🍃" title="MongoDB Atlas" sub="Users · Projects · Responses" badge="NoSQL" small />
                </div>

                {/* Center: Node.js */}
                <div className="flex flex-col items-center">
                  <ArchNode color="indigo" icon="🟢" title="Node.js + Express" sub="REST Backend API" badge="Core Hub" large />
                </div>

                {/* Right branch: Resend email */}
                <div className="flex flex-col items-center gap-0 w-40">
                  <div className="h-8 w-[2px] bg-gradient-to-b from-indigo-500/50 to-amber-500/50" />
                  <ArchNode color="amber" icon="📧" title="Resend API" sub="Email verification & welcome" badge="External" small />
                </div>
              </div>

              <FlowArrow label="HTTP → FastAPI Ontology Service" color="violet" />

              {/* ROW 4: FastAPI Ontology */}
              <div className="flex items-start justify-center gap-6 mb-4 flex-wrap md:flex-nowrap">
                {/* Left: OWL/SWRL Reasoner */}
                <div className="flex flex-col items-center gap-0 w-44">
                  <div className="h-8 w-[2px] bg-gradient-to-b from-violet-500/50 to-violet-400/50" />
                  <ArchNode color="violet" icon="🧠" title="OWL/SWRL Reasoner" sub="Formal logic inference" badge="Hermit / Pellet" small />
                </div>

                {/* Center: FastAPI */}
                <div className="flex flex-col items-center">
                  <ArchNode color="violet" icon="⚡" title="FastAPI + Python" sub="Ontology Reasoning Engine" badge="AI Core" large />
                </div>

                {/* Right: Neo4j */}
                <div className="flex flex-col items-center gap-0 w-44">
                  <div className="h-8 w-[2px] bg-gradient-to-b from-violet-500/50 to-emerald-500/50" />
                  <ArchNode color="emerald" icon="🕸️" title="Neo4j Graph DB" sub="Knowledge Graph · Cypher queries" badge="GraphDB" small />
                </div>
              </div>

              <FlowArrow label="Ontology conclusions → GraphRAG context" color="amber" />

              {/* ROW 5: Gemini LLM */}
              <div className="flex justify-center mb-4">
                <ArchNode color="amber" icon="✨" title="Google Gemini LLM" sub="GraphRAG narrative generation only" badge="Presentation Layer" />
              </div>

              <FlowArrow label="Structured report data" color="rose" />

              {/* ROW 6: PDF Report */}
              <div className="flex justify-center">
                <ArchNode color="rose" icon="📄" title="PDF / DOCX Report" sub="Regulatory-ready export" badge="EU AI Act Compliant" />
              </div>
            </div>

            {/* Data flow key */}
            <div className="relative z-10 mt-12 grid sm:grid-cols-3 gap-4">
              {[
                { from: 'Expert Input', to: 'Node.js', via: 'React forms & questionnaires', color: 'border-sky-500/20 bg-sky-500/5', accent: 'text-sky-400' },
                { from: 'Node.js', to: 'FastAPI', via: 'Structured JSON answers via REST', color: 'border-violet-500/20 bg-violet-500/5', accent: 'text-violet-400' },
                { from: 'Ontology Engine', to: 'Gemini', via: 'Only logical facts — no hallucination', color: 'border-amber-500/20 bg-amber-500/5', accent: 'text-amber-400' },
              ].map((row, i) => (
                <div key={i} className={`rounded-2xl border p-4 ${row.color}`}>
                  <div className={`text-xs font-bold mb-2 ${row.accent}`}>{row.from} → {row.to}</div>
                  <p className="text-slate-400 text-xs leading-relaxed">{row.via}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Analytical Capabilities</h2>
            <p className="text-lg text-slate-400">Transforming subjective answers into deterministic, actionable ethical insights.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Brain, color: 'text-indigo-400', glow: 'group-hover:shadow-[0_0_30px_rgba(129,140,248,0.2)]', title: 'Ontology Assessment', desc: 'Map expert inputs directly to standard ethical principles using OWL constraints.' },
              { icon: Zap, color: 'text-amber-400', glow: 'group-hover:shadow-[0_0_30px_rgba(251,191,36,0.2)]', title: 'Ethical Tension Detection', desc: 'Automatically identify conflicting values (e.g., Privacy vs. Transparency) via logical rules.' },
              { icon: Shield, color: 'text-emerald-400', glow: 'group-hover:shadow-[0_0_30px_rgba(52,211,153,0.2)]', title: 'Risk Level Analysis', desc: 'Calculate inherent and residual risk levels based on identified triggers and safeguards.' },
              { icon: Scale, color: 'text-rose-400', glow: 'group-hover:shadow-[0_0_30px_rgba(251,113,133,0.2)]', title: 'Legal Regulation Mapping', desc: 'Cross-reference identified AI risks with AI Act and GDPR compliance frameworks.' },
              { icon: Network, color: 'text-cyan-400', glow: 'group-hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]', title: 'GraphRAG Reports', desc: 'Generate highly accurate, context-aware narratives grounded strictly in Knowledge Graphs.' },
              { icon: Download, color: 'text-purple-400', glow: 'group-hover:shadow-[0_0_30px_rgba(192,132,252,0.2)]', title: 'Export & Share', desc: 'Download comprehensive assessment reports securely for stakeholder distribution.' }
            ].map((f, i) => (
              <div key={i} className={`group bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm relative overflow-hidden ${f.glow}`}>
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-[#050b14] border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                    <f.icon className={`w-6 h-6 ${f.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-24 relative z-10 border-t border-white/5 bg-[#0a1122]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-lg text-slate-400">A seamless pipeline from human expertise to machine-reasoned governance.</p>
          </div>
          
          <div className="relative">
            {/* Desktop Horizontal Line */}
            <div className="hidden lg:block absolute top-6 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent z-0"></div>
            
            <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-4 relative z-10">
              {[
                { step: '1', title: 'User Input', desc: 'Define AI System & Use Case specifics.' },
                { step: '2', title: 'Expert Answers', desc: 'Multi-disciplinary evaluation.' },
                { step: '3', title: 'Ontology', desc: 'SWRL Rules reason over data.' },
                { step: '4', title: 'Knowledge Graph', desc: 'Neo4j semantic relationships.' },
                { step: '5', title: 'GraphRAG', desc: 'Grounded report generation.' },
                { step: '6', title: 'Export', desc: 'Secure PDF documentation.' }
              ].map((w, i) => (
                <div key={i} className="flex flex-row lg:flex-col items-center lg:text-center gap-6 lg:gap-4 w-full lg:w-[16%]">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-[#050b14] border-2 border-cyan-500/50 text-cyan-400 font-bold flex items-center justify-center text-lg shadow-[0_0_15px_rgba(34,211,238,0.2)] z-10">
                    {w.step}
                  </div>
                  {/* Mobile Vertical Line */}
                  {i !== 5 && (
                    <div className="lg:hidden absolute w-[2px] h-12 bg-white/10 left-[23px] translate-y-12 z-0"></div>
                  )}
                  <div className="text-left lg:text-center">
                    <div className="text-white font-bold mb-1">{w.title}</div>
                    <p className="text-slate-400 text-sm">{w.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Scoring Methodology Section */}
      <section id="scoring" className="py-24 relative z-10 border-t border-white/5 bg-[#0a1122]/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-semibold tracking-wider uppercase mb-6">
              <Scale className="w-4 h-4" /> Scoring Methodology
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How the Risk Score is Calculated</h2>
            <p className="text-slate-400 max-w-xl mx-auto">A single transparent formula — no hidden weights, no black boxes.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-5">

            {/* Core formula */}
            <div className="rounded-2xl border border-white/10 bg-[#070e1a] p-8 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-5">Per-question Ethical Risk Contribution</p>
              <div className="font-mono text-2xl md:text-3xl font-bold flex flex-wrap items-center justify-center gap-3">
                <span className="text-amber-400">Risk</span>
                <span className="text-slate-600">=</span>
                <span className="text-indigo-400">Importance</span>
                <span className="text-slate-600">×</span>
                <span className="text-rose-400">(1 − Answer Score)</span>
              </div>
              <div className="mt-5 flex flex-wrap justify-center gap-6 text-xs text-slate-500">
                <span><span className="text-indigo-400 font-semibold">Importance</span> — expert priority weight, 1 (low) to 4 (critical)</span>
                <span><span className="text-rose-400 font-semibold">Answer Score</span> — compliance level, 0.0 (none) to 1.0 (full)</span>
              </div>
            </div>

            {/* 3-step aggregation */}
            <div className="grid md:grid-cols-3 gap-4">
              {([
                { step: '1', color: 'border-indigo-500/20 bg-indigo-500/5', accent: 'text-indigo-400', title: 'Per Question', formula: 'Risk = Importance × (1 − Score)', note: 'Computed for every answered question' },
                { step: '2', color: 'border-violet-500/20 bg-violet-500/5', accent: 'text-violet-400', title: 'Per Principle', formula: 'Principle Risk = Σ Question Risks', note: 'Summed across each of the 7 HLEG principles' },
                { step: '3', color: 'border-cyan-500/20 bg-cyan-500/5', accent: 'text-cyan-400', title: 'Overall', formula: 'Overall Risk = Σ Principle Risks', note: 'Final project score — no normalisation' },
              ] as const).map((s) => (
                <div key={s.step} className={`rounded-2xl border p-5 ${s.color}`}>
                  <div className={`text-xs font-bold uppercase tracking-widest mb-3 ${s.accent}`}>Step {s.step} · {s.title}</div>
                  <div className={`font-mono text-sm font-semibold mb-2 ${s.accent}`}>{s.formula}</div>
                  <p className="text-slate-500 text-xs">{s.note}</p>
                </div>
              ))}
            </div>

            {/* Worked example */}
            <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/3 p-6">
              <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-4">📐 Worked Example</p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="font-mono text-xs space-y-2 text-slate-400">
                  <div className="flex justify-between"><span>Question</span><span className="text-slate-300">Biometric data without consent?</span></div>
                  <div className="flex justify-between"><span>Answer Score</span><span className="text-rose-400">0.0 — non-compliant</span></div>
                  <div className="flex justify-between"><span>Importance</span><span className="text-indigo-400">4 — critical</span></div>
                  <div className="h-px bg-white/5" />
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-white">Risk Contribution</span>
                    <span className="text-rose-400">4 × (1 − 0.0) = 4.0</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <p className="text-slate-400 text-sm leading-relaxed">
                    This single answer contributes <strong className="text-rose-300">4.0 risk units</strong> — the maximum possible — directly to the <em className="text-rose-200">Privacy & Data Governance</em> principle and surfaces as the top driver in the final report.
                  </p>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900/40 to-cyan-900/40 border border-white/10 p-10 md:p-16 text-center shadow-2xl backdrop-blur-md">
            {/* Inner glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-400/20 via-transparent to-transparent pointer-events-none"></div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
              Ready to Ensure Ethical AI?
            </h2>
            <p className="text-indigo-200/80 text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Join the platform that leverages advanced ontology reasoning and knowledge graphs to build trust and ensure compliance in AI systems.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <button 
                onClick={() => handleNavigate('/register')}
                className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-[#050b14] rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-105"
              >
                Start Evaluation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#02050a] py-8 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 opacity-50">
            <Brain className="w-5 h-5 text-white" />
            <span className="font-bold text-white">EthicAI</span>
          </div>
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} Ethic-AI-Ontology. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-slate-600">
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}

/* ───────────── Architecture Diagram Sub-Components ───────────── */

type ArchColor = 'sky' | 'indigo' | 'violet' | 'emerald' | 'amber' | 'rose';

const colorMap: Record<ArchColor, { border: string; bg: string; glow: string; badge: string; dot: string; text: string }> = {
  sky:     { border: 'border-sky-500/30',     bg: 'bg-sky-500/5',     glow: 'shadow-sky-500/10',     badge: 'bg-sky-500/10 text-sky-300 border-sky-500/20',     dot: 'bg-sky-400',     text: 'text-sky-400' },
  indigo:  { border: 'border-indigo-500/30',  bg: 'bg-indigo-500/5',  glow: 'shadow-indigo-500/10',  badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',  dot: 'bg-indigo-400',  text: 'text-indigo-400' },
  violet:  { border: 'border-violet-500/30',  bg: 'bg-violet-500/5',  glow: 'shadow-violet-500/10',  badge: 'bg-violet-500/10 text-violet-300 border-violet-500/20',  dot: 'bg-violet-400',  text: 'text-violet-400' },
  emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/5', glow: 'shadow-emerald-500/10', badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20', dot: 'bg-emerald-400', text: 'text-emerald-400' },
  amber:   { border: 'border-amber-500/30',   bg: 'bg-amber-500/5',   glow: 'shadow-amber-500/10',   badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20',   dot: 'bg-amber-400',   text: 'text-amber-400' },
  rose:    { border: 'border-rose-500/30',    bg: 'bg-rose-500/5',    glow: 'shadow-rose-500/10',    badge: 'bg-rose-500/10 text-rose-300 border-rose-500/20',    dot: 'bg-rose-400',    text: 'text-rose-400' },
};

function ArchNode({ color, icon, title, sub, badge, small, large }: {
  color: ArchColor; icon: string; title: string; sub: string; badge?: string; small?: boolean; large?: boolean;
}) {
  const c = colorMap[color];
  const width = large ? 'w-56' : small ? 'w-40' : 'w-48';
  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`${width} rounded-2xl border ${c.border} ${c.bg} shadow-xl ${c.glow} p-4 text-center cursor-default select-none backdrop-blur-sm`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className={`font-bold text-white text-sm mb-1 ${large ? 'text-base' : ''}`}>{title}</div>
      <div className="text-slate-500 text-xs leading-relaxed mb-2">{sub}</div>
      {badge && (
        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${c.badge}`}>{badge}</span>
      )}
      {/* pulsing dot */}
      <div className="flex justify-center mt-2">
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${c.dot}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${c.dot}`} />
        </span>
      </div>
    </motion.div>
  );
}

const arrowColorMap: Record<string, string> = {
  default: 'from-indigo-500/0 via-indigo-500/50 to-indigo-500/0',
  violet:  'from-violet-500/0 via-violet-500/50 to-violet-500/0',
  amber:   'from-amber-500/0 via-amber-500/50 to-amber-500/0',
  rose:    'from-rose-500/0 via-rose-500/50 to-rose-500/0',
};
const arrowTextMap: Record<string, string> = {
  default: 'text-indigo-400',
  violet:  'text-violet-400',
  amber:   'text-amber-400',
  rose:    'text-rose-400',
};
const arrowChevronMap: Record<string, string> = {
  default: 'border-indigo-400',
  violet:  'border-violet-400',
  amber:   'border-amber-400',
  rose:    'border-rose-400',
};

function FlowArrow({ label, color = 'default' }: { label: string; color?: string }) {
  return (
    <div className="flex flex-col items-center mb-4">
      {/* dashed animated line */}
      <div className={`w-[2px] h-8 bg-gradient-to-b ${arrowColorMap[color] ?? arrowColorMap.default} relative overflow-hidden`}>
        <motion.div
          className="absolute inset-x-0 top-0 h-3 bg-white/30 rounded-full blur-sm"
          animate={{ y: ['-100%', '400%'] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear', repeatDelay: 0.3 }}
        />
      </div>
      {/* label */}
      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border border-white/5 bg-white/3 mb-1 ${arrowTextMap[color] ?? arrowTextMap.default}`}>
        {label}
      </span>
      {/* chevron arrow */}
      <motion.div
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        className={`w-2.5 h-2.5 border-r-2 border-b-2 rotate-45 ${arrowChevronMap[color] ?? arrowChevronMap.default} opacity-70`}
      />
    </div>
  );
}
