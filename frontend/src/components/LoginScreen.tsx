import React, { useState } from 'react';
import { Brain, ArrowRight, Shield, Mail, Lock, User, KeyRound, Network, Zap, Scale, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../api';

interface LoginScreenProps {
  onLogin: (email: string, password: string, role: string) => Promise<void> | void;
  initialView?: 'login' | 'register';
  navigateTo?: (path: string) => void;
}

type Step = 'email' | 'code';

const roles = [
  { id: 'admin', label: 'Administrator' },
  { id: 'ethical-expert', label: 'Ethical Expert' },
  { id: 'medical-expert', label: 'Medical Expert' },
  { id: 'use-case-owner', label: 'Use Case Owner' },
  { id: 'education-expert', label: 'Education Expert' },
  { id: 'technical-expert', label: 'Technical Expert' },
  { id: 'legal-expert', label: 'Legal Expert' }
];

export function LoginScreen({ onLogin, initialView = 'login', navigateTo }: LoginScreenProps) {
  const [isLogin, setIsLogin] = useState(initialView === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<string>('ethical-expert');
  const [loading, setLoading] = useState(false);

  // Registration flow state
  const [step, setStep] = useState<Step>('email');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleNavigate = (path: string) => {
    if (navigateTo) {
      navigateTo(path);
    } else {
      window.location.href = path;
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !role) {
      setError('Please fill in all fields.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onLogin(email, password, role);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      setError('Please fill in all fields.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(api('/api/auth/request-code'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (response.ok) {
        setStep('code');
        setSuccess('Verification code sent to your email.');
        setTimeout(() => setSuccess(null), 5000);
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.message || 'Error sending code.');
      }
    } catch (err) {
      setError('Connection error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCodeAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      setError('Please enter the 6-digit code.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(api('/api/auth/verify-code-and-register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, name, password, role })
      });
      if (response.ok) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          setIsLogin(true);
          setStep('email');
          setSuccess(null);
        }, 2000);
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      setError('Connection error.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setStep('email');
    setError(null);
    setSuccess(null);
    setCode('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#050b14] flex selection:bg-indigo-500/30 font-sans"
    >
      {/* Left Column: Information (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden bg-[#0a1122]/50 border-r border-white/5">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/10 blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 cursor-pointer mb-16" onClick={() => handleNavigate('/')}>
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">EthicAI Platform</span>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-md"
          >
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-6">
              Ontology-Based <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                AI Assessment
              </span>
            </h1>
            
            <div className="space-y-4 text-slate-400 mb-12">
              <div className="flex items-center gap-3">
                <Network className="w-5 h-5 text-indigo-400" />
                <span>Knowledge Graph & GraphRAG</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>Ethical Tension Detection</span>
              </div>
              <div className="flex items-center gap-3">
                <Scale className="w-5 h-5 text-rose-400" />
                <span>Legal Compliance (AI Act)</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Workflow visualization */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 p-6 bg-[#0b1221]/5 border border-white/10 rounded-2xl backdrop-blur-sm max-w-md"
        >
          <div className="text-sm font-semibold text-cyan-400 mb-4 uppercase tracking-wider">Assessment Workflow</div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center mb-2">
                <FileText className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="text-xs text-slate-400">Input</span>
            </div>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-indigo-500/50 to-cyan-500/50 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center mb-2">
                <Brain className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-xs text-slate-400">Ontology</span>
            </div>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-cyan-500/50 to-purple-500/50 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center mb-2">
                <Network className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-xs text-slate-400">GraphRAG</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-6 left-6 flex items-center gap-3 cursor-pointer" onClick={() => handleNavigate('/')}>
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-white">EthicAI</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md bg-[#0b1221]/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Welcome back' : (step === 'email' ? 'Create an account' : 'Verify Email')}
            </h2>
            <p className="text-slate-400 text-sm mb-8">
              {isLogin 
                ? 'Sign in to continue to the platform.' 
                : (step === 'email' ? 'Join to start evaluating AI systems.' : 'Enter the code sent to your email.')}
            </p>

            {error && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={isLogin ? handleLoginSubmit : (step === 'email' ? handleRequestCode : handleVerifyCodeAndRegister)} className="space-y-5">
              
              {!isLogin && step === 'email' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#02050a]/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              {(isLogin || step === 'email') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#02050a]/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-sm font-medium text-slate-300">Password</label>
                      {isLogin && (
                        <button type="button" onClick={() => handleNavigate('/forgot-password')} className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#02050a]/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Role</label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                      <select 
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full bg-[#02050a]/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all appearance-none cursor-pointer"
                      >
                        {roles.map(r => (
                          <option key={r.id} value={r.id} className="bg-[#050b14]">{r.label}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        ▼
                      </div>
                    </div>
                  </div>
                </>
              )}

              {!isLogin && step === 'code' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Verification Code</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="text" 
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full bg-[#02050a]/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600 text-center tracking-widest font-mono text-lg"
                      placeholder="000000"
                      maxLength={6}
                    />
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-4 group relative py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl font-semibold text-white overflow-hidden shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
              >
                <div className="absolute inset-0 bg-[#0b1221]/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? 'Processing...' : (isLogin ? 'Log In' : (step === 'email' ? 'Send Verification Code' : 'Verify & Sign Up'))}
                  {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </span>
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={toggleMode}
                className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors ml-1 focus:outline-none"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
