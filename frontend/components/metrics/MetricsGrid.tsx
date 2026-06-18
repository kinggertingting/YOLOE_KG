'use client';

import { TrendingUp } from 'lucide-react';

interface Metrics {
  precision: number;
  recall: number;
  mAP50: number;
  mAP5095: number;
  fps: number;
  inferenceTime: number;
  avgConfidence: number;
  totalObjects: number;
}

interface MetricsGridProps {
  metrics: Metrics;
}

const METRIC_DEFINITIONS = [
  {
    key: 'precision',
    label: 'Precision',
    unit: '%',
    format: (v: number) => (v * 100).toFixed(1),
    color: 'from-blue-500 to-cyan-500',
    icon: '🎯',
  },
  {
    key: 'recall',
    label: 'Recall',
    unit: '%',
    format: (v: number) => (v * 100).toFixed(1),
    color: 'from-cyan-500 to-teal-500',
    icon: '📊',
  },
  {
    key: 'mAP50',
    label: 'mAP@50',
    unit: '%',
    format: (v: number) => (v * 100).toFixed(1),
    color: 'from-teal-500 to-green-500',
    icon: '📈',
  },
  {
    key: 'mAP5095',
    label: 'mAP@50-95',
    unit: '%',
    format: (v: number) => (v * 100).toFixed(1),
    color: 'from-green-500 to-emerald-500',
    icon: '✅',
  },
  {
    key: 'fps',
    label: 'FPS',
    unit: '',
    format: (v: number) => v.toFixed(1),
    color: 'from-orange-500 to-red-500',
    icon: '⚡',
  },
  {
    key: 'inferenceTime',
    label: 'Inference Time',
    unit: 'ms',
    format: (v: number) => v.toFixed(1),
    color: 'from-red-500 to-pink-500',
    icon: '⏱️',
  },
  {
    key: 'avgConfidence',
    label: 'Avg Confidence',
    unit: '%',
    format: (v: number) => (v * 100).toFixed(1),
    color: 'from-pink-500 to-purple-500',
    icon: '🔍',
  },
  {
    key: 'totalObjects',
    label: 'Total Objects',
    unit: '',
    format: (v: number) => Math.round(v).toString(),
    color: 'from-purple-500 to-blue-500',
    icon: '📦',
  },
];

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="glass-strong rounded-lg p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-orange-400" />
        <h2 className="text-lg font-semibold text-foreground">Performance Metrics</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
        {METRIC_DEFINITIONS.map((metric) => {
          const value = metrics[metric.key as keyof Metrics];
          return (
            <div
              key={metric.key}
              className="glass rounded-lg p-3 hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xl">{metric.icon}</span>
                <TrendingUp className="h-3 w-3 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide truncate mb-1">
                {metric.label}
              </p>
              <p className="text-lg font-bold text-foreground">
                {metric.format(value)}
                <span className="text-xs text-muted-foreground ml-1">{metric.unit}</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
