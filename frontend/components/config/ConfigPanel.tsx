'use client';

import { Settings } from 'lucide-react';
import { useState } from 'react';

export interface ConfigState {
  detectionMode: 'seen' | 'unseen' | 'both';
  confidenceThreshold: number;
}

interface ConfigPanelProps {
  config: ConfigState;
  onChange: (config: ConfigState) => void;
}

export function ConfigPanel({ config, onChange }: ConfigPanelProps) {
  const [localConfig, setLocalConfig] = useState(config);

  const handleModeChange = (mode: 'seen' | 'unseen' | 'both') => {
    const newConfig = { ...localConfig, detectionMode: mode };
    setLocalConfig(newConfig);
    onChange(newConfig);
  };

  const handleThresholdChange = (value: number) => {
    const newConfig = { ...localConfig, confidenceThreshold: value };
    setLocalConfig(newConfig);
    onChange(newConfig);
  };

  return (
    <div className="glass-strong rounded-lg p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-5 w-5 text-blue-400" />
        <h2 className="text-lg font-semibold text-foreground">Configuration</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Detection Mode */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-3">
            Detection Mode
          </label>
          <div className="space-y-2">
            {(['seen', 'unseen', 'both'] as const).map((mode) => (
              <label
                key={mode}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
              >
                <input
                  type="radio"
                  name="detectionMode"
                  value={mode}
                  checked={localConfig.detectionMode === mode}
                  onChange={() => handleModeChange(mode)}
                  className="h-4 w-4 border-blue-400 accent-blue-500"
                />
                <span className="text-sm text-foreground capitalize">
                  {mode === 'both' ? 'Seen & Unseen Classes' : `${mode.charAt(0).toUpperCase() + mode.slice(1)} Classes`}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Confidence Threshold */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-3">
            Confidence Threshold: {localConfig.confidenceThreshold.toFixed(2)}
          </label>
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={localConfig.confidenceThreshold}
              onChange={(e) => handleThresholdChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(34, 211, 238) ${localConfig.confidenceThreshold * 100}%, rgba(255, 255, 255, 0.1) ${localConfig.confidenceThreshold * 100}%, rgba(255, 255, 255, 0.1) 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0.0</span>
              <span>0.5</span>
              <span>1.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Status */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Model Status</p>
            <p className="text-xs text-muted-foreground mt-1">YOLOE + Knowledge Graph</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm text-green-400">Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
