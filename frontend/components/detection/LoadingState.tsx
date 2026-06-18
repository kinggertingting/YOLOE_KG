'use client';

import { motion } from 'framer-motion';

interface LoadingStateProps {
  progress: number;
  currentStep: number;
  estimatedTimeRemaining: number;
}

const STEPS = [
  'Preparing Video',
  'Initializing Models',
  'Processing Frames',
  'Analyzing Objects',
  'Finalizing Results',
];

export function LoadingState({
  progress,
  currentStep,
  estimatedTimeRemaining,
}: LoadingStateProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-strong rounded-xl p-8 w-full max-w-md mx-4"
      >
        {/* Animated Logo */}
        <div className="flex justify-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="relative h-16 w-16"
          >
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-400 border-r-cyan-400"></div>
          </motion.div>
        </div>

        <h2 className="text-center text-xl font-semibold text-foreground mb-2">
          Analyzing Video
        </h2>
        <p className="text-center text-sm text-muted-foreground mb-6">
          {STEPS[currentStep - 1] || 'Processing...'}
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-orange-500"
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-2 mb-6">
          {STEPS.map((step, idx) => (
            <motion.div
              key={step}
              initial={false}
              animate={
                idx < currentStep - 1
                  ? { opacity: 1, x: 0 }
                  : idx === currentStep - 1
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0.3, x: -10 }
              }
              className="flex items-center gap-3 text-sm"
            >
              {idx < currentStep - 1 ? (
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                </div>
              ) : idx === currentStep - 1 ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center"
                >
                  <div className="h-2 w-2 rounded-full bg-blue-400" />
                </motion.div>
              ) : (
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-white/5 border border-white/10" />
              )}
              <span
                className={
                  idx < currentStep - 1
                    ? 'text-green-400'
                    : idx === currentStep - 1
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                }
              >
                {step}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Time Remaining */}
        <div className="text-center text-xs text-muted-foreground">
          <p>Est. time remaining: {estimatedTimeRemaining}s</p>
        </div>
      </motion.div>
    </div>
  );
}
