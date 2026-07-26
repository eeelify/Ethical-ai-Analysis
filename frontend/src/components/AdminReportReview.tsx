import React, { useState } from "react";
import { ArrowLeft, CheckCircle, Sparkles, Loader2 } from "lucide-react";
import { api } from "../api";
import { User } from "../types";
import { UnifiedReportViewer } from "./UnifiedReportViewer";

export function AdminReportReview({
  projectId,
  currentUser,
  onBack,
  onViewReport,
}: {
  projectId: string;
  currentUser: User;
  onBack: () => void;
  onViewReport?: (reportId: string) => void;
}) {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatting, setChatting] = useState(false);
  const [adminComment, setAdminComment] = useState("");
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);

  const userId = currentUser.id || (currentUser as any)._id;

  const handleSendMessage = async () => {
    if (!chatInput.trim() || chatting) return;

    const userMessage = { role: 'user' as const, content: chatInput.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setChatInput("");
    setChatting(true);

    try {
      const res = await fetch(api(`/api/projects/${projectId}/admin-reports/chat-with-ai`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ messages: newMessages }),
      });
      if (res.ok) {
        const json = await res.json();
        setMessages([...newMessages, { role: 'model', content: json.response }]);
      } else {
        const errText = await res.text();
        console.error("Backend Error 500 details:", errText);
        alert(`AI chat failed: ${errText}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChatting(false);
    }
  };

  const handleApprove = async () => {
    setApproving(true);
    try {
      const res = await fetch(api(`/api/projects/${projectId}/admin-reports/approve`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ adminReviewComment: adminComment, userId }),
      });
      if (res.ok) {
        setApproved(true);
      } else {
        alert("Approval failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] text-gray-200 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Review Reports</h1>
              <p className="text-gray-400 text-sm mt-1">Admin report review and approval panel</p>
            </div>
          </div>
          {approved && (
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-lg border border-emerald-400/20">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Published &amp; Approved</span>
            </div>
          )}
        </div>

        {/* Reports — reuse exact same component as ProjectDetail reports tab */}
        <UnifiedReportViewer
          projectId={projectId}
          userId={userId}
          currentUserRole="admin"
          onViewExpertReport={onViewReport}
        />

        {/* Gemini Chat */}
        <div className="mt-8 bg-gradient-to-br from-blue-900/10 to-purple-900/10 border border-blue-500/20 rounded-xl p-6 flex flex-col h-[480px]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-blue-400" />
            Discuss Reports with Gemini
          </h2>

          {/* Chat messages */}
          <div className="flex-1 bg-[#050b14]/50 border border-gray-800 rounded-lg p-4 overflow-y-auto mb-4 flex flex-col gap-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
                <Sparkles className="w-8 h-8 opacity-20" />
                <p className="text-sm text-center max-w-md">
                  Ask Gemini anything about both reports. For example: "What are the main contradictions between the expert and ontology reports?" or "Summarize the critical risks."
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-200 border border-gray-700'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {chatting && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg text-sm bg-gray-800 text-gray-400 border border-gray-700 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Gemini is thinking...
                </div>
              </div>
            )}
          </div>

          {/* Chat input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask a question about the reports..."
              className="flex-1 bg-[#121b2f] border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
              disabled={chatting}
            />
            <button
              onClick={handleSendMessage}
              disabled={chatting || !chatInput.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Send
            </button>
          </div>
        </div>

        {/* Admin Approve Section */}
        <div className="mt-6 bg-[#0b1221] border border-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-white mb-4">Admin Decision &amp; Comments</h2>
          <textarea
            value={adminComment}
            onChange={(e) => setAdminComment(e.target.value)}
            placeholder="After reviewing both reports, write your final review notes or recommendations..."
            className="w-full bg-[#121b2f] border border-gray-700 rounded-lg p-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 min-h-[120px] mb-4 text-sm resize-y"
          />
          <div className="flex justify-end">
            <button
              onClick={handleApprove}
              disabled={approving || (!adminComment.trim() && !approved)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              {approving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              {approved ? "Update Comment" : "Approve & Publish Reports"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
