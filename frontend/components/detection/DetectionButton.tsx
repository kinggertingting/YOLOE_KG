'use client';

import { Play } from 'lucide-react';

interface DetectionButtonProps {
  isLoading: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

export function DetectionButton({
  isLoading,
  isDisabled,
  onClick,
}: DetectionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled || isLoading}
      className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 p-px disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    >
      <div className="relative flex items-center justify-center gap-3 rounded-[6px] bg-background px-8 py-4 text-lg font-semibold text-foreground group-hover:bg-background/80 transition-colors">
        <Play className="h-5 w-5 fill-current" />
        {isLoading ? 'Processing...' : 'Start Detection'}
      </div>
    </button>
  );
}
