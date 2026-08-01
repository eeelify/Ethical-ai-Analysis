/**
 * Minimal Report Viewer Component
 * Opens PDF reports in an embedded viewer or new tab
 */

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { api } from '../api';

interface ReportViewerProps {
  reportId: string;
  currentUser: any;
  onBack: () => void;
}

export function ReportViewer({ reportId, currentUser, onBack }: ReportViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportUrl, setReportUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        // Get report file URL
        const fileUrl = api(`/api/reports/${reportId}/pdf`);
        setReportUrl(fileUrl);
        setError(null);
      } catch (err: any) {
        console.error('Error loading report:', err);
        setError(err.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      loadReport();
    }
  }, [reportId]);

  const handleDownloadPDF = () => {
    if (reportUrl) {
      window.open(reportUrl, '_blank');
    }
  };

  const handleDownloadHTML = () => {
    const htmlUrl = api(`/api/reports/${reportId}/download-html?userId=${currentUser._id}`);
    window.open(htmlUrl, '_blank');
  };

  const handleOpenInNewTab = () => {
    if (reportUrl) {
      window.open(reportUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050b14] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050b14] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <ArrowLeft className="inline h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050b14]">
      {/* Header */}
      <div className="bg-[#0b1221] shadow-[0_0_15px_rgba(0,0,0,0.5)] border-b sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-white">Report Viewer</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleOpenInNewTab}
              className="flex items-center px-4 py-2 text-sm font-medium text-slate-300 bg-[#0b1221] border border-white/20 rounded-lg hover:bg-[#050b14]"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </button>
            <button
              onClick={handleDownloadHTML}
              className="flex items-center px-4 py-2 text-sm font-medium text-slate-300 bg-[#0b1221] border border-white/20 rounded-lg hover:bg-[#050b14]"
            >
              <Download className="h-4 w-4 mr-2" />
              Download HTML
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="p-6">
        <div className="bg-[#0b1221] rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.5)] border" style={{ minHeight: '800px' }}>
          {reportUrl && (
            <iframe
              src={reportUrl}
              className="w-full"
              style={{ height: 'calc(100vh - 200px)', minHeight: '800px', border: 'none' }}
              title="Report Viewer"
            />
          )}
        </div>
      </div>
    </div>
  );
}

