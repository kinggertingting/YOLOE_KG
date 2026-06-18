'use client';

import { CheckCircle2 } from 'lucide-react';

interface ResultsCardProps {
  processingTime: number;
  totalFrames: number;
  detectedObjects: number;
  seenClasses: number;
  unseenClasses: number;
}

export function ResultsCard({
  processingTime,
  totalFrames,
  detectedObjects,
  seenClasses,
  unseenClasses,
}: ResultsCardProps) {
  return (
    <div className="glass-strong rounded-lg p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle2 className="h-6 w-6 text-green-400" />
        <h2 className="text-xl font-semibold text-foreground">Detection Complete</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="glass rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Processing Time</p>
          <p className="text-2xl font-bold text-cyan-400">{processingTime.toFixed(1)}s</p>
        </div>
        <div className="glass rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Frames</p>
          <p className="text-2xl font-bold text-blue-400">{totalFrames}</p>
        </div>
        <div className="glass rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Objects Detected</p>
          <p className="text-2xl font-bold text-orange-400">{detectedObjects}</p>
        </div>
        <div className="glass rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Seen Classes</p>
          <p className="text-2xl font-bold text-green-400">{seenClasses}</p>
        </div>
        <div className="glass rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Unseen Classes</p>
          <p className="text-2xl font-bold text-pink-400">{unseenClasses}</p>
        </div>
      </div>
    </div>
  );
}
