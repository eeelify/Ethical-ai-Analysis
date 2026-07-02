import React, { useState, useEffect } from 'react';
import { Shield, Brain, Network, FileText, Download, Scale, ArrowRight, Zap, CheckCircle2, Menu, X } from 'lucide-react';
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
              <a href="#features" className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-colors">Features</a>
              <a href="#workflow" className="text-slate-400 hover:text-cyan-400 text-sm font-medium transition-colors">Workflow</a>
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
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-cyan-400 font-medium p-2 rounded-md hover:bg-white/5">Features</a>
            <a href="#workflow" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-cyan-400 font-medium p-2 rounded-md hover:bg-white/5">Workflow</a>
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

      {/* About Section */}
      <section id="about" className="py-24 relative z-10 border-t border-white/5 bg-[#0a1122]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-cyan-400 font-semibold tracking-wider text-sm mb-3 uppercase">The Problem & Our Solution</div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Beyond Subjective Surveys. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Deep Semantic Reasoning.</span>
              </h2>
              
              <div className="space-y-6 text-slate-400 text-lg leading-relaxed">
                <p>
                  Traditional AI ethical evaluations heavily rely on subjective expert interpretations. Our platform shifts the paradigm by grounding expert answers into a strict ontological framework.
                </p>
                <p>
                  We utilize <strong className="text-slate-200 font-medium">SWRL reasoning</strong> and <strong className="text-slate-200 font-medium">Neo4j Knowledge Graphs</strong> to mathematically detect ethical tensions and assess risk levels. 
                </p>
                <div className="p-5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <Brain className="w-6 h-6 text-indigo-400 shrink-0 mt-1" />
                    <p className="text-sm text-indigo-200">
                      <strong className="text-indigo-300">Crucial Distinction:</strong> LLMs (like Gemini) are NOT the decision makers. They operate strictly as a GraphRAG presentation layer, generating explainable reports derived <span className="italic">only</span> from the deterministic logical rules of the ontology.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Visual representation */}
            <div className="relative h-full min-h-[400px] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 rounded-3xl border border-white/10 transform rotate-2 backdrop-blur-sm"></div>
              
              <div className="relative z-10 w-full max-w-md bg-[#050b14] rounded-2xl border border-white/10 p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <div className="text-xs text-slate-500 ml-2 font-mono">system_architecture.owl</div>
                </div>
                
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex items-center gap-4 text-slate-400">
                    <span className="text-purple-400">Input</span>
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                    <span>Expert Multi-Disciplinary Data</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400">
                    <span className="text-cyan-400">Engine</span>
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                    <span className="text-slate-300">OWL/SWRL Reasoner</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <code className="text-xs text-emerald-400 block mb-1">IF (BiometricData == True AND ExplicitConsent == False)</code>
                    <code className="text-xs text-rose-400 block">THEN TRIGGER_RISK(High) & TENSION(Privacy vs Utility)</code>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400">
                    <span className="text-indigo-400">Graph</span>
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                    <span>Neo4j Relationship Mapping</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                  <div className="flex-1 lg:flex-none">
                    <h4 className="font-bold text-slate-200 mb-1">{w.title}</h4>
                    <p className="text-xs text-slate-500">{w.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
