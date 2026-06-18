'use client';

import { Download, FileText, FileJson } from 'lucide-react';
import { useState } from 'react';

interface DownloadSectionProps {
  jobId: string;
  fileName: string;
}

export function DownloadSection({ jobId, fileName }: DownloadSectionProps) {
  const [downloadingVideo, setDownloadingVideo] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [downloadingCsv, setDownloadingCsv] = useState(false);

  const handleDownloadVideo = async () => {
    setDownloadingVideo(true);
    try {
      // TODO: Replace with actual video download
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert('Download started: ' + fileName.replace(/\.[^.]+$/, '_detected.mp4'));
    } finally {
      setDownloadingVideo(false);
    }
  };

  const handleDownloadReport = async () => {
    setDownloadingReport(true);
    try {
      // TODO: Replace with actual report generation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('Report generated: detection_report_' + jobId + '.pdf');
    } finally {
      setDownloadingReport(false);
    }
  };

  const handleDownloadMetrics = async () => {
    setDownloadingCsv(true);
    try {
      // TODO: Replace with actual CSV export
      await new Promise((resolve) => setTimeout(resolve, 800));
      alert('Metrics exported: detection_metrics_' + jobId + '.csv');
    } finally {
      setDownloadingCsv(false);
    }
  };

  return (
    <div className="glass-strong rounded-lg p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Download className="h-5 w-5 text-green-400" />
        <h2 className="text-lg font-semibold text-foreground">Download Results</h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Download Video Button */}
        <button
          onClick={handleDownloadVideo}
          disabled={downloadingVideo}
          className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 p-px disabled:opacity-50 transition-all"
        >
          <div className="relative flex items-center justify-center gap-2 rounded-[6px] bg-background px-6 py-3 text-foreground group-hover:bg-background/80 transition-colors">
            <FileJson className="h-4 w-4" />
            <span className="font-medium">
              {downloadingVideo ? 'Processing...' : 'Processed Video'}
            </span>
          </div>
        </button>

        {/* Download Report Button */}
        <button
          onClick={handleDownloadReport}
          disabled={downloadingReport}
          className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-orange-500 to-red-500 p-px disabled:opacity-50 transition-all"
        >
          <div className="relative flex items-center justify-center gap-2 rounded-[6px] bg-background px-6 py-3 text-foreground group-hover:bg-background/80 transition-colors">
            <FileText className="h-4 w-4" />
            <span className="font-medium">
              {downloadingReport ? 'Generating...' : 'PDF Report'}
            </span>
          </div>
        </button>

        {/* Download Metrics Button */}
        <button
          onClick={handleDownloadMetrics}
          disabled={downloadingCsv}
          className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 p-px disabled:opacity-50 transition-all"
        >
          <div className="relative flex items-center justify-center gap-2 rounded-[6px] bg-background px-6 py-3 text-foreground group-hover:bg-background/80 transition-colors">
            <FileJson className="h-4 w-4" />
            <span className="font-medium">
              {downloadingCsv ? 'Exporting...' : 'Metrics CSV'}
            </span>
          </div>
        </button>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Job ID: <span className="font-mono text-cyan-400">{jobId}</span>
      </p>
    </div>
  );
}
