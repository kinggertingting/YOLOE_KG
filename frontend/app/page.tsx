'use client';

import { useState, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Header } from '@/components/layout/Header';
import { VideoUpload } from '@/components/upload/VideoUpload';
import { ConfigPanel, ConfigState } from '@/components/config/ConfigPanel';
import { DetectionButton } from '@/components/detection/DetectionButton';
import { LoadingState } from '@/components/detection/LoadingState';
import { ResultsCard } from '@/components/results/ResultsCard';
import { VideoComparison } from '@/components/results/VideoComparison';
import { MetricsGrid } from '@/components/metrics/MetricsGrid';
import { PerformanceCharts } from '@/components/metrics/PerformanceCharts';
import { DetectionTable } from '@/components/metrics/DetectionTable';
import { DownloadSection } from '@/components/download/DownloadSection';
import { uploadAndDetectVideo } from '@/lib/api';
import { mockDetectionResults } from '@/lib/mockData';

type PageState = 'idle' | 'loading' | 'results';

export default function DashboardPage() {
  const [pageState, setPageState] = useState<PageState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalVideoUrl, setOriginalVideoUrl] = useState<string>('');
  const [config, setConfig] = useState<ConfigState>({
    detectionMode: 'both',
    confidenceThreshold: 0.5,
  });
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(45);
  const [jobId, setJobId] = useState('');
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
    setError('');

    // Force video element to load after state update
    setTimeout(() => {
      if (videoPreviewRef.current) {
        videoPreviewRef.current.load();
      }
    }, 100);
  };

  const handleConfigChange = (newConfig: ConfigState) => {
    setConfig(newConfig);
  };

  const handleStartDetection = async () => {
    if (!selectedFile) return;

    setJobId(`job_${Date.now()}`);
    setPageState('loading');
    setProgress(0);
    setCurrentStep(1);
    setEstimatedTimeRemaining(45);
    setError('');

    // Start progress animation
    const startTime = Date.now();
    const totalDuration = 30000;

    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 90);
      setProgress(newProgress);
      const newStep = Math.floor((newProgress / 100) * 5) + 1;
      setCurrentStep(Math.min(newStep, 5));
      const remaining = Math.max(0, Math.ceil((totalDuration - elapsed) / 1000));
      setEstimatedTimeRemaining(remaining);
      if (newProgress < 90) {
        progressAnimRef.current = requestAnimationFrame(animateProgress);
      }
    };
    progressAnimRef.current = requestAnimationFrame(animateProgress);

    try {
      const result = await uploadAndDetectVideo(selectedFile, {
        detectionMode: config.detectionMode,
        confidenceThreshold: config.confidenceThreshold,
      });

      if (outputVideoUrl) URL.revokeObjectURL(outputVideoUrl);

      const videoUrl = URL.createObjectURL(result.blob);
      setOutputVideoUrl(videoUrl);
      setOutputFilename(result.filename);

      cancelAnimationFrame(progressAnimRef.current);
      setProgress(100);
      setCurrentStep(5);
      setEstimatedTimeRemaining(0);
      setPageState('results');
    } catch (err: unknown) {
      cancelAnimationFrame(progressAnimRef.current);
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMsg);
      setPageState('idle');
    }
  };

  const handleReset = () => {
    if (outputVideoUrl) URL.revokeObjectURL(outputVideoUrl);
    if (originalVideoUrl) URL.revokeObjectURL(originalVideoUrl);
    setPageState('idle');
    setSelectedFile(null);
    setOriginalVideoUrl('');
    setProgress(0);
    setCurrentStep(1);
    setJobId('');
    setOutputVideoUrl('');
    setOutputFilename('');
    setError('');
  };

  return (
    <Layout>
      <Header />

      {pageState === 'idle' && (
        <div className="space-y-8">
          {!selectedFile && (
            <VideoUpload onFileSelect={handleFileSelect} />
          )}

          {selectedFile && (
            <>
              <VideoUpload onFileSelect={handleFileSelect} />

              {/* Preview original video immediately */}
              {originalVideoUrl && (
                <div className="glass-strong rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Video Preview</h2>
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      paddingTop: '56.25%',
                      backgroundColor: '#000',
                      borderRadius: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <video
                      ref={videoPreviewRef}
                      src={originalVideoUrl}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                      controls
                      autoPlay
                      muted
                      playsInline
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{selectedFile.name}</p>
                </div>
              )}

              <ConfigPanel config={config} onChange={handleConfigChange} />

              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <DetectionButton
                isLoading={false}
                isDisabled={!selectedFile}
                onClick={handleStartDetection}
              />
            </>
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
          <ResultsCard
            processingTime={mockDetectionResults.processingTime}
            totalFrames={mockDetectionResults.totalFrames}
            detectedObjects={mockDetectionResults.detectedObjects}
            seenClasses={mockDetectionResults.seenClasses}
            unseenClasses={mockDetectionResults.unseenClasses}
          />

          <VideoComparison
            originalVideoName={selectedFile.name}
            originalVideoUrl={originalVideoUrl}
            outputVideoUrl={outputVideoUrl}
          />

          <MetricsGrid metrics={mockDetectionResults.metrics} />

          <PerformanceCharts
            performanceData={mockDetectionResults.performanceData}
            fpsData={mockDetectionResults.fpsData}
            classDistribution={mockDetectionResults.classDistribution as { name: string; value: number; type: 'seen' | 'unseen' }[]}
          />

          <DetectionTable detections={mockDetectionResults.detections as { id: number; frameId: number; class: string; type: 'seen' | 'unseen'; confidence: number; bbox: string; status: string }[]} />

          <DownloadSection
            jobId={jobId}
            fileName={outputFilename || selectedFile.name}
            outputVideoUrl={outputVideoUrl}
          />

          <div className="flex justify-center">
            <button
              onClick={handleReset}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 p-px transition-all hover:from-gray-500 hover:to-gray-600"
            >
              <div className="relative flex items-center justify-center gap-2 rounded-[6px] bg-background px-8 py-3 text-foreground group-hover:bg-background/80 transition-colors font-medium">
                ← Process Another Video
              </div>
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}