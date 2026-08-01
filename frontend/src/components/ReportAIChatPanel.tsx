import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { api } from '../api';

interface ReportAIChatPanelProps {
  projectId: string;
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportAIChatPanel({ projectId, userId, isOpen, onClose }: ReportAIChatPanelProps) {
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model', content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatting, setChatting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load chat history on mount or when opened
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await fetch(api(`/api/projects/${projectId}/reports/chat-with-ai`), {
          headers: { 'x-user-id': userId }
        });
        const data = await res.json();
        if (data.success && data.history && data.history.length > 0) {
          setChatMessages([
            { role: 'model', content: "Hello! I have generated the unified ethical assessment report for this project. How can I assist you with reviewing it before publication?" },
            ...data.history
          ]);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };
    fetchChatHistory();
  }, [projectId, userId]);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isOpen]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || chatting) return;
    const newMessages = [...chatMessages, { role: 'user' as const, content: chatInput.trim() }];
    setChatMessages(newMessages);
    setChatInput("");
    setChatting(true);
    try {
      const res = await fetch(api(`/api/projects/${projectId}/reports/chat-with-ai`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({ messages: newMessages, userId })
      });
      const json = await res.json();
      if (json.success) {
        setChatMessages([...newMessages, { role: 'model', content: json.response }]);
      } else {
        setChatMessages([...newMessages, { role: 'model', content: `Error: ${json.error}` }]);
      }
    } catch (error: any) {
      setChatMessages([...newMessages, { role: 'model', content: `Error: ${error.message}` }]);
    } finally {
      setChatting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[450px] bg-[#050b14] border-l border-white/10 transform transition-transform duration-300 ease-in-out z-[100] translate-x-0 shadow-2xl flex flex-col">
      <div className="w-full h-full bg-[#0f172a] border-l border-cyan-500/30 shadow-[0_0_30px_rgba(8,145,178,0.1)] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-900/40 to-transparent border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-cyan-500/20 rounded-lg">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="text-white font-semibold">Report Assistant</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20 custom-scrollbar">
          {chatMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
              <MessageSquare className="w-8 h-8 mb-3 opacity-20" />
              <p className="text-sm px-4">Ask any questions about the report.<br/>The AI will explain risk scores, standards, and recommendations in plain language.</p>
            </div>
          ) : (
            chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-br-none border border-white/10' 
                    : 'bg-[#1e293b]/80 backdrop-blur-md text-gray-100 rounded-bl-none border border-white/10'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          {chatting && (
            <div className="flex justify-start">
              <div className="bg-[#0b1221]/10 text-gray-400 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2 border border-white/5">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-white/5 bg-[#0f172a] shrink-0">
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-3 py-2 focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/50 transition-all">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about the report..."
              className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none focus:ring-0 placeholder-gray-500 py-1"
              disabled={chatting}
            />
            <button
              onClick={handleSendMessage}
              disabled={!chatInput.trim() || chatting}
              className="p-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:text-slate-500 text-white rounded-lg transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
