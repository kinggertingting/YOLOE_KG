'use client';

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PerformanceData {
  frame: number;
  precision?: number;
  recall?: number;
  mAP?: number;
  fps?: number;
}

interface ClassDistribution {
  name: string;
  value: number;
  type: 'seen' | 'unseen';
}

interface PerformanceChartsProps {
  performanceData: PerformanceData[];
  fpsData: PerformanceData[];
  classDistribution: ClassDistribution[];
}

const COLORS = {
  precision: '#3b82f6',
  recall: '#06b6d4',
  mAP: '#f59e0b',
  fps: '#10b981',
};

const CLASS_COLORS = {
  seen: '#3b82f6',
  unseen: '#ec4899',
};

export function PerformanceCharts({
  performanceData,
  fpsData,
  classDistribution,
}: PerformanceChartsProps) {
  return (
    <div className="glass-strong rounded-lg p-6 mb-8">
      <h2 className="text-lg font-semibold text-foreground mb-6">Analysis Results</h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Metrics Comparison Chart */}
        <div className="glass rounded-lg p-4 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-4">Detection Metrics Over Frames</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="frame"
                stroke="rgba(255,255,255,0.4)"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.4)"
                tick={{ fontSize: 12 }}
                domain={[0, 1]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(20, 20, 30, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
                cursor={{ stroke: 'rgba(255,255,255,0.2)' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="precision"
                stroke={COLORS.precision}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="recall"
                stroke={COLORS.recall}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="mAP"
                stroke={COLORS.mAP}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Class Distribution Pie Chart */}
        <div className="glass rounded-lg p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Class Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={classDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value})`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {classDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CLASS_COLORS[entry.type]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(20, 20, 30, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* FPS Chart */}
      <div className="glass rounded-lg p-4 mt-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Processing Speed (FPS)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={fpsData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis
              dataKey="frame"
              stroke="rgba(255,255,255,0.4)"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.4)"
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(20, 20, 30, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
              cursor={{ stroke: 'rgba(255,255,255,0.2)' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="fps"
              stroke={COLORS.fps}
              strokeWidth={2}
              dot={false}
              fill={COLORS.fps}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
