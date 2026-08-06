'use client';

interface VideoComparisonProps {
  originalVideoName: string;
  originalVideoUrl?: string;
  outputVideoUrl?: string;
  outputFileName?: string;
}

export function VideoComparison({
  originalVideoName,
  originalVideoUrl,
  outputVideoUrl,
  outputFileName,
}: VideoComparisonProps) {
  return (
    <div className="glass-strong rounded-lg p-6">
      <h2 className="mb-6 text-xl font-semibold text-foreground">Video Comparison</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="glass overflow-hidden rounded-lg">
          <div className="relative aspect-video bg-black">
            <video
              key={originalVideoUrl}
              src={originalVideoUrl}
              className="h-full w-full object-contain"
              controls
              muted
              playsInline
            >
              Your browser does not support the video tag.
            </video>
            <p className="absolute bottom-2 left-3 rounded bg-black/60 px-2 py-0.5 text-xs text-blue-400">
              Original
            </p>
          </div>
          <div className="p-4">
            <p className="truncate text-sm text-foreground">{originalVideoName}</p>
            <p className="mt-1 text-xs text-muted-foreground">Input video</p>
          </div>
        </div>

        <div className="glass overflow-hidden rounded-lg">
          <div className="relative aspect-video bg-black">
            <video
              key={outputVideoUrl}
              src={outputVideoUrl}
              className="h-full w-full object-contain"
              controls
              autoPlay
              muted
              playsInline
            >
              Your browser does not support the video tag.
            </video>
            <p className="absolute bottom-2 right-3 rounded bg-black/60 px-2 py-0.5 text-xs text-cyan-400">
              Backend Result
            </p>
          </div>
          <div className="p-4">
            <p className="truncate text-sm text-foreground">{outputFileName || 'Processed output'}</p>
            <p className="mt-1 text-xs text-muted-foreground">Video returned by backend</p>
          </div>
        </div>
      </div>
    </div>
  );
}
