'use client';

import { useState } from 'react';
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
import { mockDetectionResults } from '@/lib/mockData';

type PageState = 'idle' | 'loading' | 'results';

export default function DashboardPage() {
  const [pageState, setPageState] = useState<PageState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [config, setConfig] = useState<ConfigState>({
    detectionMode: 'both',
    confidenceThreshold: 0.5,
  });
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(45);
  const [jobId, setJobId] = useState('');

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
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

    // Simulate processing steps
    const steps = 5;
    const totalDuration = 3000; // 3 seconds for demo
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 99);
      setProgress(newProgress);

      // Update step based on progress
      const newStep = Math.floor((newProgress / 100) * steps) + 1;
      setCurrentStep(Math.min(newStep, steps));

      // Update estimated time
      const estimatedTotal = totalDuration / (elapsed / totalDuration || 1);
      setEstimatedTimeRemaining(Math.max(0, Math.ceil((estimatedTotal - elapsed) / 1000)));

      if (newProgress < 99) {
        requestAnimationFrame(updateProgress);
      } else {
        // Processing complete
        setTimeout(() => {
          setProgress(100);
          setCurrentStep(5);
          setEstimatedTimeRemaining(0);
          setPageState('results');
        }, 500);
      }
    };

    updateProgress();
  };

  const handleReset = () => {
    setPageState('idle');
    setSelectedFile(null);
    setProgress(0);
    setCurrentStep(1);
    setJobId('');
  };

  return (
    <Layout>
      <Header />

      {pageState === 'idle' && (
        <div className="space-y-8">
          {!selectedFile && (
            <VideoUpload
              onFileSelect={handleFileSelect}
            />
          )}

          {selectedFile && (
            <>
              <VideoUpload
                onFileSelect={handleFileSelect}
              />

              <ConfigPanel config={config} onChange={handleConfigChange} />

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

          <VideoComparison originalVideoName={selectedFile.name} />

          <MetricsGrid metrics={mockDetectionResults.metrics} />

          <PerformanceCharts
            performanceData={mockDetectionResults.performanceData}
            fpsData={mockDetectionResults.fpsData}
            classDistribution={mockDetectionResults.classDistribution}
          />

          <DetectionTable detections={mockDetectionResults.detections} />

          <DownloadSection jobId={jobId} fileName={selectedFile.name} />

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
