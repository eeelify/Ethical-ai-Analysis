import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Download, Loader2, Lock, MessageSquare } from "lucide-react";
import { api } from "../api";
import { User } from "../types";

type RoleCategory = "admin" | "expert" | "viewer";

type ReportSection = {
  principle: string;
  aiDraft?: string;
  expertEdit?: string;
  comments?: Array<{
    userId?: string;
    userName?: string;
    text: string;
    createdAt?: string;
  }>;
};

type ReportDoc = {
  _id?: string;
  id?: string;
  title?: string;
  status?: "draft" | "final" | "archived";
  generatedAt?: string;
  createdAt?: string;
  finalizedAt?: string;
  projectId?: { _id?: string; id?: string; title?: string } | string;
  content?: string; // legacy
  sections?: ReportSection[];
  summary?: string;
  expertComments?: Array<{
    userId?: string;
    userName?: string;
    text: string;
    createdAt?: string;
  }>;
};

const getRoleCategory = (role: string | undefined): RoleCategory => {
  const r = String(role || "").toLowerCase();
  if (r.includes("admin")) return "admin";
  if (r.includes("viewer")) return "viewer";
  return "expert";
};

export function ReportReview({
  reportId,
  currentUser,
  onBack,
}: {
  reportId: string;
  currentUser: User;
  onBack: () => void;
}) {
  const roleCategory = useMemo(() => getRoleCategory(currentUser.role), [currentUser.role]);
  const [loading, setLoading] = useState(true);
  const [commenting, setCommenting] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [report, setReport] = useState<ReportDoc | null>(null);
  const [activePrinciple, setActivePrinciple] = useState<string>("SUMMARY");
  const [commentText, setCommentText] = useState<string>("");

  const isLocked = report?.status === "final";
  // Allow comments even if locked (final), as long as not archived (or just allow always for experts)
  // modifying to allow experts/admins to comment on Final reports
  const canComment = (roleCategory === "expert" || roleCategory === "admin") && report?.status !== "archived";
  const canFinalize = roleCategory === "admin" && !isLocked;

  const activeSection = useMemo(() => {
    const sections = report?.sections;
    if (activePrinciple === "SUMMARY") return null;
    if (Array.isArray(sections) && sections.length > 0) {
      return sections.find((s) => s.principle === activePrinciple) || sections[0];
    }
    return {
      principle: "FULL_REPORT",
      aiDraft: report?.content || "",
      expertEdit: "",
      comments: [],
    } as ReportSection;
  }, [report, activePrinciple]);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch(api(`/api/reports/${reportId}?userId=${currentUser.id}`));
      if (!res.ok) {
        const err = await res.json().catch(() => ({} as any));
        throw new Error(err.error || "Report could not be loaded");
      }
      const data = (await res.json()) as ReportDoc;
      setReport(data);

      if (activePrinciple === "SUMMARY") {
        // keep summary active
      } else {
        const sections = Array.isArray(data.sections) ? data.sections : [];
        if (sections.length > 0 && activePrinciple === "FULL_REPORT") {
          // if we were on full report but loaded sections, stay on summary or switch
          // Default to Summary
        }
      }
    } catch (e: any) {
      alert(e?.message || "Report could not be loaded");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportId, currentUser.id]);

  const handleAddComment = async () => {
    if (!canComment) return;
    const text = commentText.trim();
    if (!text) return;
    setCommenting(true);
    try {
      let url = "";
      let body = {};

      if (activePrinciple === "SUMMARY") {
        // General Report Comment
        url = `/api/reports/${reportId}/comments`;
        body = { userId: currentUser.id, text };
      } else {
        // Section Comment
        url = `/api/reports/${reportId}/sections/${encodeURIComponent(activePrinciple)}/comments`;
        body = { userId: currentUser.id, text };
      }

      const res = await fetch(api(url), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({} as any));
        throw new Error(err.error || "Failed to add comment");
      }
      setCommentText("");
      await refresh();
    } catch (e: any) {
      alert(e?.message || "Failed to add comment");
    } finally {
      setCommenting(false);
    }
  };

  const handleFinalize = async () => {
    if (!canFinalize) return;
    const ok = window.confirm(
      "Finalize & Lock this report?\n\nAfter finalization, experts will no longer be able to edit or comment."
    );
    if (!ok) return;

    setFinalizing(true);
    try {
      const res = await fetch(api(`/api/reports/${reportId}/finalize`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({} as any));
        throw new Error(err.error || "Failed to finalize report");
      }
      await refresh();
    } catch (e: any) {
      alert(e?.message || "Failed to finalize report");
    } finally {
      setFinalizing(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const res = await fetch(api(`/api/reports/${reportId}/download?userId=${currentUser.id}`));
      if (!res.ok) {
        const err = await res.json().catch(() => ({} as any));
        throw new Error(err.error || "PDF could not be downloaded");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const name = `${String(report?.title || "report").replace(/[^a-z0-9]/gi, "_")}_${reportId}.pdf`;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(e?.message || "PDF could not be downloaded");
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14]">
      <div className="bg-[#0b1221] border-b border-white/10 sticky top-0 z-20">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">

            <div>
              <div className="text-sm text-gray-400">Report Review</div>
              <div className="text-lg font-semibold text-white">{report?.title || "Report"}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLocked && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0b1221] text-white text-xs font-semibold">
                <Lock className="h-3.5 w-3.5" />
                Final & Locked
              </span>
            )}
            {!isLocked && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-semibold">
                Draft
              </span>
            )}

            <button
              onClick={handleDownloadPdf}
              className="px-3 py-2 rounded-lg bg-[#0b1221] border border-white/10 hover:bg-[#050b14] text-sm font-medium text-gray-300 flex items-center gap-2"
              disabled={loading}
            >
              <Download className="h-4 w-4" />
              PDF
            </button>

            {canFinalize && (
              <button
                onClick={handleFinalize}
                disabled={finalizing || loading}
                className="px-4 py-2 rounded-lg bg-[#0b1221] hover:bg-[#0b1221]/10 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-60"
              >
                {finalizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                Finalize & Lock
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-6 max-w-6xl mx-auto">
        {loading ? (
          <div className="bg-[#0b1221] border border-white/10 rounded-2xl p-8 flex items-center justify-center text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Loading report...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sections list */}
            <div className="lg:col-span-1">
              <div className="bg-[#0b1221] border border-white/10 rounded-2xl p-4">
                <div className="text-sm font-semibold text-white mb-3">Sections</div>
                <div className="space-y-2">
                  <button
                    onClick={() => setActivePrinciple("SUMMARY")}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors ${activePrinciple === "SUMMARY"
                      ? "border-purple-500 bg-purple-500/20 text-purple-300 font-medium"
                      : "border-white/10 hover:bg-[#050b14] text-gray-300"
                      }`}
                  >
                    Report Summary
                  </button>

                  <div className="h-px bg-[#0f172a] my-2" />

                  {(() => {
                    const sections = Array.isArray(report?.sections) ? report!.sections!.filter(s => s.principle !== "FULL_REPORT") : [];

                    return sections.map((s) => {
                      const p = s.principle || "Section";
                      const active = p === activePrinciple;
                      return (
                        <button
                          key={p}
                          onClick={() => setActivePrinciple(p)}
                          className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors ${active
                            ? "border-blue-500 bg-blue-500/20 text-blue-300"
                            : "border-white/10 hover:bg-[#0b1221]/5 text-gray-300"
                            }`}
                        >
                          {p}
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="lg:col-span-3 space-y-6">
              {activePrinciple === "SUMMARY" ? (
                <>
                  {/* REPORT CONTENT / SUMMARY */}
                  <div className="bg-[#0b1221] border border-white/10 rounded-2xl overflow-hidden mb-6">
                    <div className="px-5 py-4 border-b border-white/10 bg-[#050b14] flex items-center justify-between">
                      <div className="text-sm font-semibold text-white">Report Content</div>
                    </div>
                    <div className="p-5">
                      <div className="whitespace-pre-wrap text-sm text-gray-200 leading-relaxed">
                        {(() => {
                          if (report?.summary) return report.summary;
                          if (report?.content) {
                            try {
                              const parsed = JSON.parse(report.content);
                              if (parsed.executiveSummary) {
                                return Array.isArray(parsed.executiveSummary) ? parsed.executiveSummary.join('\n\n') : parsed.executiveSummary;
                              }
                            } catch (e) {
                              // Not JSON, fall through
                            }
                            // Fallback if not JSON or no executiveSummary
                            // Truncate if it's very long and likely raw JSON
                            if (report.content.startsWith('{') && report.content.length > 500) {
                               return "No summary available for this format.";
                            }
                            return report.content;
                          }
                          return "No report content available.";
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* GENERAL COMMENTS */}
                  <div className="bg-[#0b1221] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/10 bg-[#0b1221] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-gray-400" />
                        <div className="text-sm font-semibold text-white">General Feedback</div>
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="text-xs text-gray-400 mb-2">
                        Use this section to provide general feedback on the entire report. Your comments will be notified to the Admin.
                      </div>

                      {Array.isArray(report?.expertComments) && report!.expertComments!.length > 0 ? (
                        <div className="space-y-3">
                          {report!.expertComments!.map((c, idx) => (
                            <div key={idx} className="border border-white/10 rounded-xl p-4 bg-[#050b14]">
                              <div className="flex items-center justify-between mb-1">
                                <div className="text-sm font-semibold text-white">
                                  {c.userName || "User"}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                                </div>
                              </div>
                              <div className="text-sm text-gray-200 whitespace-pre-wrap">{c.text}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400 italic">No general comments yet.</div>
                      )}

                      <div className="border-t border-white/10 pt-4">
                        <div className="flex flex-col gap-3">
                          <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            disabled={!canComment || commenting}
                            rows={3}
                            className="w-full border border-white/10 rounded-xl p-3 text-sm text-gray-200 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 disabled:bg-[#050b14]"
                            placeholder={canComment ? "Add a general comment..." : "Commenting is restricted."}
                          />
                          <div className="flex justify-end">
                            <button
                              onClick={handleAddComment}
                              disabled={!canComment || commenting || !commentText.trim()}
                              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                              {commenting ? (
                                <div className="flex items-center gap-2">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>Sending...</span>
                                </div>
                              ) : "Send Comment"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* AI Draft (Section specific) */}
                  <div className="bg-[#0b1221] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/10 bg-[#050b14] flex items-center justify-between">
                      <div className="text-sm font-semibold text-white">AI Draft (read-only)</div>
                      <div className="text-xs text-gray-400">
                        Section: <span className="font-medium">{activeSection?.principle}</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="whitespace-pre-wrap text-sm text-gray-200 leading-relaxed">
                        {String(activeSection?.aiDraft || report?.content || "").trim() || "No AI draft content."}
                      </div>
                    </div>
                  </div>

                  {/* Section Comments */}
                  <div className="bg-[#0b1221] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/10 bg-[#0b1221] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-gray-400" />
                        <div className="text-sm font-semibold text-white">Section Comments</div>
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      {Array.isArray(activeSection?.comments) && activeSection!.comments!.length > 0 ? (
                        <div className="space-y-3">
                          {activeSection!.comments!.map((c, idx) => (
                            <div key={idx} className="border border-white/10 rounded-xl p-4">
                              <div className="flex items-center justify-between mb-1">
                                <div className="text-sm font-semibold text-white">
                                  {c.userName || "User"}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                                </div>
                              </div>
                              <div className="text-sm text-gray-200 whitespace-pre-wrap">{c.text}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">No comments yet.</div>
                      )}

                      <div className="border-t border-white/10 pt-4">
                        <div className="flex flex-col gap-3">
                          <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            disabled={!canComment || commenting}
                            rows={3}
                            className="w-full border border-white/10 rounded-xl p-3 text-sm text-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 disabled:bg-[#050b14]"
                            placeholder={canComment ? "Add a specific comment..." : "Commenting is restricted."}
                          />
                          <div className="flex justify-end">
                            <button
                              onClick={handleAddComment}
                              disabled={!canComment || commenting || !commentText.trim()}
                              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                              {commenting ? (
                                <div className="flex items-center gap-2">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>Sending...</span>
                                </div>
                              ) : "Send Comment"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


