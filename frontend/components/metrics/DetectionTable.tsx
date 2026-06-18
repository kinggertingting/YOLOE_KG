'use client';

import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';

interface Detection {
  id: number;
  frameId: number;
  class: string;
  type: 'seen' | 'unseen';
  confidence: number;
  bbox: string;
  status: string;
}

interface DetectionTableProps {
  detections: Detection[];
}

export function DetectionTable({ detections }: DetectionTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'confidence' | 'frame' | 'class'>('confidence');

  const filteredAndSorted = useMemo(() => {
    let filtered = detections.filter((detection) =>
      detection.class.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'confidence':
          return b.confidence - a.confidence;
        case 'frame':
          return a.frameId - b.frameId;
        case 'class':
          return a.class.localeCompare(b.class);
        default:
          return 0;
      }
    });

    return filtered;
  }, [detections, searchTerm, sortBy]);

  const getTypeColor = (type: 'seen' | 'unseen') => {
    return type === 'seen'
      ? 'bg-green-500/20 text-green-400'
      : 'bg-pink-500/20 text-pink-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'tracked':
        return 'text-blue-400';
      case 'new':
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="glass-strong rounded-lg p-6 mb-8">
      <h2 className="text-lg font-semibold text-foreground mb-6">Detection Results</h2>

      {/* Search and Sort */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by class name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg glass bg-transparent pl-10 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {(['confidence', 'frame', 'class'] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                sortBy === sort
                  ? 'glass-strong bg-blue-500/20 text-blue-400'
                  : 'glass hover:bg-white/10 text-muted-foreground'
              }`}
            >
              {sort === 'confidence' && '🎯 Confidence'}
              {sort === 'frame' && '🎬 Frame'}
              {sort === 'class' && '🏷️ Class'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                Frame ID
              </th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                Class
              </th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                Type
              </th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                Confidence
              </th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                Bounding Box
              </th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map((detection) => (
              <tr
                key={detection.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="px-4 py-3 text-foreground">#{detection.frameId}</td>
                <td className="px-4 py-3">
                  <span className="text-cyan-400 font-medium">{detection.class}</span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getTypeColor(
                      detection.type
                    )}`}
                  >
                    {detection.type === 'seen' ? '✓ Seen' : '✨ Unseen'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        style={{ width: `${detection.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-foreground font-medium">
                      {(detection.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {detection.bbox}
                </td>
                <td className={`px-4 py-3 font-medium ${getStatusColor(detection.status)}`}>
                  {detection.status === 'tracked' && '🔄 Tracked'}
                  {detection.status === 'new' && '⭐ New'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSorted.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No detections found matching your criteria
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-muted-foreground">
        Showing {filteredAndSorted.length} of {detections.length} detections
      </div>
    </div>
  );
}
