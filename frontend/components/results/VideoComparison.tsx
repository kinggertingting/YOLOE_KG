'use client';

import { Play } from 'lucide-react';

interface VideoComparisonProps {
  originalVideoName: string;
  originalVideoUrl?: string;
  outputVideoUrl?: string;
}

export function VideoComparison({ originalVideoName, originalVideoUrl, outputVideoUrl }: VideoComparisonProps) {
  return (
    <div className="glass-strong rounded-lg p-6 mb-8">
      <h2 className="text-lg font-semibold text-foreground mb-6">Video Comparison</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Original Video */}
        <div className="glass rounded-lg overflow-hidden">
          <div className="relative aspect-video bg-black">
            {originalVideoUrl ? (
              <video
                key={originalVideoUrl}
                src={originalVideoUrl}
                className="w-full h-full object-contain"
                controls
                autoPlay
                muted
                playsInline
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                <Play className="h-12 w-12 text-blue-400/60" />
              </div>
            )}
            <p className="absolute bottom-2 left-3 text-xs text-blue-400 bg-black/60 px-2 py-0.5 rounded">Original</p>
          </div>
          <div className="p-4">
            <p className="text-sm text-foreground truncate">{originalVideoName}</p>
            <p className="text-xs text-muted-foreground mt-1">Input video stream</p>
          </div>
        </div>

        {/* Detection Result */}
        <div className="glass rounded-lg overflow-hidden">
          <div className="relative aspect-video bg-black">
            {outputVideoUrl ? (
              <video
                key={outputVideoUrl}
                src={outputVideoUrl}
                className="w-full h-full object-contain"
                controls
                autoPlay
                muted
                playsInline
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center">
                <Play className="h-12 w-12 text-cyan-400/60" />
              </div>
            )}
            <p className="absolute bottom-2 right-3 text-xs text-cyan-400 bg-black/60 px-2 py-0.5 rounded">Detection Result</p>
          </div>
          <div className="p-4">
            <p className="text-sm text-foreground">Processed output</p>
            <p className="text-xs text-muted-foreground mt-1">With bounding boxes & labels</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Detection Legend</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-400"></div>
            <span className="text-xs text-foreground">Seen Classes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-cyan-400"></div>
            <span className="text-xs text-foreground">Tracked Objects</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-pink-400"></div>
            <span className="text-xs text-foreground">Unseen Classes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-orange-400"></div>
            <span className="text-xs text-foreground">New Detections</span>
          </div>
        </div>
      </div>
    </div>
  );
}
