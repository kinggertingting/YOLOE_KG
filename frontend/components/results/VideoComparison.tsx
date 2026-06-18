'use client';

import { Play } from 'lucide-react';

interface VideoComparisonProps {
  originalVideoName: string;
}

export function VideoComparison({ originalVideoName }: VideoComparisonProps) {
  return (
    <div className="glass-strong rounded-lg p-6 mb-8">
      <h2 className="text-lg font-semibold text-foreground mb-6">Video Comparison</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Original Video */}
        <div className="glass rounded-lg overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center relative group cursor-pointer">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <Play className="h-6 w-6 fill-white text-white" />
              </div>
            </div>
            <p className="absolute bottom-4 left-4 text-xs text-blue-400">Original</p>
          </div>
          <div className="p-4">
            <p className="text-sm text-foreground truncate">{originalVideoName}</p>
            <p className="text-xs text-muted-foreground mt-1">Input video stream</p>
          </div>
        </div>

        {/* Detection Result */}
        <div className="glass rounded-lg overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center relative group cursor-pointer">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-cyan-500 flex items-center justify-center group-hover:bg-cyan-600 transition-colors">
                <Play className="h-6 w-6 fill-white text-white" />
              </div>
            </div>
            {/* Bounding box preview */}
            <div className="absolute inset-0 opacity-50">
              <svg className="w-full h-full" viewBox="0 0 800 450">
                {/* Vehicle detection */}
                <rect
                  x="120" y="80" width="180" height="170"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
                <text
                  x="125" y="75"
                  fontSize="12"
                  fill="#3b82f6"
                  className="font-mono"
                >
                  Vehicle (0.94)
                </text>

                {/* Pedestrian detection */}
                <rect
                  x="400" y="100" width="80" height="300"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2"
                />
                <text
                  x="405" y="95"
                  fontSize="12"
                  fill="#22d3ee"
                  className="font-mono"
                >
                  Pedestrian (0.87)
                </text>

                {/* Unknown object detection */}
                <rect
                  x="180" y="200" width="70" height="150"
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="2"
                />
                <text
                  x="185" y="195"
                  fontSize="12"
                  fill="#ec4899"
                  className="font-mono"
                >
                  Unknown (0.73)
                </text>
              </svg>
            </div>
            <p className="absolute bottom-4 right-4 text-xs text-cyan-400">Detection Result</p>
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
