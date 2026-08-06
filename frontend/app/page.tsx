'use client';

import { useRef, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Header } from '@/components/layout/Header';
import { VideoUpload } from '@/components/upload/VideoUpload';
import { DetectionButton } from '@/components/detection/DetectionButton';
import { LoadingState } from '@/components/detection/LoadingState';
import { VideoComparison } from '@/components/results/VideoComparison';
import { uploadAndDetectVideo } from '@/lib/api';

type PageState = 'idle' | 'loading' | 'results';

export default function DashboardPage() {
  const [pageState, setPageState] = useState<PageState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalVideoUrl, setOriginalVideoUrl] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(45);
  const [outputVideoUrl, setOutputVideoUrl] = useState<string>('');
  const [outputFilename, setOutputFilename] = useState<string>('');
  const [error, setError] = useState<string>('');
  const progressAnimRef = useRef<number>(0);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = (file: File) => {
    if (originalVideoUrl) {
      URL.revokeObjectURL(originalVideoUrl);
    }

    const url = URL.createObjectURL(file);
    setSelectedFile(file);
    setOriginalVideoUrl(url);
    setOutputVideoUrl('');
    setOutputFilename('');
    setError('');

    setTimeout(() => {
      videoPreviewRef.current?.load();
    }, 100);
  };

  const handleStartDetection = async () => {
    if (!selectedFile) return;

    setPageState('loading');
    setProgress(0);
    setCurrentStep(1);
    setEstimatedTimeRemaining(45);
    setError('');

    const startTime = Date.now();
    const totalDuration = 30000;

    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 90);
      setProgress(newProgress);
      setCurrentStep(Math.min(Math.floor((newProgress / 100) * 5) + 1, 5));
      setEstimatedTimeRemaining(Math.max(0, Math.ceil((totalDuration - elapsed) / 1000)));

      if (newProgress < 90) {
        progressAnimRef.current = requestAnimationFrame(animateProgress);
      }
    };

    progressAnimRef.current = requestAnimationFrame(animateProgress);

    try {
      const result = await uploadAndDetectVideo(selectedFile);

      setOutputVideoUrl(result.video_url);
      setOutputFilename(result.filename);
      cancelAnimationFrame(progressAnimRef.current);
      setProgress(100);
      setCurrentStep(5);
      setEstimatedTimeRemaining(0);
      setPageState('results');
    } catch (err: unknown) {
      cancelAnimationFrame(progressAnimRef.current);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setPageState('idle');
    }
  };

  const handleReset = () => {
    if (originalVideoUrl) URL.revokeObjectURL(originalVideoUrl);
    setPageState('idle');
    setSelectedFile(null);
    setOriginalVideoUrl('');
    setProgress(0);
    setCurrentStep(1);
    setOutputVideoUrl('');
    setOutputFilename('');
    setError('');
  };

  return (
    <Layout>
      <Header />

      {pageState === 'idle' && (
        <div className="space-y-8">
          <VideoUpload onFileSelect={handleFileSelect} />

          {selectedFile && originalVideoUrl && (
            <div className="glass-strong rounded-lg p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Input Video</h2>
              <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
                <video
                  ref={videoPreviewRef}
                  src={originalVideoUrl}
                  className="h-full w-full object-contain"
                  controls
                  autoPlay
                  muted
                  playsInline
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{selectedFile.name}</p>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {selectedFile && (
            <DetectionButton
              isLoading={false}
              isDisabled={!selectedFile}
              onClick={handleStartDetection}
            />
          )}
        </div>
      )}

      {pageState === 'loading' && (
        <LoadingState
          progress={progress}
          currentStep={currentStep}
          estimatedTimeRemaining={estimatedTimeRemaining}
        />
      )}

      {pageState === 'results' && selectedFile && (
        <div className="space-y-8">
          <VideoComparison
            originalVideoName={selectedFile.name}
            originalVideoUrl={originalVideoUrl}
            outputVideoUrl={outputVideoUrl}
            outputFileName={outputFilename}
          />

          <div className="glass-strong rounded-lg p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Backend Result URL</p>
            <a
              href={outputVideoUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block break-all font-mono text-sm text-cyan-400 hover:text-cyan-300"
            >
              {outputVideoUrl}
            </a>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleReset}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 p-px transition-all hover:from-gray-500 hover:to-gray-600"
            >
              <div className="relative flex items-center justify-center gap-2 rounded-[6px] bg-background px-8 py-3 font-medium text-foreground transition-colors group-hover:bg-background/80">
                Process Another Video
              </div>
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
