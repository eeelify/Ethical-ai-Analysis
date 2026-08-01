import React, { useState } from "react";
import { ArrowLeft, CheckCircle, Loader2, MessageSquare } from "lucide-react";
import { api } from "../api";
import { User } from "../types";
import { UnifiedReportViewer } from "./UnifiedReportViewer";
import { ReportAIChatPanel } from "./ReportAIChatPanel";

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
  const [adminComment, setAdminComment] = useState("");
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const userId = currentUser.id || (currentUser as any)._id;

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
    <div className="min-h-screen bg-[#050b14] text-gray-200 p-6 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 shrink-0">
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
        <div className="flex items-center gap-4">
          {!chatOpen && (
            <button
              onClick={() => setChatOpen(true)}
              className="group relative flex items-center gap-3 px-6 py-3 rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)] hover:-translate-y-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 border border-cyan-400/30"
            >
              <div className="absolute inset-0 bg-[#0b1221]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <MessageSquare className="w-5 h-5 text-white relative z-10" />
              <span className="text-base font-bold text-white relative z-10 tracking-wide">Ask AI Assistant</span>
              
              {/* Optional animated ping effect for extra visibility */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </button>
          )}
          {approved && (
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-lg border border-emerald-400/20">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Published &amp; Approved</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Main Content Area */}
        <div className={`flex-1 overflow-y-auto pb-12 pr-2 custom-scrollbar transition-all duration-300 ${chatOpen ? 'mr-[450px]' : ''}`}>
          {/* Reports — reuse exact same component as ProjectDetail reports tab */}
          <UnifiedReportViewer
            projectId={projectId}
            userId={userId}
            currentUserRole="admin"
            onViewExpertReport={onViewReport}
          />

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

        {/* Chat Panel Sidebar */}
        <ReportAIChatPanel
          projectId={projectId}
          userId={userId}
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
        />
      </div>
    </div>
  );
}
