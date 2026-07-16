import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Bot, CheckCircle2, Loader2, RefreshCw, Send, Trash2, User as UserIcon } from 'lucide-react';
import { api } from '../api';
import { Project, User } from '../types';

type OntologyChatStatus = 'not_started' | 'needs_more_information' | 'completed' | 'error';

interface OntologyChatMessage {
  _id?: string;
  sender: 'user' | 'system';
  text: string;
  status?: OntologyChatStatus;
  ontologyResult?: Record<string, unknown> | null;
  createdAt?: string;
}

interface OntologyChatResponse {
  conversationId: string | null;
  status: OntologyChatStatus;
  messages: OntologyChatMessage[];
  ontologyResult: Record<string, unknown> | null;
  error?: string;
}

interface OntologyChatBoxProps {
  project: Project;
  currentUser: User;
}

const getProjectId = (project: Project) => (project.id || (project as any)._id || '').toString();

const hasValue = (value: unknown): boolean => {
  if (value === null || value === undefined || value === '') return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value as Record<string, unknown>).length > 0;
  return true;
};

const normalizeLabel = (value: string) =>
  value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function ValueBlock({ value }: { value: unknown }) {
  if (!hasValue(value)) {
    return <span className="text-slate-500">Not returned by ontology service</span>;
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return <span className="whitespace-pre-wrap text-slate-300">{String(value)}</span>;
  }

  if (Array.isArray(value)) {
    return (
      <div className="space-y-2">
        {value.map((item, index) => (
          <div key={index} className="rounded-lg border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-slate-300">
            <ValueBlock value={item} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === 'object') {
    return (
      <div className="space-y-2">
        {Object.entries(value as Record<string, unknown>)
          .filter(([, item]) => hasValue(item))
          .map(([key, item]) => (
            <div key={key} className="text-sm">
              <div className="mb-1 text-xs font-semibold uppercase text-slate-500">{normalizeLabel(key)}</div>
              <ValueBlock value={item} />
            </div>
          ))}
      </div>
    );
  }

  return <span className="text-slate-300">{String(value)}</span>;
}

function ResultSection({ title, value }: { title: string; value: unknown }) {
  if (!hasValue(value)) return null;

  return (
    <section className="rounded-lg border border-white/10 bg-[#0a1122] p-4">
      <h4 className="mb-2 text-sm font-semibold text-white">{title}</h4>
      <ValueBlock value={value} />
    </section>
  );
}

function formatTime(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString();
}

export function OntologyChatBox({ project, currentUser }: OntologyChatBoxProps) {
  const projectId = getProjectId(project);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<OntologyChatMessage[]>([]);
  const [status, setStatus] = useState<OntologyChatStatus>('not_started');
  const [ontologyResult, setOntologyResult] = useState<Record<string, unknown> | null>(null);
  const [message, setMessage] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [sending, setSending] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const statusClass = {
    not_started: 'border-slate-700 bg-white/5 text-slate-300',
    needs_more_information: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
    completed: 'border-green-500/30 bg-green-500/10 text-green-300',
    error: 'border-red-500/30 bg-red-500/10 text-red-300'
  }[status];

  const statusLabel = {
    not_started: 'Not started',
    needs_more_information: 'Needs more information',
    completed: 'Completed',
    error: 'Service error'
  }[status];

  const resultFields = useMemo(() => {
    if (!ontologyResult) return [];

    return [
      ['Detected domain', ontologyResult.detectedDomain],
      ['System purpose', ontologyResult.systemPurpose],
      ['AI system classification', ontologyResult.aiSystemClassification],
      ['Stakeholders', ontologyResult.stakeholders],
      ['Data categories', ontologyResult.dataCategories],
      ['Affected principles', ontologyResult.affectedPrinciples],
      ['Possible ethical principle violations', ontologyResult.possibleEthicalPrincipleViolations],
      ['Ethical principle conflicts', ontologyResult.ethicalPrincipleConflicts],
      ['Risk level', ontologyResult.riskLevel],
      ['Human oversight requirement', ontologyResult.humanOversightRequirement],
      ['Legal provisions', ontologyResult.legalProvisions],
      ['Ontology relations and reasoning', ontologyResult.ontologyRelationsAndReasoning],
      ['Missing or unverified information', ontologyResult.missingOrUnverifiedInformation],
      ['Recommended next steps', ontologyResult.recommendedNextSteps],
      ['Score components', ontologyResult.scoreComponents],
      ['Composite score', ontologyResult.compositeScore],
      ['Detected risk triggers', ontologyResult.detectedRiskTriggers]
    ] as Array<[string, unknown]>;
  }, [ontologyResult]);

  useEffect(() => {
    const loadConversation = async () => {
      if (!projectId || !currentUser.id) return;

      setLoadingHistory(true);
      setError(null);
      try {
        const response = await fetch(api(`/api/projects/${projectId}/ontology-chat?userId=${encodeURIComponent(currentUser.id)}`));
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload.error || `Request failed with ${response.status}`);
        }

        setConversationId(payload.conversationId || null);
        setMessages(payload.messages || []);
        setStatus(payload.status || 'not_started');
        setOntologyResult(payload.ontologyResult || null);
      } catch (err: any) {
        setError(err.message || 'Ontology chat could not be loaded.');
      } finally {
        setLoadingHistory(false);
      }
    };

    loadConversation();
  }, [projectId, currentUser.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, sending]);

  const applyResponse = (payload: OntologyChatResponse) => {
    setConversationId(payload.conversationId || null);
    setMessages(payload.messages || []);
    setStatus(payload.status || 'not_started');
    setOntologyResult(payload.ontologyResult || null);
  };

  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed || sending) return;

    setSending(true);
    setError(null);
    setMessage('');

    try {
      const response = await fetch(api(`/api/projects/${projectId}/ontology-chat`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          message: trimmed,
          conversationId
        })
      });
      const payload = await response.json().catch(() => ({}));

      if (payload.messages) {
        applyResponse(payload);
      }

      if (!response.ok) {
        throw new Error(payload.error || payload.reply || `Request failed with ${response.status}`);
      }
    } catch (err: any) {
      setError(err.message || 'Message could not be sent.');
      setMessage(trimmed);
    } finally {
      setSending(false);
    }
  };

  const clearConversation = async () => {
    if (clearing) return;
    const confirmed = window.confirm('Clear this ontology conversation for this project?');
    if (!confirmed) return;

    setClearing(true);
    setError(null);
    try {
      const response = await fetch(api(`/api/projects/${projectId}/ontology-chat?userId=${encodeURIComponent(currentUser.id)}`), {
        method: 'DELETE'
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || `Request failed with ${response.status}`);
      }
      applyResponse(payload);
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Conversation could not be cleared.');
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-medium text-white">Ontology Assessment</h3>
          <p className="text-sm text-slate-400">{project.title}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusClass}`}>
            {status === 'completed' ? <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> : null}
            {status === 'error' ? <AlertTriangle className="mr-1.5 h-3.5 w-3.5" /> : null}
            {statusLabel}
          </span>
          <button
            onClick={clearConversation}
            disabled={clearing || loadingHistory || messages.length === 0}
            className="inline-flex items-center rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {clearing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            New assessment
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr),380px]">
        <div className="flex min-h-[520px] flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0a1122]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center text-sm font-medium text-slate-300">
              <Bot className="mr-2 h-4 w-4 text-cyan-400" />
              Project conversation
            </div>
            {loadingHistory && (
              <span className="inline-flex items-center text-xs text-slate-400">
                <RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Loading
              </span>
            )}
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {!loadingHistory && messages.length === 0 && (
              <div className="flex h-full min-h-[280px] items-center justify-center text-center">
                <div>
                  <Bot className="mx-auto mb-3 h-9 w-9 text-slate-600" />
                  <p className="text-sm text-slate-400">Describe the AI system for this project.</p>
                </div>
              </div>
            )}

            {messages.map((item, index) => {
              const isUser = item.sender === 'user';
              return (
                <div key={item._id || index} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-300">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div className={`max-w-[78%] rounded-lg border px-4 py-3 text-sm shadow-sm ${
                    isUser
                      ? 'border-blue-500/30 bg-blue-500/15 text-blue-50'
                      : 'border-white/10 bg-[#050b14] text-slate-300'
                  }`}>
                    <div className="whitespace-pre-wrap leading-6">{item.text}</div>
                    {item.createdAt && (
                      <div className={`mt-2 text-[11px] ${isUser ? 'text-blue-200/70' : 'text-slate-500'}`}>
                        {formatTime(item.createdAt)}
                      </div>
                    )}
                  </div>
                  {isUser && (
                    <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-200">
                      <UserIcon className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {sending && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Ontology service is processing
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-white/10 p-4">
            <div className="flex flex-col gap-3 md:flex-row">
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                className="min-h-[96px] flex-1 resize-none rounded-lg border border-white/10 bg-[#050b14] px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                placeholder="Describe inputs, purpose, users, decisions, safeguards, and oversight."
                disabled={sending || loadingHistory}
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim() || sending || loadingHistory}
                className="inline-flex min-w-[130px] items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Send
              </button>
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-white/10 bg-[#050b14] p-4">
          <h4 className="mb-3 text-sm font-semibold text-white">Structured result</h4>
          {!ontologyResult ? (
            <div className="rounded-lg border border-dashed border-white/10 bg-[#0a1122] p-5 text-sm text-slate-400">
              {status === 'needs_more_information'
                ? 'The result will appear after the missing details are clarified.'
                : 'No completed ontology result yet.'}
            </div>
          ) : (
            <div className="max-h-[680px] space-y-3 overflow-y-auto pr-1">
              {resultFields.map(([title, value]) => (
                <ResultSection key={title} title={title} value={value} />
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
