'use client';

import { Zap } from 'lucide-react';

export function Header() {
  return (
    <div className="mb-12 text-center">
      <div className="mb-4 flex items-center justify-center gap-3">
        <div className="rounded-lg glass p-2">
          <Zap className="h-8 w-8 text-accent" />
        </div>
        <h1 className="gradient-text text-4xl font-bold sm:text-5xl">
          Object Detection
        </h1>
      </div>
      <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
        Advanced autonomous driving perception system with YOLOE and knowledge graph zero-shot detection
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <span className="glass rounded-full px-3 py-1 text-sm text-cyan-400">
          ✓ Real-time Detection
        </span>
        <span className="glass rounded-full px-3 py-1 text-sm text-blue-400">
          ✓ Zero-Shot Learning
        </span>
        <span className="glass rounded-full px-3 py-1 text-sm text-orange-400">
          ✓ Multi-Class Analysis
        </span>
      </div>
    </div>
  );
}
